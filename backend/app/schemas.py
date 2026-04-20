from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime



# ---------- User Schemas ----------

class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=15)
    city: Optional[str] = None
    area: Optional[str] = None
    password: str = Field(min_length=6, max_length=50)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=50)


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str | None = None
    city: str | None = None
    area: str | None = None
    kyc_document: str | None = None
    kyc_type: str | None = None
    status: str | None = None

    class Config:
        from_attributes = True


# ---------- Token ----------

class Token(BaseModel):
    access_token: str
    token_type: str


# ---------- Treatment ----------

class TreatmentCreate(BaseModel):
    disease_name: str
    medicine_name: str
    treatment: Optional[str] = None
    dosage: Optional[str] = None


class TreatmentResponse(BaseModel):
    id: int
    disease_name: str
    medicine_name: str
    treatment: Optional[str] = None
    dosage: Optional[str] = None
    expert_id: Optional[int] = None

    class Config:
        from_attributes = True

# ---------- Prediction ----------

class PredictionTreatment(BaseModel):
    medicine_name: str
    treatment: Optional[str] = None
    dosage: Optional[str] = None


class ShopMedicineMatch(BaseModel):
    medicine_name: str
    stock_quantity: Optional[int] = None
    price: Optional[float] = None
    treatment: Optional[str] = None
    dosage: Optional[str] = None


class ShopMatchResponse(BaseModel):
    shop_name: str
    city: str
    area: Optional[str] = None
    address: str
    medicines: List[ShopMedicineMatch] = []


class PredictionResponse(BaseModel):
    status: Optional[str] = None
    crop: str
    disease: str
    confidence: float
    severity: str
    description: str
    treatments: List[PredictionTreatment] = []
    shops: List[ShopMatchResponse] = []


# ---------- Expert ----------

class ExpertCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    specialization: Optional[str] = None
    experience: Optional[str] = None
    location: Optional[str] = None
    password: str


class ExpertLogin(BaseModel):
    email: EmailStr
    password: str


class ExpertResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str]
    specialization: Optional[str]
    experience: Optional[str]
    location: Optional[str]

    class Config:
        from_attributes = True


# ---------- Query ----------

class QueryCreate(BaseModel):
    expert_id: int
    disease: Optional[str] = None
    message: str


class QueryReply(BaseModel):
    query_id: int
    reply: str


class QueryResponse(BaseModel):
    id: int
    user_id: int
    expert_id: int
    disease: Optional[str]
    message: str
    reply: Optional[str]

    class Config:
        from_attributes = True


# ---------- Supplier ----------

class SupplierCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    city: str
    area: Optional[str] = None
    password: str = Field(min_length=6, max_length=50)


class SupplierLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=50)

class SupplierResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str] = None
    city: str
    area: Optional[str] = None
    kyc_document: Optional[str] = None
    kyc_type: Optional[str] = None
    kyc_status: Optional[str] = None
    

    class Config:
        from_attributes = True


# ---------- Shop ----------

class ShopCreate(BaseModel):
    shop_name: str
    city: str
    area: Optional[str] = None
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class ShopResponse(BaseModel):
    id: int
    supplier_id: int
    shop_name: str
    city: str
    area: Optional[str]
    address: str
    latitude: Optional[float]
    longitude: Optional[float]

    class Config:
        from_attributes = True


# ---------- Shop Medicines ----------

class ShopMedicineCreate(BaseModel):
    medicine_name: str
    stock_quantity: Optional[int] = None
    price: Optional[float] = None
    treatment: Optional[str] = None
    dosage: Optional[str] = None


class ShopMedicineResponse(BaseModel):
    id: int
    shop_id: int
    medicine_name: str
    stock_quantity: Optional[int]
    price: Optional[float]
    treatment: Optional[str]
    dosage: Optional[str]

    class Config:
        from_attributes = True


# ---------- Combined Shop + Multiple Medicines ----------

class ShopWithMedicinesCreate(BaseModel):
    shop: ShopCreate
    medicines: List[ShopMedicineCreate]


# ---------- Admin ----------

class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class AdminResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True



class Token(BaseModel):
    access_token: str
    token_type: str


class DashboardStats(BaseModel):
    total_users: int
    total_suppliers: int
    total_experts: int
    total_shops: int
    total_medicines: int
    total_treatments: int
    total_predictions: int
    total_queries: int




class AdminUserUpdate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    city: str | None = None
    area: str | None = None
    kyc_type: str | None = None
    status: str | None = "pending"


class AdminShopUpdate(BaseModel):
    shop_name: str
    city: str
    area: Optional[str] = None
    address: str


class ShopMedicineCreate(BaseModel):
    shop_id: int
    medicine_name: str
    stock_quantity: Optional[int] = None
    price: Optional[float] = None
    treatment: Optional[str] = None
    dosage: Optional[str] = None


class ShopMedicineUpdate(BaseModel):
    shop_id: int
    medicine_name: str
    stock_quantity: Optional[int] = None
    price: Optional[float] = None
    treatment: Optional[str] = None
    dosage: Optional[str] = None


class TreatmentCreate(BaseModel):
    disease_name: str
    medicine_name: str
    treatment: Optional[str] = None
    dosage: Optional[str] = None
    expert_id: Optional[int] = None


class TreatmentUpdate(BaseModel):
    disease_name: str
    medicine_name: str
    treatment: Optional[str] = None
    dosage: Optional[str] = None
    expert_id: Optional[int] = None

class AdminSupplierUpdate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    city: str
    area: Optional[str] = None


class AdminUserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    city: str | None = None
    area: str | None = None
    password: str
    kyc_type: str | None = None
    status: str | None = "approved"

class AdminSupplierCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    city: str
    area: str | None = None
    password: str
    kyc_type: str | None = None
    kyc_status: str | None = "pending"

class AdminSupplierUpdate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    city: str
    area: str | None = None
    kyc_type: str | None = None
    kyc_status: str | None = "pending"

class AdminShopCreate(BaseModel):
    supplier_id: int
    shop_name: str
    city: str
    area: Optional[str] = None
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class AdminShopUpdate(BaseModel):
    supplier_id: int
    shop_name: str
    city: str
    area: Optional[str] = None
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class DiseaseBase(BaseModel):
    name: str
    category: str
    severity: int
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    symptoms: Optional[List[str]] = []
    causes: Optional[List[str]] = []
    treatments: Optional[List[str]] = []
    affected_plants: Optional[List[str]] = []
    prevention: Optional[List[str]] = []
    image_url: Optional[str] = None

class DiseaseCreate(DiseaseBase):
    pass

class DiseaseUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    severity: Optional[int] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    symptoms: Optional[List[str]] = None
    causes: Optional[List[str]] = None
    treatments: Optional[List[str]] = None
    affected_plants: Optional[List[str]] = None
    prevention: Optional[List[str]] = None
    image_url: Optional[str] = None

class DiseaseResponse(DiseaseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True