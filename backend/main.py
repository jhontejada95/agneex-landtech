import io
import time
import hashlib
import json
import os
import PyPDF2
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, Float, Text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- Configuration & Constants ---
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./landtech.db")
RPC_URL = os.getenv("WEB3_PROVIDER_URI", "https://sepolia-rollup.arbitrum.io/rpc")
PRIVATE_KEY = os.getenv("RELAYER_PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

# --- Database Setup ---
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class DocumentRecord(Base):
    __tablename__ = "expedientes"

    id = Column(Integer, primary_key=True, index=True)
    document_name = Column(String, index=True)
    file_size = Column(String)
    entity_identified = Column(String)
    document_type = Column(String)
    confidence_score = Column(Float)
    requires_human_review = Column(Boolean)
    alert_type = Column(String, nullable=True)
    description = Column(String, nullable=True)
    severity = Column(String, nullable=True)
    extracted_text = Column(Text, nullable=True)
    
    # Campo para Fase 5 (UPME)
    upme_clearance_status = Column(String, nullable=True, default="PENDING")

    # Campos para Fase 6 (Blockchain)
    blockchain_tx_hash = Column(String, nullable=True)
    blockchain_url = Column(String, nullable=True)

    # --- Campos para Ecosistema Digital Twin & CAPEX ---
    capex_score = Column(Float, nullable=True, default=0.0)
    bim_metadata = Column(Text, nullable=True) # Almacena JSON con datos de infraestructura
    opportunity_tag = Column(String, nullable=True) # e.g., "BAJO_RIESGO", "ALTA_FRICCION"
    is_twin_ready = Column(Boolean, default=False)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)
    tier = Column(String, default="Starter")
    docs_used = Column(Integer, default=0)
    docs_limit = Column(Integer, default=3)

Base.metadata.create_all(bind=engine)

# Init demo user if not exists
db = SessionLocal()
if not db.query(User).filter(User.email == "demo@agneex.com").first():
    demo_user = User(
        email="demo@agneex.com", 
        password="agneex2025", 
        name="Usuario Demo", 
        tier="Professional", 
        docs_used=42, 
        docs_limit=100
    )
    db.add(demo_user)
    db.commit()
db.close()

class LoginRequest(BaseModel):
    email: str
    password: str

# --- FastAPI App ---
app = FastAPI(title="Agneex LandTech API (Fase 6 - Web3)")

# --- Web3 Initialization ---
w3 = None
contract = None

