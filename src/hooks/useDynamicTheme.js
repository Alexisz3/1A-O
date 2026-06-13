import { useEffect, useRef } from 'react';

/**
 * Extrae el color dominante de una imagen y aplica variables CSS dinámicas
 * a :root para que toda la app adapte su paleta automáticamente.
 */
export function useDynamicTheme(imageUrl) {
  const canvasRef = useRef(document.createElement('canvas'));

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);

      const data = ctx.getImageData(0, 0, 100, 100).data;
      let r = 0, g = 0, b = 0, count = 0;

      // Sample pixels evenly for average color
      for (let i = 0; i < data.length; i += 16) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      // Determine if image is dark or light
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      const isDark = luminance < 128;

      // Create a slightly lighter/darker accent color
      const accentR = isDark ? Math.min(255, r + 60) : Math.max(0, r - 40);
      const accentG = isDark ? Math.min(255, g + 60) : Math.max(0, g - 40);
      const accentB = isDark ? Math.min(255, b + 80) : Math.max(0, b - 40);

      const root = document.documentElement;
      root.style.setProperty('--dynamic-bg-r', r);
      root.style.setProperty('--dynamic-bg-g', g);
      root.style.setProperty('--dynamic-bg-b', b);
      root.style.setProperty('--dynamic-accent', `rgb(${accentR},${accentG},${accentB})`);
      root.style.setProperty('--dynamic-text', isDark ? '#f5ede0' : '#1a1a2e');
      root.style.setProperty('--dynamic-overlay', isDark
        ? `rgba(${Math.max(0, r - 40)},${Math.max(0, g - 40)},${Math.max(0, b - 40)},0.65)`
        : `rgba(${Math.min(255, r + 30)},${Math.min(255, g + 30)},${Math.min(255, b + 30)},0.6)`
      );
      root.style.setProperty('--dynamic-gold', isDark
        ? `rgba(${accentR + 20},${accentG + 20},${accentB - 20},0.9)`
        : `rgba(${Math.max(0, accentR - 20)},${Math.max(0, accentG - 20)},${Math.max(0, accentB + 20)},0.9)`
      );
      root.style.setProperty('--is-dark', isDark ? '1' : '0');
    };
  }, [imageUrl]);
}
