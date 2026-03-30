from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas

router = APIRouter(prefix="/treatments", tags=["Treatments"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/add", response_model=schemas.TreatmentResponse)
def add_treatment(treatment: schemas.TreatmentCreate, db: Session = Depends(get_db)):
    new_treatment = models.Treatment(
        disease_name=treatment.disease_name,
        medicine_name=treatment.medicine_name,
        dosage=treatment.dosage,
        description=treatment.description,
    )
    db.add(new_treatment)
    db.commit()
    db.refresh(new_treatment)
    return new_treatment


@router.get("/{disease_name}", response_model=list[schemas.TreatmentResponse])
def get_treatments(disease_name: str, db: Session = Depends(get_db)):
    treatments = db.query(models.Treatment).filter(
        models.Treatment.disease_name.ilike(disease_name)
    ).all()
    return treatments