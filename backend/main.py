from fastapi import FastAPI

app = FastAPI(title="Agneex LandTech API", version="0.1.0")

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Agneex LandTech 4.0"}
