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