import { useEffect, useState } from 'react';
import { config, topThingsILove } from '../constants/content';
import './Timeline.css';

export default function Timeline() {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const calculateDays = () => {
      const past = new Date(config.anniversaryDate);
      const today = new Date();
      const diffTime = Math.abs(today - past);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDays(diffDays);
    };
    calculateDays();
  }, []);

  return (
    <section className="timeline">
      <div className="timeline__counter">
        <h2 className="timeline__counter-num">{days}</h2>
        <p className="timeline__counter-text">Días eligiéndonos</p>
      </div>

      <div className="timeline__things">
        <h3 className="timeline__things-title">5 cosas tuyas que se quedaron conmigo</h3>
        <ul className="timeline__list">
          {topThingsILove.map((thing, index) => (
            <li key={index} className="timeline__item">
              <span className="timeline__item-num">0{index + 1}</span>
              <p className="timeline__item-text">{thing}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
