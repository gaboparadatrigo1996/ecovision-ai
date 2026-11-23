#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "♻️ ========================================================"
echo "♻️   EcoVision AI — Clasificador Inteligente de Residuos"
echo "♻️ ========================================================"

# Iniciar Backend FastAPI en segundo plano
cd "$DIR/EcoVision-AI"
./.venv/bin/uvicorn api.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "✓ Backend FastAPI corriendo en http://localhost:8000 (PID: $BACKEND_PID)"

# Función para limpiar el proceso en segundo plano al salir
cleanup() {
    echo ""
    echo "Deteniendo servicios de EcoVision..."
    kill $BACKEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Iniciar Frontend React + Vite
cd "$DIR/ecovision-web"
echo "✓ Iniciando Frontend React en http://localhost:5173..."
npx vite --port 5173
