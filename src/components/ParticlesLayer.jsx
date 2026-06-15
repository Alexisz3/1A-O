import { useMemo } from 'react';
import './ParticlesLayer.css';

function seededRandom(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function buildParticle(type, index) {
  const baseSeed = index + type.length * 101;
  const style = {
    '--delay': `${seededRandom(baseSeed + 1) * 5}s`,
    '--duration': `${seededRandom(baseSeed + 2) * 3 + 3}s`,
    '--left': `${seededRandom(baseSeed + 3) * 100}%`,
    '--size': `${seededRandom(baseSeed + 4) * 10 + 4}px`,
    '--opacity': `${seededRandom(baseSeed + 5) * 0.5 + 0.3}`,
  };

  if (type === 'bosque') {
    style['--rotation'] = `${seededRandom(baseSeed + 6) * 360}deg`;
    style['--duration'] = `${seededRandom(baseSeed + 7) * 5 + 6}s`;
  } else if (type === 'noche') {
    style['--duration'] = `${seededRandom(baseSeed + 8) * 4 + 4}s`;
    style['--top'] = `${seededRandom(baseSeed + 9) * 100}%`;
    style['--x-drift'] = `${(seededRandom(baseSeed + 10) - 0.5) * 100}px`;
    style['--y-drift'] = `${(seededRandom(baseSeed + 11) - 0.5) * 100}px`;
  } else if (type === 'mar') {
    style['--duration'] = `${seededRandom(baseSeed + 12) * 4 + 6}s`;
  } else if (type === 'lluvia') {
    style['--duration'] = `${seededRandom(baseSeed + 13) * 0.5 + 0.5}s`;
    style['--size'] = `${seededRandom(baseSeed + 14) * 10 + 10}px`;
  }

  return style;
}

export default function ParticlesLayer({ type }) {
  const particleCount = type === 'lluvia' ? 40 : 25;
  const particles = useMemo(
    () => Array.from({ length: particleCount }, (_, index) => buildParticle(type, index)),
    [particleCount, type],
  );

  return (
    <div className={`particles-container particles--${type}`} aria-hidden="true">
      {particles.map((style, index) => (
        <div key={index} className="particle" style={style} />
      ))}
    </div>
  );
}
