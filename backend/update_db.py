from sqlalchemy import text
from app.database import engine

def column_exists(connection, table_name, column_name):
    result = connection.execute(text(f"PRAGMA table_info({table_name})"))
    columns = [row[1] for row in result.fetchall()]
    return column_name in columns

def add_column_if_not_exists(connection, table_name, column_def):
    column_name = column_def.split()[0]
    if not column_exists(connection, table_name, column_name):
        connection.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_def}"))
        print(f"Added column: {column_name}")
    else:
        print(f"Column already exists: {column_name}")

def main():
    with engine.connect() as connection:
        add_column_if_not_exists(connection, "suppliers", "kyc_document VARCHAR")
        add_column_if_not_exists(connection, "suppliers", "kyc_type VARCHAR")
        add_column_if_not_exists(connection, "suppliers", "kyc_status VARCHAR DEFAULT 'pending'")
        connection.commit()
        print("Database updated successfully.")

if __name__ == "__main__":
    main()