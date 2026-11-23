
import os
import streamlit as st
from PIL import Image
from classifier import EcoVisionClassifier
from voice import speak_text


st.set_page_config(
    page_title="EcoVision AI",
    page_icon="♻️",
    layout="centered",
    initial_sidebar_state="collapsed"
)


@st.cache_resource(show_spinner="Cargando modelo...")
def load_classifier():
    return EcoVisionClassifier()


def main():
    st.title("♻️ EcoVision AI")
    st.markdown(
        "Sistema inteligente de clasificación de residuos con "
        "**MobileNetV2** y *transfer learning*."
    )
    st.markdown(
        "Sube una fotografía de un residuo (cartón, vidrio, metal, papel, "
        "plástico u otros) y el modelo predecirá su categoría."
    )
    st.divider()

    try:
        classifier = load_classifier()
    except Exception as e:
        st.error(f"No se pudo cargar el modelo: {e}")
        st.stop()

    uploaded = st.file_uploader(
        "Selecciona una imagen",
        type=["jpg", "jpeg", "png"],
        help="Formatos admitidos: JPG, JPEG, PNG"
    )

    if uploaded is None:
        st.info("Aún no se ha subido ninguna imagen.")
        return

    image = Image.open(uploaded)
    st.image(image, caption="Imagen subida", use_container_width=True)

    with st.spinner("Clasificando..."):
        result = classifier.predict(image)

    st.divider()
    st.subheader("Resultado")

    col1, col2 = st.columns([2, 1])
    with col1:
        st.markdown(f"### Categoría: **{result['class'].upper()}**")
    with col2:
        st.metric("Confianza del modelo", f"{result['confidence']*100:.2f} %")

    st.caption(
        "La confianza es la salida del clasificador (softmax). "
        "No representa una garantía de acierto."
    )

    # Botón de voz (integración real en día 22)
    if st.button("🔊 Leer resultado en voz alta"):
        texto = f"El residuo identificado pertenece a la categoría {result['class']}."
        speak_text(texto)

    with st.expander("Ver probabilidades por clase"):
        for c, p in sorted(result["probabilities"].items(), key=lambda x: -x[1]):
            st.progress(p, text=f"{c}: {p*100:.2f} %")

    st.divider()
    if st.button("🔄 Nueva clasificación"):
        st.rerun()


if __name__ == "__main__":
    main()
