import { useRef, useCallback, useState, useEffect } from 'react';
import Hero from './components/Hero';
import AudioPoem from './components/AudioPoem';
import Timeline from './components/Timeline';
import MemoryCarousel from './components/MemoryCarousel';
import FinalMessage from './components/FinalMessage';
import SplashScreen from './components/SplashScreen';
import ParticlesLayer from './components/ParticlesLayer';
import { useDynamicTheme } from './hooks/useDynamicTheme';
import './App.css';

// ============================================================
// Fondos de pantalla (Atmósferas)
// Reemplaza estas imágenes en public/backgrounds/ con tus propias fotos
// ============================================================
const BACKGROUNDS = [
  {
    id: 'mar',
    src: '/backgrounds/lago.jpg', // Sugerencia: reemplaza con tu propia foto de 'mar.jpg'
    label: 'Mar',
    emoji: '🌊',
  },
  {
    id: 'bosque',
    src: '/backgrounds/kyoto.jpg', // Sugerencia: reemplaza con 'bosque.jpg'
    label: 'Bosque',
    emoji: '🌲',
  },
  {
    id: 'noche',
    src: '/backgrounds/tulipanes.jpg', // Sugerencia: reemplaza con 'noche.jpg'
    label: 'Noche',
    emoji: '✨',
  },
  {
    id: 'lluvia',
    src: '/backgrounds/santorini.jpg', // Sugerencia: reemplaza con 'lluvia.jpg'
    label: 'Lluvia',
    emoji: '🌧️',
  },
];

export default function App() {
  const audioPoemRef = useRef(null);
  const [currentBg, setCurrentBg] = useState(0);
  const [started, setStarted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Apply dynamic colors based on the current background image
  useDynamicTheme(BACKGROUNDS[currentBg].src);

  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showSplash]);

  const handleStart = useCallback(() => {
    if (started) {
      audioPoemRef.current?.restart();
    } else {
      setStarted(true);
      setTimeout(() => {
        audioPoemRef.current?.play();
      }, 400);
      setTimeout(() => {
        const poemSection = document.getElementById('poema');
        if (poemSection) {
          poemSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 800);
    }
  }, [started]);

  const nextBg = useCallback(() => {
    setCurrentBg(prev => (prev + 1) % BACKGROUNDS.length);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <main
        className="app"
        style={{ '--bg-image': `url(${BACKGROUNDS[currentBg].src})` }}
      >
        {/* Fondos dinámicos pre-cargados para crossfade suave */}
        <div className="app__bg" aria-hidden="true">
          {BACKGROUNDS.map((bg, idx) => (
            <div
              key={bg.id}
              className={`app__bg-layer ${idx === currentBg ? 'app__bg-layer--active' : ''}`}
              style={{ backgroundImage: `url(${bg.src})` }}
            />
          ))}
          <div className="app__bg-overlay" />
          
          {/* Partículas atadas al fondo actual */}
          <ParticlesLayer type={BACKGROUNDS[currentBg].id} />
        </div>

        {/* Capas Cinematográficas Globales */}
        <div className="cinematic-blur" aria-hidden="true" />
        <div className="cinematic-vignette" aria-hidden="true" />
        <div className="cinematic-grain" aria-hidden="true" />

        {/* Controles de fondo poéticos */}
        <div className="bg-nav" aria-hidden="true">
          <button
            className="bg-nav__btn"
            onClick={nextBg}
            aria-label="Cambiar atmósfera"
          >
            <span>✨ Atmósfera</span>
          </button>
        </div>

        {/* Contenido */}
        <Hero started={started} onStart={handleStart} />
        <AudioPoem ref={audioPoemRef} />
        <Timeline />
        <MemoryCarousel />
        <FinalMessage />
      </main>
    </>
  );
}
