from app.database import SessionLocal
from app.models import Admin
from app.auth import hash_password

db = SessionLocal()

existing = db.query(Admin).filter(Admin.email == "admin@cropapp.com").first()

if not existing:
    admin = Admin(
        name="Super Admin",
        email="admin@cropapp.com",
        password_hash=hash_password("admin123")
    )
    db.add(admin)
    db.commit()
    print("Admin created successfully")
else:
    print("Admin already exists")

db.close()