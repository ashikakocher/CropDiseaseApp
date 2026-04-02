from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register", response_model=schemas.SupplierResponse)
def register_supplier(payload: schemas.SupplierCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Supplier).filter(models.Supplier.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_supplier = models.Supplier(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        city=payload.city,
        area=payload.area,
        password_hash=hash_password(payload.password)
    )

    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)
    return new_supplier


@router.post("/login", response_model=schemas.Token)
def login_supplier(payload: schemas.SupplierLogin, db: Session = Depends(get_db)):
    supplier = db.query(models.Supplier).filter(models.Supplier.email == payload.email).first()

    if not supplier or not verify_password(payload.password, supplier.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": supplier.email, "role": "supplier"})
    return {"access_token": token, "token_type": "bearer"}

from app.auth import get_current_supplier


@router.get("/profile")
def get_supplier_profile(
    db: Session = Depends(get_db),
    current_supplier: models.Supplier = Depends(get_current_supplier)
):
    return {
        "id": current_supplier.id,
        "name": current_supplier.name,
        "email": current_supplier.email,
        "phone": current_supplier.phone,
        "city": current_supplier.city,
        "area": current_supplier.area,
    }


@router.put("/profile")
def update_supplier_profile(
    payload: dict,
    db: Session = Depends(get_db),
    current_supplier: models.Supplier = Depends(get_current_supplier)
):
    supplier = db.query(models.Supplier).filter(models.Supplier.id == current_supplier.id).first()

    supplier.name = payload.get("name", supplier.name)
    supplier.phone = payload.get("phone", supplier.phone)
    supplier.city = payload.get("city", supplier.city)
    supplier.area = payload.get("area", supplier.area)

    db.commit()
    db.refresh(supplier)

    return {"message": "Profile updated successfully"}