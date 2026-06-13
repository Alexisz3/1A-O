import { useState, useRef, useCallback, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { replyMessage, finalSignature, finalPromise, secretMessage } from '../constants/content';
import './FinalMessage.css';

export default function FinalMessage() {
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: messageRef, isVisible: messageVisible } = useScrollReveal({ threshold: 0.15 });
  const { ref: signRef, isVisible: signVisible } = useScrollReveal({ threshold: 0.2 });

  const [showSecret, setShowSecret] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  
  const timerRef = useRef(null);
  const musicRef = useRef(null);
  const voiceRef = useRef(null);

  const startPress = useCallback(() => {
    if (showSecret) return;
    setIsPressing(true);
    timerRef.current = setTimeout(() => {
      setShowSecret(true);
      setIsPressing(false);
    }, 1200); // 1.2s press
  }, [showSecret]);

  const cancelPress = useCallback(() => {
    setIsPressing(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const toggleMusic = useCallback(() => {
    if (!musicRef.current) return;
    if (isPlayingMusic) {
      musicRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      musicRef.current.volume = isPlayingVoice ? 0.15 : 0.6;
      musicRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => setIsPlayingMusic(false));
    }
  }, [isPlayingMusic, isPlayingVoice]);

  const toggleVoice = useCallback(() => {
    if (!voiceRef.current) return;
    if (isPlayingVoice) {
      voiceRef.current.pause();
      setIsPlayingVoice(false);
    } else {
      voiceRef.current.volume = 1.0;
      voiceRef.current.play().then(() => setIsPlayingVoice(true)).catch(() => setIsPlayingVoice(false));
    }
  }, [isPlayingVoice]);

  // Efecto de "Ducking" (Bajar volumen de la música cuando habla la voz)
  useEffect(() => {
    if (!musicRef.current) return;
    
    let interval;
    if (isPlayingVoice && isPlayingMusic) {
      // Fade down music
      let vol = musicRef.current.volume;
      interval = setInterval(() => {
        if (vol > 0.15) {
          vol -= 0.05;
          musicRef.current.volume = Math.max(vol, 0.15);
        } else {
          clearInterval(interval);
        }
      }, 50);
    } else if (!isPlayingVoice && isPlayingMusic) {
      // Fade up music
      let vol = musicRef.current.volume;
      interval = setInterval(() => {
        if (vol < 0.6) {
          vol += 0.05;
          musicRef.current.volume = Math.min(vol, 0.6);
        } else {
          clearInterval(interval);
        }
      }, 50);
    }

    return () => clearInterval(interval);
  }, [isPlayingVoice, isPlayingMusic]);

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
    <section
      className={`final-message ${isVisible ? 'final-message--visible' : ''}`}
      ref={sectionRef}
      id="mensaje"
    >
      {/* Añadimos ?v=2 para evitar que el navegador cargue una versión vieja en caché */}
      <audio ref={musicRef} src="/audio/cancion-final.mp3?v=2" preload="none" onEnded={() => setIsPlayingMusic(false)} loop />
      <audio ref={voiceRef} src="/audio/voz.mp4?v=2" preload="none" onEnded={() => setIsPlayingVoice(false)} />
      
      <div className="final-message__inner">

        {/* Línea decorativa superior */}
        <div className="final-message__top-ornament" aria-hidden="true">
          <span className="final-message__ornament-line" />
          <span className="final-message__ornament-symbol">✦</span>
          <span className="final-message__ornament-line" />
        </div>

        <span className="final-message__label">Para ti, siempre</span>

        {/* El mensaje */}
        <div
          ref={messageRef}
          className={`final-message__card ${messageVisible ? 'final-message__card--visible' : ''}`}
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
          ref={signRef}
          className={`final-message__signature ${signVisible ? 'final-message__signature--visible' : ''}`}
        >
          <div className="final-message__promise">
            <p>{finalPromise}</p>
          </div>

          <div className="final-message__signature-line" aria-hidden="true" />
          
          <div className="final-message__signature-row">
            <p className="final-message__signature-text">{finalSignature}</p>
            
            <div className="final-message__audio-controls">
              {/* Botón de Música */}
              <button 
                className={`final-message__audio-btn ${isPlayingMusic ? 'active' : ''}`} 
                onClick={toggleMusic}
                aria-label={isPlayingMusic ? "Pausar música" : "Reproducir música"}
                title={isPlayingMusic ? "Pausar música" : "Escuchar música de fondo"}
              >
                {isPlayingMusic ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1"/>
                    <rect x="14" y="4" width="4" height="16" rx="1"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    {/* Icono de nota musical */}
                    <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/>
                  </svg>
                )}
              </button>

              {/* Botón de Voz */}
              <button 
                className={`final-message__audio-btn ${isPlayingVoice ? 'active' : ''}`} 
                onClick={toggleVoice}
                aria-label={isPlayingVoice ? "Pausar voz" : "Escuchar mensaje de voz"}
                title={isPlayingVoice ? "Pausar mensaje" : "Escuchar mi voz"}
              >
                {isPlayingVoice ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1"/>
                    <rect x="14" y="4" width="4" height="16" rx="1"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    {/* Icono de Play */}
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

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

      </div>
    </section>
  );
}
