import sqlite3
import os

db_path = 'landtech.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'Client'")
        conn.commit()
        print("[*] Column 'role' added to 'users' table.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print("[!] Column 'role' already exists.")
        else:
            print(f"[!] Error: {e}")
    conn.close()
else:
    print(f"[!] Error: {db_path} not found.")
