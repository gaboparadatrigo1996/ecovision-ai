import { useState, useEffect, useCallback } from "react";
import { HeroStage } from "./components/HeroStage";
import { StagingStage } from "./components/StagingStage";
import { LoadingStage } from "./components/LoadingStage";
import { ResultStage } from "./components/ResultStage";
import { DragOverlay } from "./components/DragOverlay";
import { History } from "./components/History";
import { AboutModal } from "./components/AboutModal";
import { predict, checkHealth } from "./api/client";
import { useSpeech } from "./hooks/useSpeech";
import { Prediction, HistoryItem } from "./types";
import { Info, AlertCircle } from "lucide-react";

type Stage = "idle" | "staged" | "loading" | "result";

export function App() {
  const [stage, setStage] = useState<Stage>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [backendReady, setBackendReady] = useState<boolean | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("ecovision_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { speak, stop, isSpeaking } = useSpeech();

  // Comprobar estado de conexión con la API (sin parpadeos molestos)
  const verifyBackend = useCallback((silent = false) => {
    if (!silent) setBackendReady(null);
    checkHealth().then((status) => {
      if (status.ok && status.model_loaded) {
        setBackendReady(true);
        setBackendError(null);
      } else {
        setBackendReady(false);
        setBackendError(status.error || "No se pudo conectar");
      }
    });
  }, []);

  useEffect(() => {
    // Comprobación inicial
    verifyBackend(false);

    // Verificación silenciosa en segundo plano cada 30 segundos
    const interval = setInterval(() => {
      verifyBackend(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [verifyBackend]);

  // Manejador global de arrastrar y soltar (Drag and Drop)
  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer && e.dataTransfer.types.includes("Files")) {
        setIsDraggingOver(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        setIsDraggingOver(false);
        dragCounter = 0;
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDraggingOver(false);

      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          handleFileStaged(file);
        }
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  // Paso 1: Archivo seleccionado -> Pasa a Staging (previsualización con botón de Analizar)
  const handleFileStaged = useCallback((file: File) => {
    stop();
    setErrorMessage(null);
    setPrediction(null);
    setSelectedFile(file);

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    const url = URL.createObjectURL(file);
    setImagePreviewUrl(url);
    setStage("staged");
  }, [imagePreviewUrl, stop]);

  // Selección de muestra rápida predeterminada
  const handleSampleSelect = async (_label: string, filename: string) => {
    try {
      const response = await fetch(`/samples/${filename}`);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: "image/jpeg" });
      handleFileStaged(file);
    } catch {
      setErrorMessage("No se pudo cargar la imagen de prueba.");
    }
  };

  // Paso 2: Usuario pulsa "Analizar residuo" -> Pasa a Loading y llama a la API
  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setStage("loading");
    setErrorMessage(null);

    try {
      const result = await predict(selectedFile);
      setPrediction(result);
      setBackendReady(true);
      setBackendError(null);
      setStage("result");

      // Guardar en el historial local
      if (imagePreviewUrl) {
        const newItem: HistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          imagePreviewUrl,
          prediction: result
        };

        setHistory((prev) => {
          const updated = [newItem, ...prev.slice(0, 9)];
          try {
            localStorage.setItem("ecovision_history", JSON.stringify(updated));
          } catch {
            // Manejo de cuota local
          }
          return updated;
        });
      }
    } catch (err: unknown) {
      setStage("staged");
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Error al conectar con la API de clasificación.");
      }
    }
  };

  // Reiniciar flujo y volver al Hero
  const handleReset = () => {
    stop();
    setStage("idle");
    setPrediction(null);
    setSelectedFile(null);
    setErrorMessage(null);
  };

  // Cargar elemento guardado del historial
  const handleSelectHistoryItem = (item: HistoryItem) => {
    stop();
    setImagePreviewUrl(item.imagePreviewUrl);
    setPrediction(item.prediction);
    setSelectedFile(new File([], "imagen_historial.jpg"));
    setStage("result");
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("ecovision_history");
    } catch {
      // Ignorar
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f4f5f8] text-slate-800">
      {/* Overlay al arrastrar archivo */}
      <DragOverlay isVisible={isDraggingOver} />

      {/* Barra de Navegación Superior */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo estilo iLovePDF con color entero */}
          <div
            onClick={handleReset}
            className="flex items-center gap-2 cursor-pointer select-none"
            title="Ir al inicio"
          >
            <div className="w-8 h-8 rounded bg-[#e5322d] text-white font-black flex items-center justify-center text-sm shadow-sm">
              ECO
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black tracking-tight text-slate-900">
                EcoVision
              </span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Estado del Backend */}
            <div
              onClick={() => verifyBackend(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer select-none transition-colors ${
                backendReady === true
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : backendReady === false
                  ? "bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100"
                  : "bg-slate-100 text-slate-700 border-slate-300"
              }`}
              title={
                backendReady === true
                  ? "API en la nube conectada y lista"
                  : backendReady === false
                  ? `Error: ${backendError || "sin conexión"}. Haz clic para reintentar.`
                  : "Comprobando conexión..."
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  backendReady === true
                    ? "bg-emerald-500"
                    : backendReady === false
                    ? "bg-rose-500"
                    : "bg-amber-400 animate-pulse"
                }`}
              />
              <span className="font-semibold">
                {backendReady === true
                  ? "En línea"
                  : backendReady === false
                  ? "Reconectar"
                  : "Conectando..."}
              </span>
            </div>

            {/* Botón de Información */}
            <button
              type="button"
              onClick={() => setIsAboutOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Información y limitaciones del modelo"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Notificación de Error */}
      {errorMessage && (
        <div className="max-w-xl mx-auto mt-4 px-4 w-full">
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs space-y-1">
              <p className="font-bold">Error en el análisis</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor Principal según el Estado (Stage) */}
      <main className="flex-1 flex flex-col w-full">
        {stage === "idle" && (
          <>
            <HeroStage
              onFileSelect={handleFileStaged}
              onSampleSelect={handleSampleSelect}
            />
            {history.length > 0 && (
              <div className="px-4 pb-12">
                <History
                  items={history}
                  onSelectItem={handleSelectHistoryItem}
                  onClear={handleClearHistory}
                />
              </div>
            )}
          </>
        )}

        {stage === "staged" && selectedFile && imagePreviewUrl && (
          <StagingStage
            file={selectedFile}
            previewUrl={imagePreviewUrl}
            onAnalyze={handleStartAnalysis}
            onCancel={handleReset}
            onChangeFile={handleFileStaged}
          />
        )}

        {stage === "loading" && (
          <LoadingStage filename={selectedFile?.name} />
        )}

        {stage === "result" && prediction && imagePreviewUrl && selectedFile && (
          <ResultStage
            prediction={prediction}
            imageUrl={imagePreviewUrl}
            filename={selectedFile.name}
            onReset={handleReset}
            onSpeak={speak}
            onStopSpeak={stop}
            isSpeaking={isSpeaking}
          />
        )}
      </main>

      {/* Pie de Página */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto space-y-1">
          <p>
            EcoVision AI — Clasificador de Residuos Urbanos con <strong>MobileNetV2</strong> y <strong>FastAPI</strong>.
          </p>
          <p>
            Entrenado con <strong>Stanford TrashNet</strong> (2,527 imágenes, 6 clases) • Exactitud global en test: 88.65%
          </p>
        </div>
      </footer>

      {/* Modal Acerca de */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}

export default App;
