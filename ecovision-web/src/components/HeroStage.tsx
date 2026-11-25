import React, { useRef } from "react";
import { Camera, ImagePlus, Leaf, ScanLine, Recycle, Mountain, LoaderCircle } from "lucide-react";

interface HeroStageProps {
  onFileSelect: (file: File) => void;
  onSampleSelect: (sampleName: string, filename: string) => void;
  sampleLoading: string | null;
}

export const HeroStage: React.FC<HeroStageProps> = ({ onFileSelect, onSampleSelect, sampleLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = "";
  };
  const samples = [
    { label: "Cartón", file: "A_carton1.jpg" },
    { label: "Vidrio", file: "A_vidrio1.jpg" },
    { label: "Metal", file: "A_metal1.jpg" },
    { label: "Papel", file: "A_papel1.jpg" },
    { label: "Otros", file: "B_otros1.jpg" },
  ];
  return (
    <>
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-landscape" aria-hidden="true" />
        <div className="hero-content">
          <span className="eyebrow"><Leaf size={16} /> INTELIGENCIA PARA UN PLANETA MEJOR</span>
          <h1 id="hero-title">Un pequeño gesto.<br /><span>Un gran cambio.</span></h1>
          <p className="hero-description">Reciclar empieza con una foto. Descubre qué tienes<br className="desktop-break" /> en tus manos y cómo darle una segunda vida.</p>
          <div className="upload-card">
            <div className="upload-symbol"><ScanLine size={28} strokeWidth={1.5} /></div>
            <h2>¿Qué vamos a reciclar hoy?</h2>
            <p>Sube una imagen y deja que la IA te ayude.</p>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} aria-label="Seleccionar imagen del residuo" />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} aria-label="Tomar foto del residuo" />
            <div className="upload-actions">
              <button type="button" className="primary-button" onClick={() => fileInputRef.current?.click()}><ImagePlus size={20} /> Seleccionar imagen</button>
              <button type="button" className="camera-button" onClick={() => cameraInputRef.current?.click()} aria-label="Tomar foto con la cámara"><Camera size={21} /></button>
            </div>
            <p className="upload-hint">o arrastra y suelta tu foto aquí</p>
            <span className="file-formats">JPG, PNG o WEBP</span>
          </div>
        </div>
        <div className="landscape-caption"><Mountain size={17} /><span>Illimani · La Paz, Bolivia</span></div>
        <a className="photo-credit" href="https://commons.wikimedia.org/wiki/File:Illimani_La_Paz.jpg" target="_blank" rel="noreferrer">Foto: EEJCC · CC BY-SA 4.0</a>
      </section>
      <section className="samples-section" aria-labelledby="samples-title">
        <div className="section-heading"><div><span className="section-kicker">PRUÉBALO TÚ MISMO</span><h2 id="samples-title">La segunda vida empieza aquí.</h2></div><p>Elige una muestra para explorar.</p></div>
        <div className="sample-grid" aria-busy={sampleLoading !== null}>
          {samples.map((sample) => <button type="button" className="sample-card" key={sample.file} disabled={sampleLoading !== null} onClick={() => onSampleSelect(sample.label, sample.file)}>
            <img src={`${import.meta.env.BASE_URL}samples/${sample.file}`} alt="" loading="lazy" />
            <span>{sample.label}{sampleLoading === sample.file ? <LoaderCircle size={17} className="animate-spin" /> : <Recycle size={17} />}</span>
          </button>)}
        </div>
        <span role="status" className="sample-status">{sampleLoading ? "Preparando tu imagen…" : "Una imagen. Un material. Una decisión más consciente."}</span>
      </section>
    </>
  );
};
