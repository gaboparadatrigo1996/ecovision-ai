
import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image


class EcoVisionClassifier:
    """
    Clasificador de residuos con MobileNetV2 + cabeza personalizada.

    Uso:
        clf = EcoVisionClassifier()
        resultado = clf.predict(pil_image)
        # resultado = {
        #   "class": "plastic",
        #   "confidence": 0.94,
        #   "probabilities": {"cardboard": 0.01, ..., "trash": 0.00}
        # }
    """

    IMG_SIZE = (224, 224)

    def __init__(self, model_path=None, class_names_path=None):
        here = os.path.dirname(os.path.abspath(__file__))
        if model_path is None:
            candidates = [
                os.path.join(here, "..", "model", "ecovision_model.keras"),
                os.path.join(here, "model", "ecovision_model.keras"),
                os.path.join(here, "ecovision_model.keras"),
                os.path.join(os.getcwd(), "model", "ecovision_model.keras"),
                os.path.join(os.getcwd(), "EcoVision-AI", "model", "ecovision_model.keras")
            ]
            for c in candidates:
                if os.path.exists(c):
                    model_path = c
                    break
            if model_path is None:
                model_path = os.path.join(here, "..", "model", "ecovision_model.keras")

        if class_names_path is None:
            candidates_names = [
                os.path.join(here, "..", "model", "class_names.json"),
                os.path.join(here, "model", "class_names.json"),
                os.path.join(here, "class_names.json"),
                os.path.join(os.getcwd(), "model", "class_names.json"),
                os.path.join(os.getcwd(), "EcoVision-AI", "model", "class_names.json")
            ]
            for c in candidates_names:
                if os.path.exists(c):
                    class_names_path = c
                    break
            if class_names_path is None:
                class_names_path = os.path.join(here, "..", "model", "class_names.json")

        model_path = os.path.abspath(model_path)
        class_names_path = os.path.abspath(class_names_path)

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Modelo no encontrado en {model_path}")
        if not os.path.exists(class_names_path):
            raise FileNotFoundError(f"class_names.json no encontrado en {class_names_path}")

        self.model = tf.keras.models.load_model(model_path)
        with open(class_names_path, "r", encoding="utf-8") as f:
            self.class_names = json.load(f)

    def preprocess(self, image: Image.Image) -> np.ndarray:
        """
        Replica exactamente el pipeline del entrenamiento:
        PIL -> RGB -> resize(224,224) -> np.array [0,255] -> preprocess_input -> [-1,1]
        """
        if image.mode != "RGB":
            image = image.convert("RGB")
        image = image.resize(self.IMG_SIZE)
        arr = np.array(image, dtype=np.float32)        # [0, 255]
        arr = preprocess_input(arr)                     # [-1, 1]
        return np.expand_dims(arr, axis=0)              # (1, 224, 224, 3)

    def predict(self, image: Image.Image) -> dict:
        batch = self.preprocess(image)
        probs = self.model.predict(batch, verbose=0)[0]

        idx = int(np.argmax(probs))
        return {
            "class": self.class_names[idx],
            "confidence": float(probs[idx]),
            "probabilities": {
                c: float(p) for c, p in zip(self.class_names, probs)
            }
        }

    def predict_batch(self, images) -> list:
        """Predicción sobre una lista de PIL.Images."""
        return [self.predict(img) for img in images]
