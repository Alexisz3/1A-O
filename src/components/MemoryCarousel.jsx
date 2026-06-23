import { useState, useEffect, useCallback, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
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
    <button className="memory-carousel__grid-button" onClick={onClick} aria-label={`Abrir ${alt}`}>
      <img
        src={src}
        alt={alt}
        className="memory-carousel__grid-img"
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
      />
    </button>
  );
}

function FocusedPhoto({ src, onClose }) {
  const [status, setStatus] = useState('loading');

  return (
    <div className="memory-carousel__focused-content" onClick={e => e.stopPropagation()}>
      {status === 'loading' && (
        <p className="memory-carousel__focused-status" role="status">Cargando recuerdo…</p>
      )}
      {status === 'error' ? (
        <p className="memory-carousel__focused-status" role="alert">
          Esta foto no pudo cargarse. El recuerdo sigue aquí.
        </p>
      ) : (
        <img
          src={src}
          alt="Recuerdo ampliado"
          className="memory-carousel__focused-img"
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
      <button className="memory-carousel__focused-btn" onClick={onClose}>
        Volver al mes
      </button>
    </div>
  );
}

export default function MemoryCarousel({ memories = monthlyMemories }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgErrors, setImgErrors] = useState({});
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [secretRevealed, setSecretRevealed] = useState(false);
  const [focusedPhoto, setFocusedPhoto] = useState(null);
  const focusedOverlayRef = useRef(null);
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const handleSlideChange = useCallback((swiper) => {
    setActiveIdx(swiper.realIndex);
  }, []);

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

  useBodyScrollLock(selectedMemory !== null || focusedPhoto !== null);

  useEffect(() => {
    if (selectedMemory === null) return undefined;
    document.body.classList.add('memory-overlay-open');
    return () => document.body.classList.remove('memory-overlay-open');
  }, [selectedMemory]);

  useEffect(() => {
    if (!focusedPhoto) return undefined;
    document.body.classList.add('photo-overlay-open');
    return () => document.body.classList.remove('photo-overlay-open');
  }, [focusedPhoto]);

  useEffect(() => {
    const viewer = focusedOverlayRef.current;
    if (!focusedPhoto || !viewer) return undefined;

    const listenerOptions = { passive: false, capture: true };
    let lastSingleTouchEnd = 0;

    const preventZoomGesture = (event) => event.preventDefault();
    const preventMultiTouch = (event) => {
      if (event.touches?.length > 1) event.preventDefault();
    };
    const preventDoubleTap = (event) => {
      if (event.changedTouches?.length !== 1) return;
      const now = Date.now();
      if (lastSingleTouchEnd && now - lastSingleTouchEnd < 350) {
        event.preventDefault();
      }
      lastSingleTouchEnd = now;
    };

    viewer.addEventListener('gesturestart', preventZoomGesture, listenerOptions);
    viewer.addEventListener('gesturechange', preventZoomGesture, listenerOptions);
    viewer.addEventListener('gestureend', preventZoomGesture, listenerOptions);
    viewer.addEventListener('touchmove', preventMultiTouch, listenerOptions);
    viewer.addEventListener('touchend', preventDoubleTap, listenerOptions);
    viewer.addEventListener('dblclick', preventZoomGesture, listenerOptions);

    return () => {
      viewer.removeEventListener('gesturestart', preventZoomGesture, listenerOptions);
      viewer.removeEventListener('gesturechange', preventZoomGesture, listenerOptions);
      viewer.removeEventListener('gestureend', preventZoomGesture, listenerOptions);
      viewer.removeEventListener('touchmove', preventMultiTouch, listenerOptions);
      viewer.removeEventListener('touchend', preventDoubleTap, listenerOptions);
      viewer.removeEventListener('dblclick', preventZoomGesture, listenerOptions);
    };
  }, [focusedPhoto]);

  const handleMemoryClick = useCallback((idx) => {
    if (idx === activeIdx) {
      setSelectedMemory(idx);
      setSecretRevealed(false);
      setFocusedPhoto(null);
    }
  }, [activeIdx]);

  const memory = memories[activeIdx];

  if (!memory) {
    return (
      <section className="memory-carousel memory-carousel--visible" id="recuerdos">
        <div className="memory-carousel__info">
          <p className="memory-carousel__description">Aún no hay recuerdos para mostrar.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`memory-carousel ${isVisible ? 'memory-carousel--visible' : ''}`}
      ref={ref}
      id="recuerdos"
    >
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
        loop={memories.length > 2}
      >
        {memories.map((mem, idx) => (
          <SwiperSlide key={idx} className="memory-carousel__slide">
            <div 
              className={`memory-carousel__card ${idx === activeIdx ? 'memory-carousel__card--interactive' : ''}`}
              onClick={() => handleMemoryClick(idx)}
              role={idx === activeIdx ? "button" : "presentation"}
              aria-label={idx === activeIdx ? `Abrir ${mem.title}` : undefined}
              tabIndex={idx === activeIdx ? 0 : -1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleMemoryClick(idx);
                }
              }}
            >
              {imgErrors[idx] || !mem.cover ? (
                <MemoryPlaceholder title={mem.title} index={idx} dateOrLocation={mem.range} isCover />
              ) : (
                <img
                  src={mem.cover}
                  alt={mem.title}
                  className="memory-carousel__img"
                  onError={() => setImgErrors(prev => ({ ...prev, [idx]: true }))}
                  loading={idx === activeIdx ? 'eager' : 'lazy'}
                  fetchPriority={idx === activeIdx ? 'high' : 'auto'}
                  decoding="async"
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
        <p className="memory-carousel__dots-count" aria-label={`Mes ${activeIdx + 1} de ${memories.length}`}>
          {activeIdx + 1} / {memories.length}
        </p>
      </div>

      {/* Modal Overlay para Recuerdos */}
      {selectedMemory !== null && (
        <div
          className="memory-carousel__modal"
          role="dialog"
          aria-modal="true"
          aria-label={`Recuerdo: ${memories[selectedMemory].title}`}
          onClick={() => setSelectedMemory(null)}
        >
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
              {imgErrors[selectedMemory] || !memories[selectedMemory].cover ? (
                <MemoryPlaceholder 
                  title={memories[selectedMemory].title}
                  index={selectedMemory} 
                  dateOrLocation={memories[selectedMemory].range}
                  isCover
                />
              ) : (
                <img 
                  src={memories[selectedMemory].cover}
                  alt={memories[selectedMemory].title}
                  className="memory-carousel__modal-img memory-carousel__modal-img--cover"
                  decoding="async"
                />
              )}
            </div>

            <div className="memory-carousel__modal-text">
              <h4 className="memory-carousel__modal-title">{memories[selectedMemory].title}</h4>
              {memories[selectedMemory].range && (
                <p className="memory-carousel__modal-date">{memories[selectedMemory].range}</p>
              )}
              <p className="memory-carousel__modal-desc">{memories[selectedMemory].description}</p>
              
              <div className="memory-carousel__grid">
                <p className="memory-carousel__grid-title">Pequeños pedazos de este mes</p>
                <div className="memory-carousel__grid-container">
                  {(Array.isArray(memories[selectedMemory].photos) ? memories[selectedMemory].photos : [])
                    .filter(photo => typeof photo === 'string' && photo.length > 0)
                    .map((photo, i) => (
                    <GridImage 
                      key={i} 
                      src={photo.replace(/\/([^/]+\.jpg)$/, '/thumb/$1')} 
                      alt={`Momento ${i + 1}`} 
                      onClick={() => setFocusedPhoto(photo)} 
                    />
                    ))}
                </div>
              </div>

              {memories[selectedMemory].secret && (
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
                      {memories[selectedMemory].secret}
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
        <div
          ref={focusedOverlayRef}
          className="memory-carousel__focused"
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
          onClick={() => setFocusedPhoto(null)}
        >
          <FocusedPhoto src={focusedPhoto} onClose={() => setFocusedPhoto(null)} />
        </div>
      )}
    </section>
  );
}
