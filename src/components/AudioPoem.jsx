import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { synchronizedLyrics, poemSectionTitle, poemAttribution } from '../constants/content';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './AudioPoem.css';

const AudioPoem = forwardRef(function AudioPoem(_, ref) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);
  const progressBarRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  const lyricRefs = useRef([]);
  const [activeLyric, setActiveLyric] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);

  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: poemRef, isVisible: poemVisible } = useScrollReveal({ threshold: 0.05 });

  // Expose play/pause/restart to parent
  useImperativeHandle(ref, () => ({
    play: () => {
      const audio = audioRef.current;
      if (!audio || hasError) return;
      setReviewMode(false);
      audio.play().catch(() => setHasError(true));
    },
    pause: () => {
      audioRef.current?.pause();
    },
    restart: () => {
      const audio = audioRef.current;
      if (!audio || hasError) return;
      audio.currentTime = 0;
      setActiveLyric(0);
      setProgress(0);
      setReviewMode(false);
      audio.play().catch(() => setHasError(true));
      
      // Scroll to self
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }));

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || hasError) return;
    if (isPlaying) {
      audio.pause();
    } else {
      setReviewMode(false);
      audio.play().catch(() => setHasError(true));
    }
  }, [isPlaying, hasError]);

  const animationRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => {
      setIsPlaying(false);
      cancelAnimationFrame(animationRef.current);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      // No reseteamos el activeLyric para evitar que haga auto-scroll hacia arriba o abajo
      setReviewMode(true);
      cancelAnimationFrame(animationRef.current);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onError = () => setHasError(true);

    // 60fps rAF loop — only runs while playing
    const checkTime = () => {
      const t = audio.currentTime;
      if (audio.duration) setProgress(t / audio.duration);

      // Find active lyric index
      let activeIdx = 0;
      for (let i = 0; i < synchronizedLyrics.length; i++) {
        if (t >= synchronizedLyrics[i].time) activeIdx = i;
        else break;
      }

      setActiveLyric(prev => {
        if (activeIdx !== prev) {
          // Auto-scroll
          if (lyricRefs.current[activeIdx]) {
            lyricRefs.current[activeIdx].scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
          return activeIdx;
        }
        return prev;
      });

      animationRef.current = requestAnimationFrame(checkTime);
    };

    const startLoop = () => {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(checkTime);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('play', startLoop);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('error', onError);

    return () => {
      cancelAnimationFrame(animationRef.current);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('play', startLoop);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // DEV Mode Keyboard Shortcut for Calibration
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
        const time = audioRef.current?.currentTime;
        if (time !== undefined) {
          navigator.clipboard.writeText(time.toFixed(2));
          console.log(`[DEV] Time copied: ${time.toFixed(2)}`);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleProgressClick = useCallback((e) => {
    const audio = audioRef.current;
    if (!audio || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
  }, []);

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <section className={`audio-poem ${isVisible ? 'audio-poem--visible' : ''}`} ref={sectionRef} id="poema">
      <div className="audio-poem__inner">

        {/* Título de sección */}
        <div className="audio-poem__header">
          <span className="audio-poem__label">Para ti</span>
          <h2 className="audio-poem__title">{poemSectionTitle}</h2>
          <div className="audio-poem__divider" aria-hidden="true">
            <span className="audio-poem__divider-line" />
            <span className="audio-poem__divider-ornament">✦</span>
            <span className="audio-poem__divider-line" />
          </div>
        </div>

        {/* Reproductor de audio */}
        <div className="audio-player">
          <audio ref={audioRef} src="/audio/poema.mp3" preload="metadata" />

          {hasError && (
            <p className="audio-player__error">
              El audio llegará pronto. Por ahora, lee el poema y déjate llevar.
            </p>
          )}

          {!hasError && (
            <>


              {/* Controles */}
              <div className="audio-player__controls">
                <button
                  className="audio-player__btn"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pausar poema' : 'Reproducir poema'}
                >
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <rect x="6" y="4" width="4" height="16" rx="1"/>
                      <rect x="14" y="4" width="4" height="16" rx="1"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>

                <div className="audio-player__progress-wrap">
                  <div
                    className="audio-player__progress-bar"
                    ref={progressBarRef}
                    onClick={handleProgressClick}
                    role="slider"
                    aria-label="Progreso del audio"
                    aria-valuenow={Math.round(progress * 100)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="audio-player__progress-fill"
                      style={{ width: `${progress * 100}%` }}
                    />
                    <div
                      className="audio-player__progress-thumb"
                      style={{ left: `${progress * 100}%` }}
                    />
                  </div>
                  <div className="audio-player__times">
                    {/* Modo calibración: Muestra el tiempo exacto con decimales */}
                    <span style={{ color: '#d4af37', fontWeight: 'bold' }}>
                      {(audioRef.current?.currentTime ?? 0).toFixed(2)}s
                    </span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>

              <p className="audio-player__hint">
                {isPlaying ? 'Escuchando…' : reviewMode ? 'Puedes deslizar para leerlo de nuevo' : 'Toca para escuchar'}
              </p>
            </>
          )}
        </div>

        {/* Letras sincronizadas */}
        <div
          className={`poem-translation ${poemVisible ? 'poem-translation--visible' : ''} ${reviewMode ? 'poem-translation--review' : ''}`}
          ref={poemRef}
        >
          <p className="poem-translation__intro">Letra</p>
          
          <div className="poem-translation__scroll-container" ref={lyricsContainerRef}>
            {synchronizedLyrics.map((lyric, idx) => {
              const isActive = idx === activeLyric;
              const isPast = idx < activeLyric;
              // Add a slight padding for empty lines to maintain rhythm
              const text = lyric.text || '\u00A0'; 
              
              return (
                <div
                  key={idx}
                  ref={el => lyricRefs.current[idx] = el}
                  className={`poem-translation__lyric-group`}
                  onClick={() => {
                    if (audioRef.current && audioRef.current.duration) {
                      audioRef.current.currentTime = lyric.time;
                      setReviewMode(false);
                      if (!isPlaying) audioRef.current.play().catch(() => setHasError(true));
                    }
                  }}
                >
                  <p className={`poem-translation__lyric ${isActive ? 'poem-translation__lyric--active' : ''} ${isPast ? 'poem-translation__lyric--past' : ''}`}>
                    {text}
                  </p>
                  {lyric.translation && (
                    <p className={`poem-translation__subtitle ${isActive ? 'poem-translation__subtitle--active' : ''} ${isPast ? 'poem-translation__subtitle--past' : ''}`}>
                      {lyric.translation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {poemAttribution && (
            <p className="poem-translation__attribution">
              {poemAttribution}
            </p>
          )}
        </div>

      </div>
    </section>
  );
});

export default AudioPoem;
