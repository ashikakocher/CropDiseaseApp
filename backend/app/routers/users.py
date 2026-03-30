from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import SessionLocal
from app.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


# ---------- DB Dependency ----------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- Register ----------

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = models.User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        city=user.city,
        area=user.area,
        password_hash=hash_password(user.password)
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
        "area": current_user.area
    }