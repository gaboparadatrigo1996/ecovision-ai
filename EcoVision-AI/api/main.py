import io
import sys
import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

# Agregar app/ al path para importar classifier
here = os.path.dirname(os.path.abspath(__file__))
app_dir = os.path.join(here, "..", "app")
if app_dir not in sys.path:
    sys.path.insert(0, app_dir)

from classifier import EcoVisionClassifier

app = FastAPI(
    title="EcoVision API",
    description="API de clasificación de residuos usando MobileNetV2 + Transfer Learning",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clf: EcoVisionClassifier = None

@app.on_event("startup")
def load_model():
    global clf
    clf = EcoVisionClassifier()

@app.get("/health")
def health():
    return {
        "ok": True,
        "model_loaded": clf is not None,
        "classes": clf.class_names if clf else []
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    global clf
    if clf is None:
        clf = EcoVisionClassifier()

    if file.content_type not in ("image/jpeg", "image/jpg", "image/png", "image/webp"):
        raise HTTPException(400, "Solo se admiten formatos JPG, PNG o WEBP")

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(400, "La imagen excede el límite de 10 MB")

    try:
        img = Image.open(io.BytesIO(content))
        result = clf.predict(img)
        return result
    except Exception as e:
        raise HTTPException(500, f"Error procesando la imagen: {str(e)}")
