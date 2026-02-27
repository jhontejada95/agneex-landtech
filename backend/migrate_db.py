import sqlite3
import os

db_path = 'landtech.db'
if not os.path.exists(db_path):
    print(f"Error: {db_path} not found")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Check existing columns
    cursor.execute("PRAGMA table_info(expedientes)")
    columns = [col[1] for col in cursor.fetchall()]
    print(f"Existing columns in 'expedientes': {columns}")
    
    # 2. Add missing columns
    migrations = [
        ("capex_score", "REAL DEFAULT 0.0"),
        ("bim_metadata", "TEXT"),
        ("opportunity_tag", "TEXT"),
        ("is_twin_ready", "INTEGER DEFAULT 0") # Boolean in SQLite is Integer
    ]
    
    for col_name, col_type in migrations:
        if col_name not in columns:
            print(f"Adding column '{col_name}'...")
            try:
                cursor.execute(f"ALTER TABLE expedientes ADD COLUMN {col_name} {col_type}")
                print(f"Column '{col_name}' added successfully.")
            except Exception as e:
                print(f"Error adding column '{col_name}': {e}")
        else:
            print(f"Column '{col_name}' already exists.")
            
    conn.commit()
    conn.close()
    print("Migration complete.")
