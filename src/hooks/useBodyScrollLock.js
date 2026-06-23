import { useEffect } from 'react';

let activeLocks = 0;
let originalBodyStyles = null;
let lockedScrollPosition = { x: 0, y: 0 };
let pendingRestoreFrame = null;

function restoreBodyScroll() {
  pendingRestoreFrame = null;
  if (activeLocks !== 0 || !originalBodyStyles) return;

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

export function acquireBodyScrollLock() {
  if (activeLocks === 0) {
    if (pendingRestoreFrame !== null) {
      window.cancelAnimationFrame(pendingRestoreFrame);
      pendingRestoreFrame = null;
    } else {
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
  }

  activeLocks += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    activeLocks = Math.max(0, activeLocks - 1);

    if (activeLocks === 0 && pendingRestoreFrame === null) {
      pendingRestoreFrame = window.requestAnimationFrame(restoreBodyScroll);
    }
  };
}

export function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    return acquireBodyScrollLock();
  }, [locked]);
}
