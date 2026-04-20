from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text,Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
from sqlalchemy.sql import func




class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    city = Column(String, nullable=True)
    area = Column(String, nullable=True)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    predictions = relationship("Prediction", back_populates="owner")
    queries = relationship("Query", back_populates="user")
    status = Column(String, default="pending")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    crop = Column(String)
    disease = Column(String)
    confidence = Column(Float)
    severity = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    image_path = Column(String)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="predictions")


class Treatment(Base):
    __tablename__ = "treatments"

    id = Column(Integer, primary_key=True, index=True)
    disease_name = Column(String, nullable=False, index=True)
    medicine_name = Column(String, nullable=False)
    treatment = Column(Text, nullable=True)
    dosage = Column(String, nullable=True)

    expert_id = Column(Integer, ForeignKey("experts.id"), nullable=True)
    expert = relationship("Expert", back_populates="treatments")


class Expert(Base):
    __tablename__ = "experts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    specialization = Column(String, nullable=True)
    experience = Column(String, nullable=True)
    location = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    treatments = relationship("Treatment", back_populates="expert")
    queries = relationship("Query", back_populates="expert")


class Query(Base):
    __tablename__ = "queries"

    id = Column(Integer, primary_key=True, index=True)
    disease = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    reply = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id"))
    expert_id = Column(Integer, ForeignKey("experts.id"))

    user = relationship("User", back_populates="queries")
    expert = relationship("Expert", back_populates="queries")


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    city = Column(String, nullable=False)
    area = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    kyc_document = Column(String, nullable=True)   # file path
    kyc_type = Column(String, nullable=True)       # aadhaar, pan, gst, etc.
    kyc_status = Column(String, default="pending") # pending / verified / rejected

    shops = relationship("Shop", back_populates="supplier")


class Shop(Base):
    __tablename__ = "shops"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    shop_name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    area = Column(String, nullable=True)
    address = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    supplier = relationship("Supplier", back_populates="shops")
    medicines = relationship("ShopMedicine", back_populates="shop")


class ShopMedicine(Base):
    __tablename__ = "shop_medicines"

    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("shops.id"))
    medicine_name = Column(String, nullable=False)
    stock_quantity = Column(Integer, nullable=True)
    price = Column(Float, nullable=True)
    treatment = Column(String, nullable=True)
    dosage = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    shop = relationship("Shop", back_populates="medicines")


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)




class Disease(Base):
    __tablename__ = "diseases"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    category = Column(String, nullable=False)   # fungal, bacterial, viral etc.
    severity = Column(Integer, nullable=False, default=1)

    short_description = Column(Text, nullable=True)
    full_description = Column(Text, nullable=True)

    symptoms = Column(Text, nullable=True)         # store JSON string
    causes = Column(Text, nullable=True)           # store JSON string
    treatments = Column(Text, nullable=True)       # store JSON string
    affected_plants = Column(Text, nullable=True)  # store JSON string
    prevention = Column(Text, nullable=True)       # store JSON string

    image_url = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())