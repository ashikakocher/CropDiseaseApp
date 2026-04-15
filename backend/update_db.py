from sqlalchemy import text
from app.database import engine

with engine.connect() as conn:
    conn.execute(text("UPDATE users SET status = 'pending' WHERE status IS NULL"))
    print(" DB updated successfully!")