import { useEffect, useRef } from 'react';

const LISTENER_OPTIONS = { passive: false, capture: true };
const DOUBLE_TAP_WINDOW_MS = 350;

export function useIOSZoomGuard(enabled = true) {
  const targetRef = useRef(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!enabled || !target) return undefined;

    let lastSingleTouchEnd = 0;
    const preventZoomGesture = (event) => event.preventDefault();
    const preventMultiTouch = (event) => {
      if (event.touches?.length > 1) event.preventDefault();
    };
    const preventDoubleTap = (event) => {
      if (event.changedTouches?.length !== 1) return;
      const now = Date.now();
      if (lastSingleTouchEnd && now - lastSingleTouchEnd < DOUBLE_TAP_WINDOW_MS) {
        event.preventDefault();
      }
      lastSingleTouchEnd = now;
    };

    target.addEventListener('gesturestart', preventZoomGesture, LISTENER_OPTIONS);
    target.addEventListener('gesturechange', preventZoomGesture, LISTENER_OPTIONS);
    target.addEventListener('gestureend', preventZoomGesture, LISTENER_OPTIONS);
    target.addEventListener('touchmove', preventMultiTouch, LISTENER_OPTIONS);
    target.addEventListener('touchend', preventDoubleTap, LISTENER_OPTIONS);
    target.addEventListener('dblclick', preventZoomGesture, LISTENER_OPTIONS);

    return () => {
      target.removeEventListener('gesturestart', preventZoomGesture, LISTENER_OPTIONS);
      target.removeEventListener('gesturechange', preventZoomGesture, LISTENER_OPTIONS);
      target.removeEventListener('gestureend', preventZoomGesture, LISTENER_OPTIONS);
      target.removeEventListener('touchmove', preventMultiTouch, LISTENER_OPTIONS);
      target.removeEventListener('touchend', preventDoubleTap, LISTENER_OPTIONS);
      target.removeEventListener('dblclick', preventZoomGesture, LISTENER_OPTIONS);
    };
  }, [enabled]);

  return targetRef;
}
