import { useState, useRef, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './MemoryCarousel.css';

import { monthlyMemories } from '../constants/content';

function MemoryPlaceholder({ title, index, dateOrLocation, isCover = false }) {
  return (
    <div className="memory-carousel__placeholder">
      <div className="memory-carousel__placeholder-inner">
        <span className="memory-carousel__placeholder-num">
          {isCover ? `Mes ${String(index + 1).padStart(2, '0')}` : 'Recuerdo'}
        </span>
        <span className="memory-carousel__placeholder-title">{title}</span>
        {dateOrLocation && (
          <span className="memory-carousel__placeholder-date">{dateOrLocation}</span>
        )}
      </div>
    </div>
  );
}

function GridImage({ src, alt, onClick }) {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) return null; // Oculta elegantemente si falla

  return (
    <img
      src={src}
      alt={alt}
      className="memory-carousel__grid-img"
      loading="lazy"
      onError={() => setHasError(true)}
      onClick={onClick}
    />
  );
}

export default function MemoryCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgErrors, setImgErrors] = useState({});
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [secretRevealed, setSecretRevealed] = useState(false);
  const [focusedPhoto, setFocusedPhoto] = useState(null);
  const audioRef = useRef(null);
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const playAudio = useCallback((src) => {
    if (!src || !audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.src = src;
    audioRef.current.volume = 0.6;
    audioRef.current.play().catch(() => {});
  }, []);

  const stopAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, []);

  const handleSlideChange = useCallback((swiper) => {
    const idx = swiper.realIndex;
    setActiveIdx(idx);
    stopAudio();
  }, [stopAudio]);

  useEffect(() => () => stopAudio(), [stopAudio]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (focusedPhoto) {
          setFocusedPhoto(null);
        } else {
          setSelectedMemory(null);
          setSecretRevealed(false);
        }
      }
    };
    if (selectedMemory !== null) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedMemory, focusedPhoto]);

  const handleMemoryClick = useCallback((idx) => {
    if (idx === activeIdx) {
      setSelectedMemory(idx);
      setSecretRevealed(false);
      setFocusedPhoto(null);
    }
  }, [activeIdx]);

  const memory = monthlyMemories[activeIdx];

  return (
    <section
      className={`memory-carousel ${isVisible ? 'memory-carousel--visible' : ''}`}
      ref={ref}
      id="recuerdos"
    >
      <audio ref={audioRef} preload="none" />

      <div className="memory-carousel__header">
        <span className="memory-carousel__label">Nuestro primer año</span>
        <div className="memory-carousel__divider" aria-hidden="true">
          <span className="memory-carousel__divider-line" />
          <span className="memory-carousel__divider-ornament">✦</span>
          <span className="memory-carousel__divider-line" />
        </div>
      </div>

      <Swiper
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 28,
          stretch: 0,
          depth: 180,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        onSlideChange={handleSlideChange}
        className="memory-carousel__swiper"
        loop={monthlyMemories.length > 2}
      >
        {monthlyMemories.map((mem, idx) => (
          <SwiperSlide key={idx} className="memory-carousel__slide">
            <div 
              className={`memory-carousel__card ${idx === activeIdx ? 'memory-carousel__card--interactive' : ''}`}
              onClick={() => handleMemoryClick(idx)}
              role={idx === activeIdx ? "button" : "presentation"}
              tabIndex={idx === activeIdx ? 0 : -1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleMemoryClick(idx);
                }
              }}
            >
              {imgErrors[idx] ? (
                <MemoryPlaceholder title={mem.title} index={idx} dateOrLocation={mem.range} isCover />
              ) : (
                <img
                  src={mem.cover}
                  alt={mem.title}
                  className="memory-carousel__img"
                  onError={() => setImgErrors(prev => ({ ...prev, [idx]: true }))}
                  loading="lazy"
                />
              )}
              <div className="memory-carousel__card-overlay" aria-hidden="true" />
              {idx === activeIdx && (
                <div className="memory-carousel__card-hint">
                  <span>Abrir mes</span>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="memory-carousel__info">
        <h3 className="memory-carousel__title">{memory.title}</h3>
        {memory.range && (
          <p className="memory-carousel__date">{memory.range}</p>
        )}
        <p className="memory-carousel__description">{memory.description}</p>
        <p className="memory-carousel__dots-count" aria-label={`Mes ${activeIdx + 1} de ${monthlyMemories.length}`}>
          {activeIdx + 1} / {monthlyMemories.length}
        </p>
      </div>

      {/* Modal Overlay para Recuerdos */}
      {selectedMemory !== null && (
        <div className="memory-carousel__modal" onClick={() => setSelectedMemory(null)}>
          <div className="memory-carousel__modal-content" onClick={e => e.stopPropagation()}>
            <button 
              className="memory-carousel__modal-close"
              onClick={() => setSelectedMemory(null)}
              aria-label="Cerrar recuerdo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            
            <div className="memory-carousel__modal-img-container">
              {imgErrors[selectedMemory] ? (
                <MemoryPlaceholder 
                  title={monthlyMemories[selectedMemory].title} 
                  index={selectedMemory} 
                  dateOrLocation={monthlyMemories[selectedMemory].range} 
                  isCover
                />
              ) : (
                <img 
                  src={monthlyMemories[selectedMemory].cover} 
                  alt={monthlyMemories[selectedMemory].title} 
                  className="memory-carousel__modal-img memory-carousel__modal-img--cover" 
                />
              )}
            </div>

            <div className="memory-carousel__modal-text">
              <h4 className="memory-carousel__modal-title">{monthlyMemories[selectedMemory].title}</h4>
              {monthlyMemories[selectedMemory].range && (
                <p className="memory-carousel__modal-date">{monthlyMemories[selectedMemory].range}</p>
              )}
              <p className="memory-carousel__modal-desc">{monthlyMemories[selectedMemory].description}</p>
              
              <div className="memory-carousel__grid">
                <p className="memory-carousel__grid-title">Pequeños pedazos de este mes</p>
                <div className="memory-carousel__grid-container">
                  {monthlyMemories[selectedMemory].photos.map((photo, i) => (
                    <GridImage 
                      key={i} 
                      src={photo.replace(/\/([^/]+\.jpg)$/, '/thumb/$1')} 
                      alt={`Momento ${i + 1}`} 
                      onClick={() => setFocusedPhoto(photo)} 
                    />
                  ))}
                </div>
              </div>

              {monthlyMemories[selectedMemory].secret && (
                <div className="memory-carousel__modal-secret-box">
                  {!secretRevealed ? (
                    <button 
                      className="memory-carousel__modal-reveal-btn"
                      onClick={() => setSecretRevealed(true)}
                    >
                      Revelar detalle
                    </button>
                  ) : (
                    <p className="memory-carousel__modal-secret">
                      {monthlyMemories[selectedMemory].secret}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Focused Photo Overlay */}
      {focusedPhoto && (
        <div className="memory-carousel__focused" onClick={() => setFocusedPhoto(null)}>
          <div className="memory-carousel__focused-content" onClick={e => e.stopPropagation()}>
            <img src={focusedPhoto} alt="Enfocado" className="memory-carousel__focused-img" />
            <button className="memory-carousel__focused-btn" onClick={() => setFocusedPhoto(null)}>
              Volver al mes
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
