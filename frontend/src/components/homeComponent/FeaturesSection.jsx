import React, { useState } from 'react';
import './FeaturesSection.css';

import line1 from '../../assets/images_pourquoi_SinovaAI/Ligne1.png';
import line2 from '../../assets/images_pourquoi_SinovaAI/Ligne2.png';
import line3 from '../../assets/images_pourquoi_SinovaAI/Ligne3.png';
import line4 from '../../assets/images_pourquoi_SinovaAI/Ligne4.png';

const ROWS = [
  {
    id: 1,
    title: "Apprentissage personnalisé par l'IA",
    description:
      "Définissez votre niveau, vos objectifs et votre disponibilité. Sinova AI construit automatiquement un parcours d'apprentissage adapté à votre profil.",
    image: line1, 
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="8" r="4" stroke="white" strokeWidth="1.8" />
        <path d="M4 19c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M16 5l1.5 1.5L20 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Toutes vos ressources au même endroit',
    description:
      "Accédez en quelques secondes aux meilleures vidéos, documentations officielles et ressources d'apprentissage sélectionnées et organisées intelligemment.",
    image: line2,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="4" width="12" height="15" rx="2" stroke="white" strokeWidth="1.8" />
        <path d="M6 8h4M6 11h4M6 14h2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 7h4a2 2 0 012 2v9a2 2 0 01-2 2h-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Un assistant IA qui vous accompagne',
    description:
      'Posez vos questions, demandez des explications simplifiées, obtenez des résumés ou des quiz personnalisés après chaque ressource consultée.',
    image: line3,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="3" width="14" height="11" rx="3" stroke="white" strokeWidth="1.8" />
        <path d="M6 14v3l3-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17" cy="15" r="3.5" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.8" />
        <path d="M16 15l.8.8 1.7-1.7" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Progressez étape par étape',
    description:
      'Suivez une feuille de route claire, débloquez chaque compétence progressivement et apprenez sans vous sentir perdu ou dépassé.',
    image: line4,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 17L8 11l4 4 4-6 3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="3" cy="17" r="1.5" fill="white" />
        <circle cx="8" cy="11" r="1.5" fill="white" />
        <circle cx="12" cy="15" r="1.5" fill="white" />
        <circle cx="16" cy="9" r="1.5" fill="white" />
        <circle cx="19" cy="12" r="1.5" fill="white" />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="features-section">
      <div className="features-header">
        <div className="features-badge">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="5" fill="#EE634E" opacity="0.3" />
            <circle cx="5" cy="5" r="2.5" fill="#EE634E" />
          </svg>
          <span>Fonctionnalités</span>
        </div>

        <h2 className="features-title">
          Pourquoi choisir <span className="accent">Sinova AI</span> ?
        </h2>

        <p className="features-subtitle">
          Apprenez les langages informatiques plus efficacement grâce à une expérience guidée par
          l'intelligence artificielle.
        </p>
      </div>

      <div className="features-rows">
        {ROWS.map((row, i) => {
          const isActive = hovered === i;

          return (
            <div
              key={row.id}
              className={`features-row ${isActive ? 'active' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="features-row-title">
                <div className="features-row-icon">{row.icon}</div>
                {row.title}
              </div>

              <p className="features-row-desc">{row.description}</p>

              <div className="features-row-arrow">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9h10M10 5l4 4-4 4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {isActive && (
                <div className="features-row-float-img">
                  <img src={row.image} alt="image" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}