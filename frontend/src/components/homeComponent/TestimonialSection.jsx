import React, { useState } from 'react';
import './TestimonialSection.css';

import user1 from '../../assets/images-ce-que-nos-utilisateurs/user1.png';
import user2 from '../../assets/images-ce-que-nos-utilisateurs/user2.png';
import user3 from '../../assets/images-ce-que-nos-utilisateurs/user3.png';
import user4 from '../../assets/images-ce-que-nos-utilisateurs/user4.png';

const TESTIMONIALS = [
  {
    id: 1,
    stars: 5,
    title: "J'ai enfin trouvé une méthode claire pour apprendre Python",
    text:
      "« Avant Sinova AI, je passais des heures sur YouTube sans savoir par où commencer. La plateforme m'a proposé un parcours adapté à mon niveau et à mon objectif de devenir Data Scientist. J'ai gagné énormément de temps et je progresse beaucoup plus vite aujourd'hui. »",
    name: 'Mamadou Diarra',
    profile: 'Étudiant en Data Science',
    image: user1,
  },
  {
    id: 2,
    stars: 5,
    title: "Une plateforme qui m'a aidée à me reconvertir dans la tech",
    text:
      "« Les recommandations sont vraiment intelligentes. J'ai pu découvrir des ressources de qualité et apprendre progressivement le développement web sans me sentir dépassée. »",
    name: 'Salma El Idrissi',
    profile: 'Développeuse Frontend Junior',
    image: user2,
  },
  {
    id: 3,
    stars: 5,
    title: "J'apprends plus efficacement et je retiens mieux les concepts",
    text:
      "« Les explications générées par l'IA et les quiz automatiques m'ont énormément aidée. J'ai l'impression d'avoir un mentor personnel disponible à tout moment. »",
    name: 'Emily Johnson',
    profile: 'Ingénieure Réseau Junior',
    image: user3,
  },
  {
    id: 4,
    stars: 5,
    title: 'Je ne perds plus mon temps à chercher les bonnes ressources',
    text:
      "« Sinova AI centralise les meilleures ressources d'apprentissage et les organise intelligemment. Je peux me concentrer sur l'essentiel : apprendre et progresser. »",
    name: 'Lucas Martin',
    profile: 'Consultant en Cybersécurité',
    image: user4,
  },
];

function Stars({ count }) {
  return (
    <div className="testi-stars">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M11 2l2.4 4.87L19 7.77l-4 3.9.94 5.5L11 14.77l-4.94 2.4.94-5.5-4-3.9 5.6-.9L11 2z"
            fill="#EE634E"
          />
        </svg>
      ))}
    </div>
  );
}

function ImageCard({ image, initials }) {
  return (
    <div className="testi-image-card">
      {image ? (
        <img src={image} alt="" className="testi-image-card-img" />
      ) : (
        <div className="testi-image-fallback">
          <div className="testi-image-fallback-avatar">{initials}</div>
          <span>Image à uploader</span>
        </div>
      )}
    </div>
  );
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('right');
  const [displayed, setDisplayed] = useState(0);
  const total = TESTIMONIALS.length;

  const navigate = (dir) => {
    if (animating) return;
    setAnimating(true);
    setDirection(dir === 'next' ? 'right' : 'left');

    setTimeout(() => {
      const next = dir === 'next' ? (current + 1) % total : (current - 1 + total) % total;
      setCurrent(next);
      setDisplayed(next);
      setAnimating(false);
    }, 320);
  };

  const goTo = (index) => {
    if (index === current || animating) return;
    setDirection(index > current ? 'right' : 'left');
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setDisplayed(index);
      setAnimating(false);
    }, 320);
  };

  const t = TESTIMONIALS[displayed];
  const initials = t.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <section className="testimonials-section">
      <div className="testi-header">
        <div className="testi-badge">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="5" fill="#EE634E" opacity="0.35" />
            <circle cx="5" cy="5" r="2.5" fill="#EE634E" />
          </svg>
          <span>Testimonials</span>
        </div>

        <div className="testi-nav-buttons">
          <button className="testi-nav-btn" onClick={() => navigate('prev')} aria-label="Témoignage précédent" type="button">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9L11 14" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="testi-nav-btn" onClick={() => navigate('next')} aria-label="Témoignage suivant" type="button">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 4L12 9L7 14" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <h2 className='testi-title'>Ce que nos utilisateurs disent</h2>

      <div className="testi-grid">
        <div
          className="testi-image-wrap"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? `translateX(${direction === 'right' ? '-24px' : '24px'})` : 'translateX(0)',
          }}
        >
          <ImageCard image={t.image} initials={initials} />
        </div>

        <div
          className="testi-card-text"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? `translateX(${direction === 'right' ? '24px' : '-24px'})` : 'translateX(0)',
          }}
        >
          <div className="testi-card-glow" />

          <div className="testi-card-top">
            <Stars count={t.stars} />
            <h3>{t.title}</h3>
            <p>{t.text}</p>
          </div>

          <div className="testi-card-bottom">
            <div className="testi-card-author">
              <span className="testi-card-name">{t.name}</span>
              <span className="testi-card-profile">{t.profile}</span>
            </div>
            <svg width="52" height="40" viewBox="0 0 52 40" fill="none" className="testi-quote-icon">
              <path
                d="M0 40V24C0 10.667 5.333 2.667 16 0l3.2 4.8C14.4 6.933 11.733 10.4 11.2 15.2H20V40H0zm28 0V24C28 10.667 33.333 2.667 44 0l3.2 4.8C42.4 6.933 39.733 10.4 39.2 15.2H48V40H28z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="testi-dots">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            className={`testi-dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Aller au témoignage ${i + 1}`}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}