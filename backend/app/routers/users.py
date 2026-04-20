import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import SessionLocal
from app.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- PATHS ----------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))   # app/routers
APP_DIR = os.path.dirname(BASE_DIR)                     # app
PROJECT_BACKEND_DIR = os.path.dirname(APP_DIR)          # backend root
USER_KYC_DIR = os.path.join(PROJECT_BACKEND_DIR, "uploads", "user_kyc")

os.makedirs(USER_KYC_DIR, exist_ok=True)


# ---------- Register ----------
@router.post("/register", response_model=schemas.UserResponse)
async def register(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    city: str = Form(None),
    area: str = Form(None),
    password: str = Form(...),
    kyc_type: str = Form(...),
    kyc_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    existing_user = db.query(models.User).filter(models.User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    allowed_types = ["application/pdf", "image/jpeg", "image/png"]
    if kyc_file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, JPG, and PNG files are allowed for KYC"
        )

    ext = os.path.splitext(kyc_file.filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(USER_KYC_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(await kyc_file.read())

    new_user = models.User(
        name=name,
        email=email,
        phone=phone,
        city=city,
        area=area,
        password_hash=hash_password(password),
        kyc_document=f"/uploads/user_kyc/{filename}",
        kyc_type=kyc_type,
        status="pending"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ---------- Login ----------
@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if db_user.status == "pending":
        raise HTTPException(
            status_code=403,
            detail="Your KYC is still pending verification by admin."
        )

    if db_user.status == "rejected":
        raise HTTPException(
            status_code=403,
            detail="Your KYC was rejected. Please contact admin or upload valid documents."
        )

    if db_user.status != "approved":
        raise HTTPException(
            status_code=403,
            detail="Your account is not approved yet."
        )

    access_token = create_access_token(
        data={"sub": db_user.email, "role": "user"}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ---------- Profile ----------
@router.get("/me")
def get_my_profile(current_user=Depends(get_current_user)):
    return {
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "city": current_user.city,
        "area": current_user.area,
        "kyc_document": current_user.kyc_document,
        "kyc_type": current_user.kyc_type,
        "status": current_user.status,
    }