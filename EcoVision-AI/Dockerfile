FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema mínimas
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY api/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del modelo y la API
COPY app/ app/
COPY model/ model/
COPY api/ api/

# Hugging Face Spaces expone el puerto 7860
EXPOSE 7860

# Iniciar Uvicorn en el puerto 7860
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "7860"]
