import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';
import python from '../../assets/images-logo-des-langages-informatiques/python.png';
import javascript from '../../assets/images-logo-des-langages-informatiques/js.png';
import typescript from '../../assets/images-logo-des-langages-informatiques/typescript.png';
import react from '../../assets/images-logo-des-langages-informatiques/react.png';
import nodejs from '../../assets/images-logo-des-langages-informatiques/node-js.png';
import django from '../../assets/images-logo-des-langages-informatiques/django.png';
import docker from '../../assets/images-logo-des-langages-informatiques/docker.png';
import postgresql from '../../assets/images-logo-des-langages-informatiques/postgresql.png';
import mongodb from '../../assets/images-logo-des-langages-informatiques/mongodb.png';
import java from '../../assets/images-logo-des-langages-informatiques/java.png';
import html from '../../assets/images-logo-des-langages-informatiques/html-5.png';
import css from '../../assets/images-logo-des-langages-informatiques/css-3.png';
import brain from '../../assets/image-titre/brain.png';

const TECH_LOGOS = [
  { name: 'Python', logo: python },
  { name: 'JavaScript', logo: javascript },
  { name: 'TypeScript', logo:  typescript },
  { name: 'React', logo: react },
  { name: 'Node.js', logo: nodejs },
  { name: 'Django', logo: django },
  { name: 'Docker', logo: docker },
  { name: 'PostgreSQL', logo: postgresql },
  { name: 'MongoDB', logo: mongodb },
  { name: 'HTML', logo: html },
  { name: 'CSS', logo: css},
  { name: 'Java', logo: java },
];

function TechLogoItem({ name, logo }) {
  return (
    <div className="sinova-tech-item">
      {logo ? (
        <img src={logo} alt={name} className="sinova-tech-logo-img" />
      ) : (
        <div className="sinova-tech-logo-placeholder">
          <span>{name.slice(0, 2).toUpperCase()}</span>
        </div>
      )}
      <span className="sinova-tech-name">{name}</span>
    </div>
  );
}

function TechTicker({ items = TECH_LOGOS }) {
  const loopItems = [...items, ...items, ...items];

  return (
    <div className="sinova-tech-ticker">
      <div className="sinova-tech-ticker-track">
        {loopItems.map((item, i) => (
          <TechLogoItem key={`${item.name}-${i}`} name={item.name} logo={item.logo} />
        ))}
      </div>
      <div className="sinova-tech-fade sinova-tech-fade-left" />
      <div className="sinova-tech-fade sinova-tech-fade-right" />
    </div>
  );
}

/* 
   POP-UP "VOIR DÉMO"
*/
function DemoVideoModal({ onClose }) {
  // Fermeture avec la touche Échap + on bloque le scroll de la page
  // pendant que la pop-up est ouverte.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="sinova-demo-modal-overlay" onClick={onClose}>
      <div
        className="sinova-demo-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Vidéo de démonstration SinovaAI"
      >
        <button
          type="button"
          className="sinova-demo-modal-close"
          onClick={onClose}
          aria-label="Fermer la vidéo"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="sinova-demo-modal-video-wrapper">
          {/*
            ✅ Format "embed" obligatoire pour qu'une vidéo YouTube puisse
            s'afficher dans une iframe sur un autre site. Le lien classique
            "/watch?v=..." est bloqué par YouTube (X-Frame-Options) et
            provoque exactement l'erreur "Firefox ne peut pas ouvrir cette
            page" que tu observais.

            Pour extraire l'URL embed à partir d'un lien classique :
            https://www.youtube.com/watch?v=ID_VIDEO&t=73s
                                          ^^^^^^^^^      ^^
            devient :
            https://www.youtube.com/embed/ID_VIDEO?start=73
          */}
          <iframe
            src="https://www.youtube.com/embed/MvI80_7sn2Q?start=73"
            title="Démo SinovaAI"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);

  //  "Commencer" : direct vers Explorer si connecté, sinon vers la
  // page de connexion.
  const handleCommencer = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/explorer');
    } else {
      navigate('/connexion');
    }
  };

  const handleVoirDemo = () => {
    setShowDemoModal(true);
  };

  const closeDemoModal = () => {
    setShowDemoModal(false);
  };

  return (
    <section className="sinova-hero">
      <div className="sinova-hero-container">
        <h1 className="sinova-hero-title">
          Apprenez les langages  informatiques <img src={brain} alt="brain" className='img-brain'/> plus intelligemment avec l'IA
        </h1>

        <p className="sinova-hero-subtitle">
          Sinova AI vous aide à découvrir les meilleures vidéos, documentations
          et parcours d'apprentissage adaptés à votre niveau, vos objectifs et
          votre style d'apprentissage.
        </p>

        <div className="sinova-hero-buttons">
          <button
            className="sinova-btn sinova-btn-white"
            type="button"
            onClick={handleCommencer}
          >
            Commencer
          </button>

          <button
            className="sinova-btn sinova-btn-accent"
            type="button"
            onClick={handleVoirDemo}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 1.5L12.5 7L3 12.5V1.5Z"
                fill="white"
                stroke="white"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
            Voir démo
          </button>
        </div>

        <div className="sinova-tech-section">
          <h3 className="sinova-tech-title">
            Apprenez avec les technologies les plus utilisées dans l'industrie
          </h3>
          <TechTicker items={TECH_LOGOS} />
        </div>
      </div>

      <div className="sinova-hero-glow" aria-hidden="true" />

      {showDemoModal && <DemoVideoModal onClose={closeDemoModal} />}
    </section>
  );
}