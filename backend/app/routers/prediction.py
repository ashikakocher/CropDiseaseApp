from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
import numpy as np
from sqlalchemy.orm import Session
import uuid
from app.model_loader import model, class_names
from app.utils import preprocess_image, clean_prediction, get_severity
from app.dependencies import get_current_user, get_db
from app import models

router = APIRouter()

# -------------------------------------------------
# Description Database
# -------------------------------------------------

DESCRIPTION_DATABASE = {
    "Late blight": "Late blight is a fast-spreading fungal disease occurring in humid conditions."
}

# -------------------------------------------------
# Protected Prediction Route
# -------------------------------------------------
@router.post("/predict")
async def predict(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")

    contents = await file.read()

    filename = f"uploads/{uuid.uuid4()}.jpg"
    with open(filename, "wb") as f:
        f.write(contents)

    image = preprocess_image(contents)

    prediction = model.predict(image)
    class_index = int(np.argmax(prediction))
    confidence = float(np.max(prediction)) * 100

    class_name = class_names[class_index]
    crop, disease = clean_prediction(class_name)

    severity = get_severity(confidence)

    # Step 1: split disease into words
    words = disease.lower().split()

    # Step 2: start query
    query = db.query(models.ShopMedicine)

    # Step 3: apply filters
    for word in words:
        query = query.filter(
            models.ShopMedicine.treatment.ilike(f"%{word}%")
        )

    # Step 4: execute query
    shop_medicines = query.all()

    new_prediction = models.Prediction(
        crop=crop,
        disease=disease,
        confidence=confidence,
        severity=severity,
        latitude=0,
        longitude=0,
        image_path=filename,
        owner_id=current_user.id
    )

    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)

    treatment_info = []

    seen = set()

    for med in shop_medicines:
        key = med.medicine_name.strip().lower()

        if key not in seen:
            treatment_info.append({
                "medicine_name": med.medicine_name,
                "treatment": med.treatment,
                "dosage": med.dosage
            })
            seen.add(key)

    # -------------------------------------------------
    # Shop matching logic
    # -------------------------------------------------

    recommended_medicines = [m.medicine_name for m in shop_medicines]
    shops_data = []
    available_shops = []

    query = (
        db.query(models.Shop, models.ShopMedicine)
        .join(models.ShopMedicine, models.Shop.id == models.ShopMedicine.shop_id)
    )

    if recommended_medicines:
        query = query.filter(
            models.ShopMedicine.medicine_name.in_(recommended_medicines)
        )
    else:
        query = query.filter(
            models.ShopMedicine.treatment.ilike(f"%{disease}%")
        )

    if current_user.city:
        query = query.filter(
            models.Shop.city.ilike(f"%{current_user.city}%")
        ) 

    available_shops = query.all()
    if not treatment_info:
        seen = set()

        for shop, medicine in available_shops:
            key = medicine.medicine_name.strip().lower()

            if key not in seen:
                treatment_info.append({
                    "medicine_name": medicine.medicine_name,
                    "treatment": medicine.treatment,
                    "dosage": medicine.dosage,
                    "expert_id": None
                })
                seen.add(key)

    grouped_shops = {}

    for shop, medicine in available_shops:
        shop_key = f"{shop.shop_name.strip().lower()}|{shop.address.strip().lower()}|{shop.city.strip().lower()}"

        if shop_key not in grouped_shops:
            grouped_shops[shop_key] = {
                "shop_name": shop.shop_name,
                "city": shop.city,
                "area": shop.area,
                "address": shop.address,
                "medicines": []
            }

        medicine_exists = any(
            m["medicine_name"].strip().lower() == medicine.medicine_name.strip().lower()
            for m in grouped_shops[shop_key]["medicines"]
        )

        if not medicine_exists:
            grouped_shops[shop_key]["medicines"].append({
                "medicine_name": medicine.medicine_name,
                "stock_quantity": medicine.stock_quantity,
                "price": medicine.price,
                "treatment": medicine.treatment,
                "dosage": medicine.dosage
            })

    shops_data = list(grouped_shops.values())

    return {
        "crop": crop,
        "disease": disease,
        "confidence": round(confidence, 2),
        "severity": severity,
        "treatments": treatment_info,
        "shops": shops_data
    }

# -------------------------------------------------
# History
# -------------------------------------------------

@router.get("/my-history")
def get_my_predictions(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    predictions = db.query(models.Prediction)\
        .filter(models.Prediction.owner_id == current_user.id)\
        .all()

    result = []

    for pred in predictions:
        disease = pred.disease

        # -------------------------------
        # ✅ TREATMENT LOGIC
        # -------------------------------
        words = disease.lower().split()

        query = db.query(models.ShopMedicine)

        for word in words:
            query = query.filter(
                models.ShopMedicine.treatment.ilike(f"%{word}%")
            )

        shop_medicines = query.all()

        treatment_info = []
        seen = set()

        for med in shop_medicines:
            key = med.medicine_name.strip().lower()

            if key not in seen:
                treatment_info.append({
                    "medicine_name": med.medicine_name,
                    "dosage": med.dosage,
                    "description": med.treatment
                })
                seen.add(key)

        # -------------------------------
        # ✅ SHOP LOGIC (same as before)
        # -------------------------------
        recommended_medicines = [m.medicine_name for m in shop_medicines]

        query = (
            db.query(models.Shop, models.ShopMedicine)
            .join(models.ShopMedicine, models.Shop.id == models.ShopMedicine.shop_id)
        )

        if recommended_medicines:
            query = query.filter(
                models.ShopMedicine.medicine_name.in_(recommended_medicines)
            )
        else:
            query = query.filter(
                models.ShopMedicine.treatment.ilike(f"%{disease}%")
            )

        available_shops = query.all()

        grouped_shops = {}

        for shop, medicine in available_shops:
            key = f"{shop.shop_name}|{shop.address}|{shop.city}"

            if key not in grouped_shops:
                grouped_shops[key] = {
                    "shop_name": shop.shop_name,
                    "city": shop.city,
                    "area": shop.area,
                    "address": shop.address,
                    "medicines": []
                }

            grouped_shops[key]["medicines"].append({
                "medicine_name": medicine.medicine_name,
                "price": medicine.price,
                "stock_quantity": medicine.stock_quantity,
                "dosage": medicine.dosage
            })

        # -------------------------------
        # ✅ FINAL RESPONSE
        # -------------------------------
        result.append({
            "id": pred.id,
            "crop": pred.crop,
            "disease": pred.disease,
            "confidence": pred.confidence,
            "severity": pred.severity,
            "image_path": pred.image_path,
            "created_at": pred.created_at,

            "treatments": treatment_info,   # ✅ ADD THIS
            "shops": list(grouped_shops.values())
        })

    return result


# -------------------------------------------------
# Delete Prediction
# -------------------------------------------------

@router.delete("/delete-prediction/{id}")
def delete_prediction(
    id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prediction = db.query(models.Prediction).filter(
        models.Prediction.id == id,
        models.Prediction.owner_id == current_user.id
    ).first()

    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    db.delete(prediction)
    db.commit()

    return {"message": "Prediction deleted successfully"}