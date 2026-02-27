import sqlite3
import os

db_path = 'landtech.db'
if not os.path.exists(db_path):
    print(f"Error: {db_path} not found")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    print("Schema for table 'expedientes':")
    cursor.execute("PRAGMA table_info(expedientes)")
    columns = cursor.fetchall()
    for col in columns:
        print(col)
    
    print("\nSchema for table 'users':")
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    for col in columns:
        print(col)
    
    conn.close()
