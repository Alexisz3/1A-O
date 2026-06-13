import { useCallback, useState } from 'react';
import { heroTitle, heroSubtitle, config } from '../constants/content';
import './Hero.css';

export default function Hero({ started, onStart }) {
  const [isOpening, setIsOpening] = useState(false);

  const handleStart = useCallback(() => {
    setIsOpening(true);
    onStart();
    setTimeout(() => {
      setIsOpening(false);
    }, 2500);
  }, [onStart]);

  return (
    <section className="hero" id="hero">
      {/* Grano cinematográfico movido a App.jsx */}

      <div className="hero__content">
        <div className="hero__ornament" aria-hidden="true">
          <span className="hero__ornament-line" />
          <span className="hero__ornament-diamond">◆</span>
          <span className="hero__ornament-line" />
        </div>

        <p className="hero__label">Para {config.partnerName}</p>
        <h1 className="hero__title">{heroTitle}</h1>
        <p className="hero__date">{config.startDate} - {config.endDate}</p>
        <p className="hero__subtitle">{heroSubtitle}</p>

        <div className="hero__ornament hero__ornament--bottom" aria-hidden="true">
          <span className="hero__ornament-line" />
        </div>

        <button
          className={`hero__button ${started ? 'hero__button--started' : ''}`}
          onClick={handleStart}
          disabled={isOpening}
          aria-label={started ? "Volver al poema" : "Abrir este recuerdo"}
        >
          {isOpening ? (
            <>
              <span className="hero__button-icon">
                {/* Nota musical */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3z"/>
                </svg>
              </span>
              Abriendo…
            </>
          ) : started ? (
            <>
              <span className="hero__button-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
              Volver al poema
            </>
          ) : (
            <>
              <span className="hero__button-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
              Abrir este recuerdo
            </>
          )}
        </button>

        {!started && (
          <p className="hero__hint">Tómate tu tiempo</p>
        )}
      </div>

      <div className="hero__scroll-indicator" aria-hidden="true">
        <div className="hero__scroll-arrow" />
      </div>
    </section>
  );
}
