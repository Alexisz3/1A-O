import { useState, useEffect } from 'react';
import './SplashScreen.css';

export default function SplashScreen({ onComplete }) {
  const [stage, setStage] = useState('hidden'); // hidden -> text-visible -> fading-out

  useEffect(() => {
    // 1. Fade in text
    const t1 = setTimeout(() => {
      setStage('text-visible');
    }, 300);

    // 2. Keep text visible, then fade it out
    const t2 = setTimeout(() => {
      setStage('fading-out');
    }, 2800);

    // 3. Unmount completely
    const t3 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${stage === 'fading-out' ? 'splash-screen--fading-out' : ''}`}>
      <div className={`splash-screen__content ${stage === 'text-visible' ? 'splash-screen__content--visible' : ''}`}>
        <p className="splash-screen__text">Un recuerdo para la eternidad</p>
      </div>
    </div>
  );
}
