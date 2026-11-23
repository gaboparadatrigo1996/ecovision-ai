# ♻️ EcoVision AI

Sistema inteligente de clasificación de residuos mediante **visión artificial** y **transfer learning** con MobileNetV2.

Clasifica una fotografía de un residuo en una de seis categorías: **cartón, vidrio, metal, papel, plástico u otros residuos**.

## Demo

- 🌐 **App desplegada:** *(se añade el enlace al Space/Vercel)*
- 📓 **Modelo y Evaluación:** archivos en carpetas `model/` y `results/`

## Arquitectura

- **Modelo:** MobileNetV2 preentrenada en ImageNet (backbone congelado) + cabeza clasificadora personalizada.
- **Cabeza:** `GlobalAveragePooling2D → Dropout(0.3) → Dense(128, ReLU) → Dropout(0.3) → Dense(6, Softmax)`.
- **Parámetros entrenables:** 164 742.
- **Entrada:** imágenes RGB redimensionadas a 224×224, preprocesadas con `preprocess_input` de MobileNetV2.
- **Interfaz:** Streamlit.
- **TTS:** Web Speech API del navegador.
- **Despliegue:** Hugging Face Spaces.

## Dataset

- **TrashNet** (Thung & Yang, Stanford, 2016). 2 527 imágenes en seis clases.
- **División estratificada** 70 / 15 / 15 tras excluir 3 duplicados exactos: 1 766 train, 379 val, 379 test.
- **Desbalance:** `trash` representa solo el 5.4 % del total. Se usó `class_weight` inversamente proporcional a la frecuencia en train.

## Entrenamiento

- **29 épocas completadas** de 30 configuradas; `EarlyStopping` (patience=8) detuvo el entrenamiento al no mejorar `val_loss` desde la época 21.
- **Callbacks:** `ModelCheckpoint` (mejor `val_loss`), `EarlyStopping`, `ReduceLROnPlateau` (lr de 1e-3 → 1.25e-4), `HistoryToCSV`.
- **Aumentación:** rotación ±15°, volteo horizontal, zoom 10 %, brillo ±15 %.
- **Fine-tuning:** **no realizado**. El modelo converge de forma estable; descongelar capas con 2 527 imágenes habría aumentado el sobreajuste sin ganancia clara.

## Resultados (conjunto de test, evaluación única)

| Métrica | Valor |
|---|---|
| Accuracy | **88.65 %** |
| Macro-F1 | 0.869 |
| Weighted-F1 | 0.886 |
| AUC macro (OvR) | **0.986** |
| Loss | 0.353 |

Rendimiento por clase (F1):

- cardboard: 0.912
- glass: 0.921
- metal: 0.889
- paper: 0.909
- plastic: 0.838
- trash: 0.744 (clase minoritaria y heterogénea)

## Limitaciones

1. **Sesgo de dominio de TrashNet:** las imágenes son objetos individuales sobre fondo blanco en condiciones controladas. El modelo puede degradar su rendimiento ante imágenes en escenarios naturales con fondos complejos, iluminación variable u oclusión parcial.
2. **Clase `trash`:** agrupa residuos heterogéneos y está subrepresentada. Su `recall` es el más bajo del modelo.
3. **Confianza del softmax:** la probabilidad mostrada por la app no es una garantía de acierto; es la salida del clasificador.

## Cómo ejecutar localmente

```bash
git clone <repo>
cd EcoVision-AI/app
pip install -r requirements.txt
streamlit run app.py
