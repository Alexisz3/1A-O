import { useEffect } from 'react';

let activeLocks = 0;
let originalBodyStyles = null;
let lockedScrollPosition = { x: 0, y: 0 };

export function acquireBodyScrollLock() {
  if (activeLocks === 0) {
    const { style } = document.body;
    originalBodyStyles = {
      overflow: style.overflow,
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
    };
    lockedScrollPosition = { x: window.scrollX, y: window.scrollY };

    style.overflow = 'hidden';
    style.position = 'fixed';
    style.top = `-${lockedScrollPosition.y}px`;
    style.left = '0';
    style.right = '0';
    style.width = '100%';
  }

  activeLocks += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    activeLocks = Math.max(0, activeLocks - 1);

    if (activeLocks === 0) {
      const { style } = document.body;
      const scrollPosition = lockedScrollPosition;
      Object.assign(style, originalBodyStyles);
      originalBodyStyles = null;
      lockedScrollPosition = { x: 0, y: 0 };

      try {
        window.scrollTo(scrollPosition.x, scrollPosition.y);
      } catch {
        // Restoring body styles is still enough in non-visual environments.
      }
    }
  };
}

export function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    return acquireBodyScrollLock();
  }, [locked]);
}
