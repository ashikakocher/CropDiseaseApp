from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.auth import get_current_supplier, get_db

router = APIRouter(prefix="/shops", tags=["Shops"])


@router.post("/with-medicines")
def create_shop_with_medicines(
    data: schemas.ShopWithMedicinesCreate,
    db: Session = Depends(get_db),
    current_supplier: models.Supplier = Depends(get_current_supplier)
):
    existing_shop = db.query(models.Shop).filter(
        models.Shop.supplier_id == current_supplier.id,
        models.Shop.shop_name.ilike(data.shop.shop_name.strip()),
        models.Shop.city.ilike(data.shop.city.strip()),
        models.Shop.address.ilike(data.shop.address.strip())
    ).first()

    if existing_shop:
        raise HTTPException(status_code=400, detail="Shop already exists")

    new_shop = models.Shop(
        supplier_id=current_supplier.id,
        shop_name=data.shop.shop_name,
        city=data.shop.city,
        area=data.shop.area,
        address=data.shop.address,
        latitude=data.shop.latitude,
        longitude=data.shop.longitude
    )

    db.add(new_shop)
    db.commit()
    db.refresh(new_shop)

    for med in data.medicines:
        new_medicine = models.ShopMedicine(
            shop_id=new_shop.id,
            medicine_name=med.medicine_name,
            stock_quantity=med.stock_quantity,
            price=med.price,
            treatment=med.treatment,
            dosage=med.dosage
        )
        db.add(new_medicine)

    db.commit()

    return {
        "message": "Shop and medicines added successfully",
        "shop_id": new_shop.id
    }


@router.get("/my-shops")
def get_my_shops(
    db: Session = Depends(get_db),
    current_supplier: models.Supplier = Depends(get_current_supplier)
):
    shops = db.query(models.Shop).filter(
        models.Shop.supplier_id == current_supplier.id
    ).all()

    result = []

    for shop in shops:
        result.append({
            "id": shop.id,
            "shop_name": shop.shop_name,
            "city": shop.city,
            "area": shop.area,
            "address": shop.address,
            "latitude": shop.latitude,
            "longitude": shop.longitude,
            "total_medicines": len(shop.medicines)
        })

    return result


@router.get("/{shop_id}")
def get_shop_details(
    shop_id: int,
    db: Session = Depends(get_db),
    current_supplier: models.Supplier = Depends(get_current_supplier)
):
    shop = db.query(models.Shop).filter(
        models.Shop.id == shop_id,
        models.Shop.supplier_id == current_supplier.id
    ).first()

    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")

    return {
        "id": shop.id,
        "shop_name": shop.shop_name,
        "city": shop.city,
        "area": shop.area,
        "address": shop.address,
        "latitude": shop.latitude,
        "longitude": shop.longitude,
        "medicines": [
            {
                "id": med.id,
                "medicine_name": med.medicine_name,
                "stock_quantity": med.stock_quantity,
                "price": med.price,
                "treatment": med.treatment,
                "dosage": med.dosage
            }
            for med in shop.medicines
        ]
    }


@router.post("/{shop_id}/medicines")
def add_medicine_to_shop(
    shop_id: int,
    med: schemas.ShopMedicineCreate,
    db: Session = Depends(get_db),
    current_supplier: models.Supplier = Depends(get_current_supplier)
):
    shop = db.query(models.Shop).filter(
        models.Shop.id == shop_id,
        models.Shop.supplier_id == current_supplier.id
    ).first()

    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")

    existing_medicine = db.query(models.ShopMedicine).filter(
        models.ShopMedicine.shop_id == shop_id,
        models.ShopMedicine.medicine_name.ilike(med.medicine_name.strip())
    ).first()

    if existing_medicine:
        raise HTTPException(status_code=400, detail="Medicine already exists in this shop")

    new_medicine = models.ShopMedicine(
        shop_id=shop_id,
        medicine_name=med.medicine_name,
        stock_quantity=med.stock_quantity,
        price=med.price,
        treatment=med.treatment,
        dosage=med.dosage
    )

    db.add(new_medicine)
    db.commit()
    db.refresh(new_medicine)

    return {
        "message": "Medicine added successfully",
        "medicine_id": new_medicine.id
    }


@router.put("/medicines/{medicine_id}")
def update_medicine(
    medicine_id: int,
    med: schemas.ShopMedicineCreate,
    db: Session = Depends(get_db),
    current_supplier: models.Supplier = Depends(get_current_supplier)
):
    medicine = db.query(models.ShopMedicine).join(models.Shop).filter(
        models.ShopMedicine.id == medicine_id,
        models.Shop.supplier_id == current_supplier.id
    ).first()

    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    medicine.medicine_name = med.medicine_name
    medicine.stock_quantity = med.stock_quantity
    medicine.price = med.price
    medicine.treatment = med.treatment
    medicine.dosage = med.dosage

    db.commit()

    return {"message": "Medicine updated successfully"}


@router.delete("/medicines/{medicine_id}")
def delete_medicine(
    medicine_id: int,
    db: Session = Depends(get_db),
    current_supplier: models.Supplier = Depends(get_current_supplier)
):
    medicine = db.query(models.ShopMedicine).join(models.Shop).filter(
        models.ShopMedicine.id == medicine_id,
        models.Shop.supplier_id == current_supplier.id
    ).first()

    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    db.delete(medicine)
    db.commit()

    return {"message": "Medicine deleted successfully"}


@router.put("/{shop_id}")
def update_shop(
    shop_id: int,
    shop_data: schemas.ShopCreate,
    db: Session = Depends(get_db),
    current_supplier: models.Supplier = Depends(get_current_supplier)
):
    shop = db.query(models.Shop).filter(
        models.Shop.id == shop_id,
        models.Shop.supplier_id == current_supplier.id
    ).first()

    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")

    shop.shop_name = shop_data.shop_name
    shop.city = shop_data.city
    shop.area = shop_data.area
    shop.address = shop_data.address
    shop.latitude = shop_data.latitude
    shop.longitude = shop_data.longitude

    db.commit()

    return {"message": "Shop updated successfully"}


@router.delete("/{shop_id}")
def delete_shop(
    shop_id: int,
    db: Session = Depends(get_db),
    current_supplier: models.Supplier = Depends(get_current_supplier)
):
    shop = db.query(models.Shop).filter(
        models.Shop.id == shop_id,
        models.Shop.supplier_id == current_supplier.id
    ).first()

    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")

    for med in shop.medicines:
        db.delete(med)

    db.delete(shop)
    db.commit()

    return {"message": "Shop deleted successfully"}