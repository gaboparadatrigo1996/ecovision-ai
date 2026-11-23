# ♻️ EcoVision AI — Clasificador Inteligente de Residuos

Sistema integral de visión por computadora para la clasificación y reciclaje asistido de residuos urbanos utilizando **MobileNetV2** (Fine-tuning con Stanford TrashNet), backend **FastAPI** y frontend moderno en **React + TypeScript + Vite**.

---

## 📁 Estructura del Repositorio

```text
ecovision/
├── EcoVision-AI/              # Backend, modelo y utilitarios
│   ├── api/                   # API REST con FastAPI (POST /predict, GET /health)
│   ├── app/                   # Clasificador de inferencia y scripts originales
│   ├── model/                 # Pesos entrenados (ecovision_model.keras, 11.6 MB)
│   ├── results/               # Métricas de evaluación, matriz de confusión y gráficos
│   └── test_images/           # Imágenes de prueba fuera de distribución (A_* y B_*)
│
├── ecovision-web/             # Frontend Web (React 19, TypeScript, Tailwind CSS v4)
│   ├── src/                   # Componentes (Hero, Staging, Loading, Result)
│   └── public/samples/        # Muestras precargadas para prueba rápida
│
├── start.sh                   # Script de inicio simultáneo (Backend + Frontend)
└── README.md
```

---

## 🚀 Inicio Rápido (Local)

### 1. Clonar el repositorio
```bash
git clone https://github.com/gaboparadatrigo1996/ecovision-ai.git
cd ecovision-ai
```

### 2. Configurar el Backend (Python 3.10–3.12)
```bash
cd EcoVision-AI
python3 -m venv .venv
source .venv/bin/activate
pip install -r app/requirements.txt -r api/requirements.txt
cd ..
```

### 3. Configurar el Frontend (Node.js 18+)
```bash
cd ecovision-web
npm install
cd ..
```

### 4. Iniciar todo con un solo comando
```bash
./start.sh
```

- **Frontend Web:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **Documentación Swagger:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧠 Rendimiento del Modelo (Stanford TrashNet)

- **Exactitud Global en Test:** **88.65 %** (379 imágenes de prueba)
- **Macro-F1:** **0.869**
- **AUC Macro:** **0.986**
- **Clases soportadas (6):** Cartón (`cardboard`), Vidrio (`glass`), Metal (`metal`), Papel (`paper`), Plástico (`plastic`), Otros/No reciclable (`trash`).
- **Arquitectura:** MobileNetV2 (164,742 parámetros entrenables en la cabeza clasificadora).

---

## 🎨 Flujo de Usuario

1. **Pantalla Inicial:** Selección de archivo, captura por cámara o prueba con muestras rápidas.
2. **Capa de Arrastre (Drag & Drop):** Detección interactiva al arrastrar imágenes.
3. **Mesa de Espera (Staging):** Previsualización de la tarjeta con nombre, peso y botón *"Analizar residuo"*.
4. **Carga Animada:** Spinner circular limpio mientras el modelo calcula la distribución de probabilidades.
5. **Resultado y Guía de Reciclaje:** Identificación de contenedor (Azul, Amarillo, Verde, Gris), consejos de preparación, barras de probabilidad y síntesis de voz (*Web Speech API*).
