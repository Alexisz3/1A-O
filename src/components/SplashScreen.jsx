import { useMemo, useState } from 'react';
import './SplashScreen.css';

function seededRandom(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export default function SplashScreen({ onComplete, audioRef, onInitWebAudio }) {
  const [stage, setStage] = useState('initial');

  const particles = useMemo(
    () => Array.from({ length: 30 }, (_, index) => ({
      id: index,
      left: seededRandom(index + 1) * 100,
      delay: seededRandom(index + 2) * 6,
      duration: 4 + seededRandom(index + 3) * 6,
      size: 2 + seededRandom(index + 4) * 4,
      opacity: 0.15 + seededRandom(index + 5) * 0.4,
    })),
    [],
  );

  const handleTap = () => {
    if (stage !== 'initial') return;

    onInitWebAudio?.();

    if (audioRef?.current) {
      audioRef.current.volume = 0.4;
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audioRef.current.currentTime = 6.5;
          })
          .catch((error) => console.error('Audio error:', error));
      }
    }

    setStage('text-visible');

    setTimeout(() => {
      setStage('fading-out');
    }, 2800);

    setTimeout(() => {
      onComplete?.();
    }, 3800);
  };

  return (
    <div className={`splash-screen ${stage === 'fading-out' ? 'splash-screen--fading-out' : ''}`}>
      <div className="splash-screen__particles" aria-hidden="true">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="splash-screen__particle"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
            }}
          />
        ))}
      </div>

      <div className={`splash-screen__content ${stage !== 'initial' ? 'splash-screen__content--visible' : ''}`}>
        {stage === 'initial' ? (
          <div className="splash-screen__invitation">
            <div className="splash-screen__ornament" aria-hidden="true">
              <span className="splash-screen__ornament-line" />
              <span className="splash-screen__ornament-diamond">◆</span>
              <span className="splash-screen__ornament-line" />
            </div>
            <p className="splash-screen__subtitle">Para alguien especial</p>
            <button className="splash-screen__start-btn" onClick={handleTap}>
              Abrir regalo
            </button>
            <p className="splash-screen__hint">Toca para comenzar</p>
          </div>
        ) : (
          <p className="splash-screen__text">Un recuerdo para la eternidad</p>
        )}
      </div>
    </div>
  );
}
