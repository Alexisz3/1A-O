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
    src: '/backgrounds/lago.jpg',
    label: 'Mar',
    emoji: '🌊',
  },
  {
    id: 'bosque',
    src: '/backgrounds/kyoto.jpg',
    label: 'Bosque',
    emoji: '🌲',
  },
  {
    id: 'noche',
    src: '/backgrounds/tulipanes.jpg',
    label: 'Noche',
    emoji: '✨',
  },
  {
    id: 'lluvia',
    src: '/backgrounds/santorini.jpg',
    label: 'Lluvia',
    emoji: '🌧️',
  },
];

export default function App() {
  const audioPoemRef = useRef(null);
  const globalAudioRef = useRef(null);
  const [currentBg, setCurrentBg] = useState(0);
  const [started, setStarted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [poemPlaying, setPoemPlaying] = useState(false);
  // Nodos para Web Audio API (necesario para controlar volumen en iOS)
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const trackRef = useRef(null);

  // Apply dynamic colors based on the current background image
  useDynamicTheme(BACKGROUNDS[currentBg].src);

  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showSplash]);

  // Inicializar Web Audio API para controlar volumen real en iOS
  const initWebAudio = useCallback(() => {
    if (!audioCtxRef.current && globalAudioRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      
      // Conectar el elemento <audio> al contexto de Web Audio
      trackRef.current = audioCtxRef.current.createMediaElementSource(globalAudioRef.current);
      gainNodeRef.current = audioCtxRef.current.createGain();
      
      // Volumen inicial (0.4)
      gainNodeRef.current.gain.value = 0.4;
      
      trackRef.current.connect(gainNodeRef.current).connect(audioCtxRef.current.destination);
    }
    
    // Si el contexto estaba suspendido, lo reanudamos
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  // Reactive volume ducking: when poem plays, lower volume. When it stops, restore volume.
  useEffect(() => {
    // Si estamos en iOS, controlamos el gain node
    if (gainNodeRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      const targetVolume = poemPlaying ? 0.05 : 0.4;
      
      // Transición suave de volumen usando Web Audio API (funciona 100% en iOS)
      gainNodeRef.current.gain.cancelScheduledValues(now);
      gainNodeRef.current.gain.linearRampToValueAtTime(targetVolume, now + 1.5); // 1.5 segundos de fade
    } else if (globalAudioRef.current) {
      // Fallback para PC / Android si Web Audio falló
      const targetVolume = poemPlaying ? 0.05 : 0.4;
      const interval = setInterval(() => {
        if (!globalAudioRef.current) {
          clearInterval(interval);
          return;
        }
        let vol = globalAudioRef.current.volume;
        if (Math.abs(vol - targetVolume) < 0.01) {
          globalAudioRef.current.volume = targetVolume;
          clearInterval(interval);
        } else {
          vol += (targetVolume > vol) ? 0.02 : -0.02;
          globalAudioRef.current.volume = Math.max(0, Math.min(1, vol));
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [poemPlaying]);

  // Custom loop: Reiniciar la canción al llegar a 3:48 (228 segundos) y volver a 6.5s
  useEffect(() => {
    const audio = globalAudioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      // 3 minutos con 48 segundos = 228 segundos
      if (audio.currentTime >= 228) {
        audio.currentTime = 6.5; // Volver al inicio coordinado
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

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
      {/* Audio global de fondo — fuera de cualquier componente desmontable */}
      <audio ref={globalAudioRef} src="/audio/cancion-final.mp3" loop preload="metadata" crossOrigin="anonymous" />

      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} audioRef={globalAudioRef} onInitWebAudio={initWebAudio} />}
      
      <main
        className="app"
        style={{ '--bg-image': `url(${BACKGROUNDS[currentBg].src})` }}
      >
        {/* Fondos dinámicos pre-cargados para crossfade suave */}
        <div className="app__bg" aria-hidden="true">
          <div
            key={BACKGROUNDS[currentBg].id}
            className="app__bg-layer app__bg-layer--active"
            style={{ backgroundImage: `url(${BACKGROUNDS[currentBg].src})` }}
          />
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
        <AudioPoem ref={audioPoemRef} onPlayStateChange={setPoemPlaying} />
        <Timeline />
        <MemoryCarousel />
        <FinalMessage />
      </main>
    </>
  );
}
