import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models, schemas
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_supplier,
)

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])


# ---------------- DB ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- PATHS ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))          # app/routers
APP_DIR = os.path.dirname(BASE_DIR)                            # app
PROJECT_BACKEND_DIR = os.path.dirname(APP_DIR)                 # backend root
KYC_DIR = os.path.join(PROJECT_BACKEND_DIR, "uploads", "kyc")

os.makedirs(KYC_DIR, exist_ok=True)


# ---------------- REGISTER ----------------
@router.post("/register", response_model=schemas.SupplierResponse)
async def register_supplier(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(None),
    city: str = Form(...),
    area: str = Form(None),
    password: str = Form(...),
    kyc_type: str = Form(...),
    kyc_file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    existing = db.query(models.Supplier).filter(models.Supplier.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    allowed_types = ["application/pdf", "image/jpeg", "image/png"]
    if kyc_file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, JPG, and PNG files are allowed for KYC"
        )

    ext = os.path.splitext(kyc_file.filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(KYC_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(await kyc_file.read())

    new_supplier = models.Supplier(
        name=name,
        email=email,
        phone=phone,
        city=city,
        area=area,
        password_hash=hash_password(password),
        kyc_document=f"/uploads/kyc/{filename}",
        kyc_type=kyc_type,
        kyc_status="pending",
    )

    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)
    return new_supplier


# ---------------- LOGIN ----------------
@router.post("/login", response_model=schemas.Token)
def login_supplier(payload: schemas.SupplierLogin, db: Session = Depends(get_db)):
    supplier = db.query(models.Supplier).filter(models.Supplier.email == payload.email).first()

    if not supplier or not verify_password(payload.password, supplier.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if supplier.kyc_status == "pending":
        raise HTTPException(
            status_code=403,
            detail="Your KYC is still pending verification by admin."
        )

    if supplier.kyc_status == "rejected":
        raise HTTPException(
            status_code=403,
            detail="Your KYC was rejected. Please contact admin or upload valid documents."
        )

    if supplier.kyc_status != "verified":
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to log in until KYC is verified."
        )

    token = create_access_token(data={"sub": supplier.email, "role": "supplier"})
    return {"access_token": token, "token_type": "bearer"}
# ---------------- PROFILE ----------------
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
        "kyc_document": current_supplier.kyc_document,
        "kyc_type": current_supplier.kyc_type,
        "kyc_status": current_supplier.kyc_status,
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