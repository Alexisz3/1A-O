import './ParticlesLayer.css';

// types: 'mar', 'bosque', 'noche', 'lluvia'
export default function ParticlesLayer({ type }) {
  // Número de partículas depende del tipo
  const particleCount = type === 'lluvia' ? 40 : 25;
  const particles = Array.from({ length: particleCount });

  return (
    <div className={`particles-container particles--${type}`} aria-hidden="true">
      {particles.map((_, i) => {
        // Valores aleatorios para CSS
        const style = {
          '--delay': `${Math.random() * 5}s`,
          '--duration': `${Math.random() * 3 + 3}s`,
          '--left': `${Math.random() * 100}%`,
          '--size': `${Math.random() * 10 + 4}px`, // 4px a 14px
          '--opacity': `${Math.random() * 0.5 + 0.3}`
        };

        if (type === 'bosque') {
          // Pétalos
          style['--rotation'] = `${Math.random() * 360}deg`;
          style['--duration'] = `${Math.random() * 5 + 6}s`; // Más lentos
        } else if (type === 'noche') {
          // Luciérnagas
          style['--duration'] = `${Math.random() * 4 + 4}s`;
          style['--top'] = `${Math.random() * 100}%`;
          style['--x-drift'] = `${(Math.random() - 0.5) * 100}px`;
          style['--y-drift'] = `${(Math.random() - 0.5) * 100}px`;
        } else if (type === 'mar') {
          // Burbujas
          style['--duration'] = `${Math.random() * 4 + 6}s`;
        } else if (type === 'lluvia') {
          // Lluvia
          style['--duration'] = `${Math.random() * 0.5 + 0.5}s`;
          style['--size'] = `${Math.random() * 10 + 10}px`; // largo
        }

        return <div key={i} className="particle" style={style} />;
      })}
    </div>
  );
}
