from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.auth import hash_password
from app.schemas import AdminUserCreate,AdminSupplierCreate
from app.database import SessionLocal
from app.models import Admin, User, Supplier, Expert, Shop, ShopMedicine, Treatment, Prediction, Query as QueryModel
from app.auth import verify_password, create_access_token, get_current_admin
from app.schemas import (
    AdminLogin,
    Token,
    AdminUserUpdate,
    AdminShopUpdate,
    ShopMedicineCreate,
    ShopMedicineUpdate,
    TreatmentCreate,
    TreatmentUpdate,
    AdminSupplierUpdate,
    AdminShopCreate,
    AdminShopUpdate
)
from sqlalchemy import func, desc
from fastapi import Query
from datetime import datetime


router = APIRouter(prefix="/admin", tags=["Admin"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login", response_model=Token)
def admin_login(admin_data: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == admin_data.email).first()

    if not admin or not verify_password(admin_data.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid admin email or password")

    access_token = create_access_token(
        data={"sub": str(admin.id), "role": "admin"}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/dashboard-stats")
def get_dashboard_stats(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_suppliers = db.query(Supplier).count()
    total_experts = db.query(Expert).count()
    total_shops = db.query(Shop).count()
    total_medicines = db.query(ShopMedicine).count()
    total_treatments = db.query(Treatment).count()
    total_predictions = db.query(Prediction).count()
    total_queries = db.query(QueryModel).count()

    most_common_disease = (
        db.query(Prediction.disease, func.count(Prediction.id).label("count"))
        .group_by(Prediction.disease)
        .order_by(desc("count"))
        .first()
    )

    most_affected_crop = (
        db.query(Prediction.crop, func.count(Prediction.id).label("count"))
        .group_by(Prediction.crop)
        .order_by(desc("count"))
        .first()
    )

    return {
        "total_users": total_users,
        "total_suppliers": total_suppliers,
        "total_experts": total_experts,
        "total_shops": total_shops,
        "total_medicines": total_medicines,
        "total_treatments": total_treatments,
        "total_predictions": total_predictions,
        "total_queries": total_queries,
        "most_common_disease": most_common_disease[0] if most_common_disease else "N/A",
        "most_common_disease_count": most_common_disease[1] if most_common_disease else 0,
        "most_affected_crop": most_affected_crop[0] if most_affected_crop else "N/A",
        "most_affected_crop_count": most_affected_crop[1] if most_affected_crop else 0,
    }
@router.get("/analytics")
def get_admin_analytics(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    disease_data = (
        db.query(Prediction.disease, func.count(Prediction.id))
        .group_by(Prediction.disease)
        .limit(10)
        .all()
    )

    crop_data = (
        db.query(Prediction.crop, func.count(Prediction.id))
        .group_by(Prediction.crop)
        .limit(10)
        .all()
    )

    return {
        "disease_labels": [row[0] for row in disease_data],
        "disease_counts": [row[1] for row in disease_data],
        "crop_labels": [row[0] for row in crop_data],
        "crop_counts": [row[1] for row in crop_data],
    }
@router.get("/users")
def get_all_users(
    approved: bool = None,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(User)

    if approved is not None:
        query = query.filter(User.status == ("approved" if approved else "pending"))

    return query.order_by(User.created_at.desc()).all()

@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    user_data: AdminUserUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # prevent duplicate email
    existing_user = db.query(User).filter(User.email == user_data.email, User.id != user_id).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already in use by another user")

    user.name = user_data.name
    user.email = user_data.email
    user.phone = user_data.phone
    user.city = user_data.city
    user.area = user_data.area

    db.commit()
    db.refresh(user)

    return {"message": "User updated successfully", "user": user}

@router.get("/suppliers")
def get_all_suppliers(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(Supplier).order_by(Supplier.created_at.desc()).all()


@router.get("/experts")
def get_all_experts(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(Expert).order_by(Expert.created_at.desc()).all()


@router.get("/shops")
def get_all_shops(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(Shop).order_by(Shop.created_at.desc()).all()

@router.put("/shops/{shop_id}")
def update_shop(
    shop_id: int,
    shop_data: AdminShopUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    shop = db.query(Shop).filter(Shop.id == shop_id).first()

    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")

    supplier = db.query(Supplier).filter(Supplier.id == shop_data.supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    shop.supplier_id = shop_data.supplier_id
    shop.shop_name = shop_data.shop_name
    shop.city = shop_data.city
    shop.area = shop_data.area
    shop.address = shop_data.address
    shop.latitude = shop_data.latitude
    shop.longitude = shop_data.longitude

    db.commit()
    db.refresh(shop)

    return {"message": "Shop updated successfully", "shop": shop}

@router.post("/shops")
def create_shop(
    shop_data: AdminShopCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    supplier = db.query(Supplier).filter(Supplier.id == shop_data.supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    new_shop = Shop(
        supplier_id=shop_data.supplier_id,
        shop_name=shop_data.shop_name,
        city=shop_data.city,
        area=shop_data.area,
        address=shop_data.address,
        latitude=shop_data.latitude,
        longitude=shop_data.longitude,
    )

    db.add(new_shop)
    db.commit()
    db.refresh(new_shop)

    return {"message": "Shop created successfully", "shop": new_shop}

@router.get("/treatments")
def get_all_treatments(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(Treatment).order_by(Treatment.id.desc()).all()

@router.get("/predictions")
def get_all_predictions(
    crop: str = Query(None),
    disease: str = Query(None),
    severity: str = Query(None),
    date: str = Query(None),
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(Prediction)

    if crop:
        query = query.filter(Prediction.crop.ilike(f"%{crop}%"))

    if disease:
        query = query.filter(Prediction.disease.ilike(f"%{disease}%"))

    if severity:
        query = query.filter(Prediction.severity.ilike(f"%{severity}%"))

    if date:
        try:
            selected_date = datetime.strptime(date, "%Y-%m-%d").date()
            query = query.filter(func.date(Prediction.created_at) == selected_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    return query.order_by(Prediction.created_at.desc()).all()

@router.get("/queries")
def get_all_queries(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    
    return db.query(QueryModel).order_by(Query.created_at.desc()).all()


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.delete("/suppliers/{supplier_id}")
def delete_supplier(
    supplier_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    db.delete(supplier)
    db.commit()
    return {"message": "Supplier deleted successfully"}
@router.delete("/shops/{shop_id}")
def delete_shop(
    shop_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")

    db.delete(shop)
    db.commit()
    return {"message": "Shop deleted successfully"}


@router.delete("/treatments/{treatment_id}")
def delete_treatment(
    treatment_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    treatment = db.query(Treatment).filter(Treatment.id == treatment_id).first()
    if not treatment:
        raise HTTPException(status_code=404, detail="Treatment not found")

    db.delete(treatment)
    db.commit()
    return {"message": "Treatment deleted successfully"}


@router.get("/medicines")
def get_all_medicines(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(ShopMedicine).order_by(ShopMedicine.created_at.desc()).all()

@router.post("/medicines")
def create_medicine(
    medicine_data: ShopMedicineCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    shop = db.query(Shop).filter(Shop.id == medicine_data.shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")

    new_medicine = ShopMedicine(
        shop_id=medicine_data.shop_id,
        medicine_name=medicine_data.medicine_name,
        stock_quantity=medicine_data.stock_quantity,
        price=medicine_data.price,
        treatment=medicine_data.treatment,
        dosage=medicine_data.dosage,
    )

    db.add(new_medicine)
    db.commit()
    db.refresh(new_medicine)

    return {"message": "Medicine added successfully", "medicine": new_medicine}


@router.put("/medicines/{medicine_id}")
def update_medicine(
    medicine_id: int,
    medicine_data: ShopMedicineUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    medicine = db.query(ShopMedicine).filter(ShopMedicine.id == medicine_id).first()

    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    shop = db.query(Shop).filter(Shop.id == medicine_data.shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")

    medicine.shop_id = medicine_data.shop_id
    medicine.medicine_name = medicine_data.medicine_name
    medicine.stock_quantity = medicine_data.stock_quantity
    medicine.price = medicine_data.price
    medicine.treatment = medicine_data.treatment
    medicine.dosage = medicine_data.dosage

    db.commit()
    db.refresh(medicine)

    return {"message": "Medicine updated successfully", "medicine": medicine}


@router.delete("/medicines/{medicine_id}")
def delete_medicine(
    medicine_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    medicine = db.query(ShopMedicine).filter(ShopMedicine.id == medicine_id).first()

    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    db.delete(medicine)
    db.commit()

    return {"message": "Medicine deleted successfully"}


@router.post("/treatments")
def create_treatment(
    treatment_data: TreatmentCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    if treatment_data.expert_id:
        expert = db.query(Expert).filter(Expert.id == treatment_data.expert_id).first()
        if not expert:
            raise HTTPException(status_code=404, detail="Expert not found")

    new_treatment = Treatment(
        disease_name=treatment_data.disease_name,
        medicine_name=treatment_data.medicine_name,
        treatment=treatment_data.treatment,
        dosage=treatment_data.dosage,
        expert_id=treatment_data.expert_id,
    )

    db.add(new_treatment)
    db.commit()
    db.refresh(new_treatment)

    return {"message": "Treatment added successfully", "treatment": new_treatment}


@router.put("/treatments/{treatment_id}")
def update_treatment(
    treatment_id: int,
    treatment_data: TreatmentUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    treatment = db.query(Treatment).filter(Treatment.id == treatment_id).first()

    if not treatment:
        raise HTTPException(status_code=404, detail="Treatment not found")

    if treatment_data.expert_id:
        expert = db.query(Expert).filter(Expert.id == treatment_data.expert_id).first()
        if not expert:
            raise HTTPException(status_code=404, detail="Expert not found")

    treatment.disease_name = treatment_data.disease_name
    treatment.medicine_name = treatment_data.medicine_name
    treatment.treatment = treatment_data.treatment
    treatment.dosage = treatment_data.dosage
    treatment.expert_id = treatment_data.expert_id

    db.commit()
    db.refresh(treatment)

    return {"message": "Treatment updated successfully", "treatment": treatment}



@router.post("/users")
def create_user(
    user_data: AdminUserCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # check if email exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        city=user_data.city,
        area=user_data.area,
        password_hash=hash_password(user_data.password),
        status="approved"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully", "user": new_user}

@router.post("/suppliers")
def create_supplier(
    supplier_data: AdminSupplierCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing_supplier = db.query(Supplier).filter(Supplier.email == supplier_data.email).first()
    if existing_supplier:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_supplier = Supplier(
        name=supplier_data.name,
        email=supplier_data.email,
        phone=supplier_data.phone,
        city=supplier_data.city,
        area=supplier_data.area,
        password_hash=hash_password(supplier_data.password),
        kyc_type=supplier_data.kyc_type,
        kyc_status=supplier_data.kyc_status or "pending"
    )

    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)

    return {
        "message": "Supplier created successfully",
        "supplier": {
            "id": new_supplier.id,
            "name": new_supplier.name,
            "email": new_supplier.email,
            "phone": new_supplier.phone,
            "city": new_supplier.city,
            "area": new_supplier.area,
            "kyc_type": new_supplier.kyc_type,
            "kyc_document": new_supplier.kyc_document,
            "kyc_status": new_supplier.kyc_status,
        }
    }

@router.put("/suppliers/{supplier_id}")
def update_supplier(
    supplier_id: int,
    supplier_data: AdminSupplierUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()

    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    existing_supplier = (
        db.query(Supplier)
        .filter(Supplier.email == supplier_data.email, Supplier.id != supplier_id)
        .first()
    )
    if existing_supplier:
        raise HTTPException(status_code=400, detail="Email already in use by another supplier")

    supplier.name = supplier_data.name
    supplier.email = supplier_data.email
    supplier.phone = supplier_data.phone
    supplier.city = supplier_data.city
    supplier.area = supplier_data.area
    supplier.kyc_type = supplier_data.kyc_type
    supplier.kyc_status = supplier_data.kyc_status

    db.commit()
    db.refresh(supplier)

    return {
        "message": "Supplier updated successfully",
        "supplier": {
            "id": supplier.id,
            "name": supplier.name,
            "email": supplier.email,
            "phone": supplier.phone,
            "city": supplier.city,
            "area": supplier.area,
            "kyc_type": supplier.kyc_type,
            "kyc_document": supplier.kyc_document,
            "kyc_status": supplier.kyc_status,
        }
    }



@router.get("/users/pending")
def get_pending_users(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(User).filter(User.status == "pending").all()


@router.put("/users/approve/{user_id}")
def approve_user(
    user_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.status = "approved"

    db.commit()

    return {"message": "User approved successfully"}


@router.put("/users/reject/{user_id}")
def reject_user(
    user_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.status = "rejected"
    db.commit()

    return {"message": "User rejected"}