from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas

router = APIRouter(prefix="/shop-medicines", tags=["Shop Medicines"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/add", response_model=schemas.ShopMedicineResponse)
def add_shop_medicine(payload: schemas.ShopMedicineCreate, db: Session = Depends(get_db)):
    new_item = models.ShopMedicine(
        shop_id=payload.shop_id,
        medicine_name=payload.medicine_name,
        stock_quantity=payload.stock_quantity,
        price=payload.price,
        description=payload.description
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item