
"""
Módulo de voz para EcoVision AI.

Usa la Web Speech API del navegador (`speechSynthesis`), inyectada vía
streamlit.components.v1.html. No depende de modelos de IA ni servicios externos.

Limitaciones:
- La voz y su calidad dependen del navegador y del sistema operativo.
- En algunos navegadores (Safari/iOS) puede requerir interacción del usuario.
- Si no hay voces en español instaladas, el navegador puede leer con voz por defecto.
"""

import streamlit.components.v1 as components


def speak_text(texto: str, lang: str = "es-ES", rate: float = 1.0, pitch: float = 1.0):
    """
    Inyecta JavaScript que reproduce `texto` usando speechSynthesis del navegador.

    Args:
        texto: cadena a leer.
        lang: código de idioma BCP-47 (por defecto español de España).
        rate: velocidad (1.0 = normal).
        pitch: tono (1.0 = normal).
    """
    texto_js = texto.replace("\\", "\\\\").replace("'", "\\'").replace('"', '\\"')
    js = f"""
    <script>
    (function() {{
        if ('speechSynthesis' in window) {{
            window.speechSynthesis.cancel();
            var msg = new SpeechSynthesisUtterance("{texto_js}");
            msg.lang = "{lang}";
            msg.rate = {rate};
            msg.pitch = {pitch};
            window.speechSynthesis.speak(msg);
        }}
    }})();
    </script>
    """
    components.html(js, height=0)
