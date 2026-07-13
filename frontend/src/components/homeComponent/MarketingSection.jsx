import React, { useEffect, useRef, useState } from 'react';
import './MarketingSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import imgMarketing from '../../assets/hero-illustration.png';

import {
  faBrain,
  faBullseye,
  faComments,
  faBook,
  faBolt,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

const BADGES = [
  {
    label: 'IA & Machine Learning',
    icon: <FontAwesomeIcon icon={faBrain} />
  },
  {
    label: 'Parcours personnalisé',
    icon: <FontAwesomeIcon icon={faBullseye} />
  },
  {
    label: 'Assistant IA',
    icon: <FontAwesomeIcon icon={faComments} />
  },
  {
    label: 'Ressources intelligentes',
    icon: <FontAwesomeIcon icon={faBook} />
  },
  {
    label: 'Quiz automatiques',
    icon: <FontAwesomeIcon icon={faBolt} />
  },
  {
    label: 'Progression guidée',
    icon: <FontAwesomeIcon icon={faChartLine} />
  }
];

const IconLibrary = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="6" width="18" height="22" rx="3" stroke="#EE634E" strokeWidth="2.2" />
    <path d="M8 12h10M8 16h10M8 20h6" stroke="#35E4FD" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 4v6l3-2 3 2V4" stroke="#EE634E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconSatisfaction = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="12" stroke="#EE634E" strokeWidth="2.2" />
    <path d="M11 19s1.5 3 5 3 5-3 5-3" stroke="#35E4FD" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="14" r="1.5" fill="#EE634E" />
    <circle cx="20" cy="14" r="1.5" fill="#EE634E" />
  </svg>
);

const IconCode = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="3" y="6" width="26" height="20" rx="4" stroke="#EE634E" strokeWidth="2.2" />
    <path d="M3 11h26" stroke="#EE634E" strokeWidth="2" />
    <circle cx="7.5" cy="8.5" r="1" fill="#EE634E" />
    <circle cx="11" cy="8.5" r="1" fill="#EE634E" />
    <path d="M11 17L8 20l3 3" stroke="#35E4FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 17l3 3-3 3" stroke="#35E4FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 16l-3 8" stroke="#35E4FD" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconStar = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path
      d="M16 4l3.09 6.26L26 11.27l-5 4.87 1.18 6.86L16 19.77l-6.18 3.23L11 16.14 6 11.27l6.91-1.01L16 4z"
      stroke="#EE634E"
      strokeWidth="2.2"
      strokeLinejoin="round"
      fill="rgba(238,99,78,0.12)"
    />
    <circle cx="24" cy="24" r="5" fill="#35E4FD" opacity="0.85" />
    <path d="M22.5 24l1 1 2.5-2.5" stroke="rgb(40,41,62)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const STAT_CARDS = [
  { id: 'resources', end: 10000, suffix: '+', label: 'Ressources disponibles', Icon: IconLibrary, decimals: 0 },
  { id: 'satisfaction', end: 95, suffix: '%', label: 'Apprenants satisfaits', Icon: IconSatisfaction, decimals: 0 },
  { id: 'languages', end: 50, suffix: '+', label: 'Langages & technologies', Icon: IconCode, decimals: 0 },
  { id: 'rating', end: 4.9, suffix: '/5', label: 'Note moyenne des utilisateurs', Icon: IconStar, decimals: 1 },
];

function useCounter(end, decimals, active) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    const steps = 60;
    const interval = 1800 / steps;
    const increment = end / steps;
    let current = 0;
    let count = 0;

    const timer = setInterval(() => {
      count++;
      current = Math.min(current + increment, end);
      setValue(parseFloat(current.toFixed(decimals)));
      if (count >= steps) {
        clearInterval(timer);
        setValue(end);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [active, end, decimals]);

  return value;
}

function StatCard({ end, suffix, label, Icon, decimals, active }) {
  const count = useCounter(end, decimals, active);

  return (
    <div className="marketing-stat-card">
      <div className="marketing-stat-glow" />
      <div className="marketing-stat-icon">
        <Icon />
      </div>
      <div className="marketing-stat-value">
        {decimals === 1 ? count.toFixed(1) : Math.round(count).toLocaleString('fr-FR')}
        <span className="marketing-stat-suffix">{suffix}</span>
      </div>
      <div className="marketing-stat-label">{label}</div>
    </div>
  );
}

export default function MarketingSection() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(false);
          setTimeout(() => setActive(true), 50);
        } else {
          setActive(false);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="marketing-section">
      <div className="marketing-badges">
        {BADGES.map((b, i) => (
          <div key={b.label} className={`marketing-badge ${i % 2 === 0 ? 'orange' : 'cyan'}`}>
            <span className="marketing-badge-icon">{b.icon}</span>
            <span>{b.label}</span>
          </div>
        ))}
      </div>

      <div className="marketing-body">
        <div className="marketing-image-card">
          <img src={imgMarketing} alt="Sinova AI" className="marketing-image-card-img" />
        </div>

        <div className="marketing-stats-grid">
          {STAT_CARDS.map((card) => (
            <StatCard
              key={card.id}
              end={card.end}
              suffix={card.suffix}
              label={card.label}
              Icon={card.Icon}
              decimals={card.decimals}
              active={active}
            />
          ))}
        </div>
      </div>
    </section>
  );
}