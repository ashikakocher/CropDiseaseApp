import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.auth import get_current_admin  # your admin auth function

router = APIRouter(prefix="/diseases", tags=["Diseases"])


def serialize_disease(disease):
    return {
        "id": disease.id,
        "name": disease.name,
        "category": disease.category,
        "severity": disease.severity,
        "short_description": disease.short_description,
        "full_description": disease.full_description,
        "symptoms": json.loads(disease.symptoms) if disease.symptoms else [],
        "causes": json.loads(disease.causes) if disease.causes else [],
        "treatments": json.loads(disease.treatments) if disease.treatments else [],
        "affected_plants": json.loads(disease.affected_plants) if disease.affected_plants else [],
        "prevention": json.loads(disease.prevention) if disease.prevention else [],
        "image_url": disease.image_url,
        "created_at": disease.created_at,
        "updated_at": disease.updated_at,
    }


@router.post("/admin", response_model=dict)
def create_disease(
    disease: schemas.DiseaseCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    existing = db.query(models.Disease).filter(models.Disease.name == disease.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Disease already exists")

    new_disease = models.Disease(
        name=disease.name,
        category=disease.category,
        severity=disease.severity,
        short_description=disease.short_description,
        full_description=disease.full_description,
        symptoms=json.dumps(disease.symptoms or []),
        causes=json.dumps(disease.causes or []),
        treatments=json.dumps(disease.treatments or []),
        affected_plants=json.dumps(disease.affected_plants or []),
        prevention=json.dumps(disease.prevention or []),
        image_url=disease.image_url,
    )

    db.add(new_disease)
    db.commit()
    db.refresh(new_disease)

    return serialize_disease(new_disease)


@router.get("/", response_model=list[dict])
def get_all_diseases(db: Session = Depends(get_db)):
    diseases = db.query(models.Disease).order_by(models.Disease.name.asc()).all()
    return [serialize_disease(d) for d in diseases]


@router.get("/{disease_id}", response_model=dict)
def get_disease(disease_id: int, db: Session = Depends(get_db)):
    disease = db.query(models.Disease).filter(models.Disease.id == disease_id).first()
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")
    return serialize_disease(disease)


@router.put("/admin/{disease_id}", response_model=dict)
def update_disease(
    disease_id: int,
    disease_data: schemas.DiseaseUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    disease = db.query(models.Disease).filter(models.Disease.id == disease_id).first()
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")

    if disease_data.name is not None:
        disease.name = disease_data.name
    if disease_data.category is not None:
        disease.category = disease_data.category
    if disease_data.severity is not None:
        disease.severity = disease_data.severity
    if disease_data.short_description is not None:
        disease.short_description = disease_data.short_description
    if disease_data.full_description is not None:
        disease.full_description = disease_data.full_description
    if disease_data.symptoms is not None:
        disease.symptoms = json.dumps(disease_data.symptoms)
    if disease_data.causes is not None:
        disease.causes = json.dumps(disease_data.causes)
    if disease_data.treatments is not None:
        disease.treatments = json.dumps(disease_data.treatments)
    if disease_data.affected_plants is not None:
        disease.affected_plants = json.dumps(disease_data.affected_plants)
    if disease_data.prevention is not None:
        disease.prevention = json.dumps(disease_data.prevention)
    if disease_data.image_url is not None:
        disease.image_url = disease_data.image_url

    db.commit()
    db.refresh(disease)

    return serialize_disease(disease)


@router.delete("/admin/{disease_id}")
def delete_disease(
    disease_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    disease = db.query(models.Disease).filter(models.Disease.id == disease_id).first()
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")

    db.delete(disease)
    db.commit()
    return {"message": "Disease deleted successfully"}