import React from 'react';
import './HowItWorks.css';

const ICONS = {
  search: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="15" cy="15" r="9" stroke="#EE634E" strokeWidth="2.5" />
      <path d="M22 22L30 30" stroke="#EE634E" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 15H18" stroke="#35E4FD" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 12V18" stroke="#35E4FD" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  recommend: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="13" r="6" stroke="#EE634E" strokeWidth="2.5" />
      <path d="M8 30c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#EE634E" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 7l2.5 2.5L31 5" stroke="#35E4FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ai: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="4" y="9" width="20" height="14" rx="4" stroke="#EE634E" strokeWidth="2.5" />
      <path d="M10 32h10M14 23v9" stroke="#EE634E" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="28" cy="10" r="5" fill="#35E4FD" opacity="0.9" />
      <path d="M26 10l1.5 1.5L30.5 8" stroke="rgb(40,41,62)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 16h5M9 19h8" stroke="#35E4FD" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  progress: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M4 28L11 19l6 5 6-8 5 4" stroke="#EE634E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="4" cy="28" r="2.5" fill="#35E4FD" />
      <circle cx="11" cy="19" r="2.5" fill="#35E4FD" />
      <circle cx="17" cy="24" r="2.5" fill="#35E4FD" />
      <circle cx="23" cy="16" r="2.5" fill="#35E4FD" />
      <circle cx="28" cy="20" r="2.5" fill="#35E4FD" />
      <path d="M28 4v8M24 8h8" stroke="#EE634E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

const CARDS = [
  {
    icon: 'search',
    title: 'Recherche intelligente',
    description:
      "Recherchez n'importe quel langage ou technologie et accédez aux meilleures ressources disponibles.",
  },
  {
    icon: 'recommend',
    title: 'Recommandations personnalisées',
    description:
      'Recevez des contenus adaptés à votre niveau, vos objectifs et votre style d\'apprentissage.',
  },
  {
    icon: 'ai',
    title: 'Apprentissage avec IA',
    description:
      'Posez des questions, obtenez des explications simples et générez des quiz automatiquement.',
  },
  {
    icon: 'progress',
    title: 'Progression guidée',
    description:
      'Suivez des parcours structurés pour progresser étape par étape sans vous perdre.',
  },
];

function FeatureCard({ icon, title, description }) {
  return (
    <div className="how-card">
      <div className="how-card-icon">{ICONS[icon]}</div>
      <h3 className="how-card-title">{title}</h3>
      <p className="how-card-desc">{description}</p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="how-header">
        <div className="how-badge">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="5" fill="#35E4FD" opacity="0.3" />
            <circle cx="5" cy="5" r="2.5" fill="#35E4FD" />
          </svg>
          <span>Processus</span>
        </div>

        <h2 className="how-section-title">Comment ça marche ?</h2>
      </div>

      <div className="how-cards-grid">
        {CARDS.map((card) => (
          <FeatureCard key={card.title} icon={card.icon} title={card.title} description={card.description} />
        ))}
      </div>
    </section>
  );
}