import { useState, useRef, useCallback } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { replyMessage, finalSignature, finalDedication, openLetterLabel, finalPromise, secretMessage, bibleVerse } from '../constants/content';
import './FinalMessage.css';

export default function FinalMessage() {
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: verseRef, isVisible: verseVisible } = useScrollReveal({ threshold: 0.2 });

  const [showSecret, setShowSecret] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  
  const timerRef = useRef(null);

  const startPress = useCallback(() => {
    if (showSecret) return;
    setIsPressing(true);
    timerRef.current = setTimeout(() => {
      setShowSecret(true);
      setIsPressing(false);
    }, 1200);
  }, [showSecret]);

  const cancelPress = useCallback(() => {
    setIsPressing(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      startPress();
    }
  }, [startPress]);

  const handleKeyUp = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cancelPress();
    }
  }, [cancelPress]);

  return (
    <>
      <section
        className={`final-message ${isVisible ? 'final-message--visible' : ''}`}
        ref={sectionRef}
        id="mensaje"
      >
        <div className="final-message__inner">

          {/* Línea decorativa superior */}
          <div className="final-message__top-ornament" aria-hidden="true">
            <span className="final-message__ornament-line" />
            <span className="final-message__ornament-symbol">✦</span>
            <span className="final-message__ornament-line" />
          </div>

          <span className="final-message__label">Para ti, siempre</span>

          {!isRevealed ? (
            <div className="final-message__reveal-container">
              <button 
                className="final-message__reveal-btn" 
                onClick={() => setIsRevealed(true)}
                aria-label={openLetterLabel}
              >
                <span className="final-message__reveal-diamond">◆</span>
                {openLetterLabel}
                <span className="final-message__reveal-diamond">◆</span>
              </button>
            </div>
          ) : (
            <>
              {/* El mensaje */}
              <div
                className={`final-message__card ${isRevealed ? 'final-message__card--visible' : ''}`}
              >
                {/* Comilla decorativa */}
                <span className="final-message__quote" aria-hidden="true">"</span>

                <div className="final-message__text">
                  {(replyMessage || '').split('\n').map((paragraph, idx) => (
                    paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
                  ))}
                </div>
              </div>

              {/* Firma */}
              <div
                className={`final-message__signature ${isRevealed ? 'final-message__signature--visible' : ''}`}
              >
                <div className="final-message__promise">
                  <p>{finalPromise}</p>
                </div>

                <div className="final-message__signature-line" aria-hidden="true" />
                
                <div className="final-message__signature-row">
                  <p className="final-message__signature-text">{finalSignature}</p>
                </div>

                {finalDedication && (
                  <p className="final-message__dedication">{finalDedication}</p>
                )}

                {/* Ornamento final - Easter Egg Trigger */}
                <div 
                  className="final-message__closing" 
                  role="button"
                  tabIndex={0}
                  aria-label="Botón secreto"
                  onPointerDown={startPress}
                  onPointerUp={cancelPress}
                  onPointerLeave={cancelPress}
                  onPointerCancel={cancelPress}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                >
                  <span className={`final-message__closing-diamond ${showSecret ? 'glow' : ''} ${isPressing ? 'pressing' : ''}`}>◆</span>
                </div>

                {/* Easter Egg Message */}
                <div className={`final-message__secret ${showSecret ? 'final-message__secret--visible' : ''}`}>
                  <p>{secretMessage}</p>
                </div>
              </div>
            </>
          )}

        </div>
      </section>

      {/* Sección Bíblica separada — fuera del mensaje final */}
      <section
        ref={verseRef}
        className={`bible-section ${verseVisible ? 'bible-section--visible' : ''}`}
      >
        <div className="bible-section__inner">
          <div className="bible-section__ornament" aria-hidden="true">
            <span className="bible-section__ornament-line" />
            <span className="bible-section__ornament-icon">🕊️</span>
            <span className="bible-section__ornament-line" />
          </div>
          <p className="bible-section__quote">"{bibleVerse.quote}"</p>
          <p className="bible-section__reference">— {bibleVerse.reference}</p>
        </div>
      </section>
    </>
  );
}
