import React from 'react';
import './Footer.css';

const TAGLINE_WORDS = [
  'Apprentissage intelligent',
  'Progression guidée',
  'Maîtrise des langages informatiques',
  'Accompagnement IA',
  'Ressources intelligentes',
  'Parcours personnalisé',
];

const NAV_LINKS = [
  {
    title: 'Plateforme',
    links: ['Accueil', 'Fonctionnalités', 'Parcours', 'Ressources', 'Tarifs'],
  },
  {
    title: 'Apprendre',
    links: ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'DevOps'],
  },
  {
    title: 'Entreprise',
    links: ['À propos', 'Blog', 'Carrières', 'Presse', 'Partenaires'],
  },
  {
    title: 'Support',
    links: ['Centre d\'aide', 'Documentation', 'Contact', 'Politique de conf.', 'CGU'],
  },
];

const SOCIAL_ICONS = [
  {
    name: 'Twitter',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M16 2.5s-1.5 1-2.5 1.2C12.8 2.7 11.8 2 10.5 2 8.6 2 7 3.6 7 5.5c0 .3 0 .6.1.8C4.5 6.2 2.5 5 1 3.3c-.3.6-.5 1.3-.5 2 0 1.4.7 2.6 1.8 3.3-.7 0-1.3-.2-1.8-.5v.1c0 1.9 1.3 3.4 3.1 3.8-.3.1-.7.1-1 .1-.3 0-.5 0-.7-.1.5 1.5 1.9 2.6 3.6 2.6C4 15.6 2.6 16 1 16c-.3 0-.7 0-1-.1 1.7 1.1 3.7 1.7 5.8 1.7 7 0 10.8-5.8 10.8-10.8v-.5C17.3 5.8 17.8 4.7 16 2.5z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M15 1H3C1.9 1 1 1.9 1 3v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM6 14H4V7h2v7zm-1-8C4.3 6 3.7 5.4 3.7 4.7S4.3 3.3 5 3.3s1.3.6 1.3 1.3S5.7 6 5 6zm9 8h-2v-3.5c0-.8-.7-1.5-1.5-1.5S9 9.7 9 10.5V14H7V7h2v1c.5-.8 1.5-1 2-1 1.7 0 3 1.3 3 3v4z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 1C4.6 1 1 4.6 1 9c0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1.1-2.7-1.1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.2-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.2 0 3.1-1.9 3.8-3.7 4 .3.3.6.8.6 1.6v2.3c0 .2.1.5.5.4C15.7 15.5 18 12.5 18 9c0-4.4-3.6-8-9-8z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M17.5 5s-.2-1.5-.9-2.1c-.8-.9-1.7-.9-2.2-.9C12 1.8 9 1.8 9 1.8s-3 0-5.4.2c-.5.1-1.4.1-2.2.9C.7 3.5.5 5 .5 5S.3 6.7.3 8.5v1.7c0 1.7.2 3.4.2 3.4s.2 1.5.9 2.1c.8.9 1.9.8 2.4.9C5.5 16.8 9 16.8 9 16.8s3 0 5.4-.3c.5-.1 1.4-.1 2.2-.9.7-.6.9-2.1.9-2.1s.2-1.7.2-3.5v-1.6C17.7 6.7 17.5 5 17.5 5zM7.3 11.5V6.3l5.9 2.6-5.9 2.6z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="sinova-footer">
      {/* Bandeau défilant (marquee infini) */}
      <div className="sinova-footer-tagline">
        <div className="sinova-footer-tagline-track">
          {[...TAGLINE_WORDS, ...TAGLINE_WORDS, ...TAGLINE_WORDS].map((word, i) => (
            <div className="sinova-footer-tagline-item" key={i}>
              <span className={i % 2 === 0 ? 'white' : 'accent'}>{word}</span>
              <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                <circle cx="3" cy="3" r="3" fill="rgb(53,228,253)" opacity="0.6" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Corps principal */}
      <div className="sinova-footer-body">
        {/* Colonne marque */}
        <div className="sinova-footer-brand">
          <div className="sinova-footer-logo">
            <span className="sinova-footer-logo-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 5L2 10L6 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 5L18 10L14 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 3L8 17" stroke="rgb(53,228,253)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <span className="sinova-footer-logo-text">
              Sinova<span>AI</span>
            </span>
          </div>

          <p className="sinova-footer-desc">
            La plateforme d'apprentissage des langages informatiques guidée par
            l'intelligence artificielle. Progressez à votre rythme, avec les
            meilleures ressources.
          </p>

          <div className="sinova-footer-socials">
            {SOCIAL_ICONS.map((s) => (
              <a href="#" key={s.name} aria-label={s.name} className="sinova-footer-social-btn">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Colonnes de liens */}
        {NAV_LINKS.map((col) => (
          <div className="sinova-footer-col" key={col.title}>
            <h4>{col.title}</h4>
            <div className="sinova-footer-col-links">
              {col.links.map((link) => (
                <a href="#" key={link}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ligne de bas de page */}
      <div className="sinova-footer-bottom">
        <span className="sinova-footer-copyright">
          © 2026 <strong>SinovaAI</strong> — Tous droits réservés.
        </span>

        <div className="sinova-footer-legal-links">
          {['Politique de confidentialité', 'Conditions d\'utilisation', 'Cookies'].map((item) => (
            <a href="#" key={item}>
              {item}
            </a>
          ))}
        </div>

        <div className="sinova-footer-ai-badge">
          <span className="dot" />
          <span>
            Propulsé par <strong>IA</strong>
          </span>
        </div>
      </div>
    </footer>
  );
}