if PRIVATE_KEY and CONTRACT_ADDRESS:
    try:
        if len(CONTRACT_ADDRESS) < 42:
            raise ValueError(f"Invalid Contract Address: {CONTRACT_ADDRESS}")
            
        w3 = Web3(Web3.HTTPProvider(RPC_URL))
        w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
        
        check_addr = Web3.to_checksum_address(CONTRACT_ADDRESS)
        abi_path = os.path.join(os.path.dirname(__file__), "contracts", "LandRegistry_abi.json")
        
        if os.path.exists(abi_path):
            with open(abi_path, "r") as f:
                abi = json.load(f)
            contract = w3.eth.contract(address=check_addr, abi=abi)
            print(f"[*] Web3 connected to {RPC_URL}. Contract: {check_addr}")
        else:
            print(f"[!] Warning: ABI file missing: {abi_path}")
    except Exception as e:
        print(f"[!] Critical: Web3 initialization failed: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency wrapper
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- OCR heuristics ---
def analyze_pdf_text(file_bytes: bytes) -> str:
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in pdf_reader.pages:
            t = page.extract_text()
            if t: text += t
        return text.lower()
    except Exception as e:
        print(f"Error extrayendo texto del PDF: {e}")
        return ""

# --- Heuristic Rules Configuration ---
DOCUMENT_RULES = {
    "Escritura Pública": {
        "keywords": ["escritura", "notaria"],
        "base_confidence": 0.88
    },
    "Contrato Privado": {
        "keywords": ["contrato"],
        "base_confidence": 0.75
    }
}

GEOSPATIAL_KEYWORDS = ["coordenadas", "grados", "metros", "norte", "sur", "este", "oeste"]
ENVIRONMENTAL_KEYWORDS = ["río", "páramo", "norte", "indigena", "bosque", "reserva"]

def analyze_pdf_text(file_bytes: bytes) -> str:
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = "".join(page.extract_text() or "" for page in pdf_reader.pages)
        return text.lower()
    except Exception as e:
        print(f"[!] PDF Extraction Error: {e}")
        return ""

def generate_heuristics(text: str):
    doc_type = "Documento Desconocido"
    entity = "Predio No Identificado"
    confidence = 0.45
    req_review = False
    alert_type = None
    description = None
    severity = None
    
    # 1. Identify Document Type
    for t, rules in DOCUMENT_RULES.items():
        if any(k in text for k in rules["keywords"]):
            doc_type = t
            confidence = rules["base_confidence"]
            break
            
    # 2. Identify Entity (Basic snippet)
    if "predio" in text:
        idx = text.find("predio")
        entity = text[idx:idx+40].strip().title()

    # 3. Geospatial Validation
    if "lindero" in text or "limita" in text:
        if not any(word in text for word in GEOSPATIAL_KEYWORDS):
            req_review = True
            alert_type = "AMBIGUEDAD_LINDEROS"
            description = "Se detectaron linderos pero carecen de referencias topográficas técnicas. Requiere revisión humana."
            severity = "HIGH"
            confidence -= 0.15 
            
    return doc_type, entity, round(confidence, 2), req_review, alert_type, description, severity

def analyze_capex_viability(doc_confidence: float, upme_status: str, doc_type: str) -> float:
    base_score = doc_confidence
    
    if upme_status == "INTERSECCION_DETECTADA":
        base_score *= 0.2
    elif upme_status == "PENDING":
        base_score *= 0.8
        
    if doc_type == "Escritura Pública":
        base_score += 0.05
        
    return min(round(base_score, 2), 1.0)


@app.get("/")
def read_root():
    return {"message": "Agneex LandTech API is running"}

@app.post("/v1/login")
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or user.password != req.password:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    return {
        "name": user.name,
        "email": user.email,
        "tier": user.tier,
        "docsUsed": user.docs_used,
        "docsLimit": user.docs_limit
    }

@app.get("/v1/user/usage")
async def get_usage(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {
        "docsUsed": user.docs_used,
        "docsLimit": user.docs_limit,
        "tier": user.tier
    }

@app.post("/v1/ingest")
async def ingest_document(
    file: UploadFile = File(...), 
    selected_categories: str = Form("[]"),
    user_email: str = Form("demo@agneex.com"), # Default for demo
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == user_email).first()
    if user and user.docs_used >= user.docs_limit:
        raise HTTPException(status_code=403, detail="Has alcanzado el límite de documentos de tu plan.")

    if not file.filename:
        raise HTTPException(status_code=400, detail="Ningún archivo fue proporcionado.")
        
    try:
        categories = json.loads(selected_categories)
    except:
        categories = []
        
    file_bytes = await file.read()
    file_size_kb = round(len(file_bytes) / 1024, 2)
    
    time.sleep(0.5)
    extracted_text = analyze_pdf_text(file_bytes)
    
    if extracted_text:
        time.sleep(1)
        doc_type, entity, conf, req_review, alert, desc, severity = generate_heuristics(extracted_text)
    else:
        doc_type = "Documento Escaneado/Imagen"
        entity = "Entidad Desconocida"
        conf = 0.30
        req_review = True
        alert = "OCR_NO_TEXT_FOUND"
        desc = "No se pudo extraer texto seleccionable del archivo. Posible imagen escaneada que requiere OCR Avanzado."
        severity = "MEDIUM"
    
    # Simulate validation results for each selected category
    validation_results = []
    for cat_id in categories:
        # For demo purposes, we pass most and fail some based on the document analysis
        status = "pass"
        msg = "Verificación exitosa."
        
        if cat_id == "linderos_areas" and alert == "AMBIGUEDAD_LINDEROS":
            status = "fail"
            msg = "Ambigüedad detectada: faltan coordenadas técnicas."
        elif cat_id == "exclusiones_upme" and any(k in (entity or "").lower() for k in ["río", "páramo", "reserva"]):
            status = "fail"
            msg = "Posible cruce con zona de exclusión detectado."
        
        validation_results.append({
            "id": cat_id,
            "status": status,
            "message": msg
        })

    record = DocumentRecord(
        document_name=file.filename,
        file_size=f"{file_size_kb} KB",
        entity_identified=entity,
        document_type=doc_type,
        confidence_score=conf,
        requires_human_review=req_review,
        alert_type=alert,
        description=desc,
        severity=severity,
        extracted_text=extracted_text[:1000] if extracted_text else "",
        upme_clearance_status="PENDING",
        # Simulación de carga inicial de datos BIM
        bim_metadata=json.dumps({
            "project_type": "Infraestructura Energética",
            "projected_area": "450 m2",
            "estimated_capex": "USD 1.2M",
            "status": "Concept Phase"
        }),
        is_twin_ready=True
    )
    
    # Cálculo inicial de CAPEX (provisional)
    record.capex_score = analyze_capex_viability(conf, "PENDING", doc_type)
    
    if conf > 0.80:
        record.opportunity_tag = "ALTA_VIABILIDAD_ROI"
    elif conf < 0.60:
        record.opportunity_tag = "RIESGO_ESTRUCTURAL"
    else:
        record.opportunity_tag = "REVISION_ESTRATEGICA"
    if user:
        user.docs_used += 1
        
    db.add(record)
    db.commit()
    db.refresh(record)
    
    response_payload = {
        "status": "success",
        "document_name": file.filename,
        "record_id": record.id,
        "analysis_summary": {
            "entity_identified": entity,
            "document_type": doc_type,
            "file_size": f"{file_size_kb} KB",
            "confidence_score": conf
        },
        "validations": validation_results
    }
    
    if req_review:
        response_payload["hitl_alert"] = {
            "requires_human_review": req_review,
            "alert_type": alert,
            "description": desc,
            "severity": severity
        }
    else:
        response_payload["hitl_alert"] = {"requires_human_review": False}
        
    return response_payload

# --- Fase 5: UPME Verifier ---
@app.get("/v1/upme-check/{record_id}")
def check_upme_intersection(record_id: int, db: Session = Depends(get_db)):
    """
    Simula una consulta a los servidores de datos espaciales y energéticos (UPME) 
    para comprobar áreas de exclusión minera sobre la entidad extraída en el documento.
    """
    record = db.query(DocumentRecord).filter(DocumentRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Registro no encontrado.")
        
    # Si ya lo verificó antes, devolvemos el guardado
    if record.upme_clearance_status != "PENDING":
        return {
            "record_id": record.id,
            "entity": record.entity_identified,
            "upme_status": record.upme_clearance_status,
            "message": "Consultado desde caché DB."
        }
        
    # Simula latencia de red contra Servidor GIS Gubernamental
    time.sleep(1.8)
    
    # Motor de reglas UPME (Mock)
    if any(keyword in entity_str for keyword in ENVIRONMENTAL_KEYWORDS):
        status = "INTERSECCION_DETECTADA"
        msg = "La entidad coincide espacialmente con zonas de restricción ambiental/energética (Exclusión Ley 685)."
    else:
        status = "LIBRE_DE_EXCLUSION"
        msg = "No se reportan cruces espaciales dentro de la cartografía de exclusiones UPME."
        
    # Recalcular CAPEX con el nuevo estado de UPME
    record.capex_score = analyze_capex_viability(record.confidence_score, status, record.document_type)
    
    # Actualizar tags según viabilidad final
    if status == "INTERSECCION_DETECTADA":
        record.opportunity_tag = "ALTA_FRICCION_LEGAL"
    elif record.capex_score > 0.85:
        record.opportunity_tag = "BAJO_RIESGO_CAPEX"

    db.commit()
    
    return {
        "record_id": record.id,
        "entity": record.entity_identified,
        "upme_status": status,
        "message": msg
    }

# --- Fase 6: Web3 Notarizer ---
@app.post("/v1/notarize/{record_id}")
async def notarize_document(record_id: int, db: Session = Depends(get_db)):
    """
    Toma los resultados del análisis y los ancla a Arbitrum Sepolia 
    generando una prueba de inmutabilidad (Gasless para el usuario).
    """
    if not w3 or not contract or not PRIVATE_KEY:
        raise HTTPException(status_code=500, detail="Servicio Web3 no configurado en el servidor.")
        
    record = db.query(DocumentRecord).filter(DocumentRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Expediente no encontrado.")
        
    if record.blockchain_tx_hash:
        return {
            "status": "already_notarized",
            "tx_hash": record.blockchain_tx_hash,
            "url": record.blockchain_url
        }

    try:
        # 1. Generar Hash Criptográfico del registro
        # Usamos ID, Entidad, Hash del texto y ahora el CAPEX para mayor integridad
        content_to_hash = f"{record.id}-{record.entity_identified}-{record.extracted_text}-{record.capex_score}"
        doc_hash = hashlib.sha256(content_to_hash.encode()).hexdigest()
        
        # 2. Configurar cuenta relayer
        account = w3.eth.account.from_key(PRIVATE_KEY)
        
        # 3. Preparar parámetros de gas (EIP-1559)
        latest_block = w3.eth.get_block("latest")
        base_fee = latest_block.get("baseFeePerGas", 100000000)
        priority_fee = Web3.to_wei(0.1, 'gwei')
        max_fee = int(base_fee * 1.5) + priority_fee
        
        # 4. Construir Transacción
        print(f"Notarizando expediente {record.id}...")
        nonce = w3.eth.get_transaction_count(account.address)
        
        txn = contract.functions.notarizeDocument(
            str(record.id),
            doc_hash,
            f"SCORE_{int(record.confidence_score * 100)}_CAPEX_{int(record.capex_score * 100)}",
            record.opportunity_tag or record.upme_clearance_status
        ).build_transaction({
            "chainId": w3.eth.chain_id,
            "maxFeePerGas": max_fee,
            "maxPriorityFeePerGas": priority_fee,
            "from": account.address,
            "nonce": nonce,
        })
        
        # 5. Firmar y Enviar
        signed_txn = w3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
        
        # 6. Guardar en DB (Hash pendiente de confirmación)
        tx_hex = tx_hash.hex()
        record.blockchain_tx_hash = tx_hex
        record.blockchain_url = f"https://sepolia.arbiscan.io/tx/{tx_hex}"
        db.commit()
        
        return {
            "status": "success",
            "message": "Notarización iniciada en Arbitrum Sepolia",
            "tx_hash": tx_hex,
            "url": record.blockchain_url
        }
        
    except Exception as e:
        print(f"Error en notarización: {e}")
        raise HTTPException(status_code=500, detail=f"Fallo en comunicación Web3: {str(e)}")

# --- Pydantic Schemas For Response ---
class ExpedienteResponse(BaseModel):
    id: int
    document_name: str
    entity_identified: str
    document_type: str
    confidence_score: float
    requires_human_review: bool
    upme_clearance_status: Optional[str] = None
    alert_type: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    blockchain_tx_hash: Optional[str] = None
    blockchain_url: Optional[str] = None
    # Nuevos campos CAPEX
    capex_score: float
    opportunity_tag: Optional[str] = None
    is_twin_ready: bool
    bim_metadata: Optional[str] = None
    
    class Config:
        from_attributes = True

@app.get("/v1/expedientes", response_model=List[ExpedienteResponse])
def get_expedientes(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    records = db.query(DocumentRecord).order_by(DocumentRecord.id.desc()).offset(skip).limit(limit).all()
    return records
