import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import engine
from app import models
from app.routers import prediction, users, treatment, shops, suppliers, supplier_medicines, admin ,chatbot ,diseases

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Crop Disease Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(prediction.router)
app.include_router(treatment.router)
app.include_router(shops.router)
app.include_router(suppliers.router)
app.include_router(supplier_medicines.router)
app.include_router(admin.router)
app.include_router(chatbot.router)
app.include_router(diseases.router)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_BACKEND_DIR = os.path.dirname(BASE_DIR)
UPLOADS_DIR = os.path.join(PROJECT_BACKEND_DIR, "uploads")

os.makedirs(UPLOADS_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")