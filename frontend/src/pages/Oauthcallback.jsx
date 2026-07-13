import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function Spinner() {
  return (
    <div style={{
      width: 48,
      height: 48,
      borderRadius: '50%',
      border: '3px solid rgba(53, 228, 253, 0.15)',
      borderTopColor: '#35E4FD',
      animation: 'spin 0.9s linear infinite',
    }} />
  );
}

function Step({ label, done, delay }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(6px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      fontSize: '0.82rem',
      color: done ? '#35E4FD' : 'rgba(255,255,255,0.45)',
      fontFamily: "'Inter', sans-serif",
      letterSpacing: '0.01em',
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle
          cx="7" cy="7" r="6"
          stroke={done ? '#35E4FD' : 'rgba(255,255,255,0.2)'}
          strokeWidth="1.4"
        />
        {done && (
          <path
            d="M4 7l2 2 4-4"
            stroke="#35E4FD"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      {label}
    </div>
  );
}

function SinovaLogo() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 40,
      animation: 'fadeUp 0.6s ease forwards',
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 11,
        background: 'linear-gradient(135deg, #EE634E 0%, #35E4FD 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 20px rgba(53,228,253,0.25)',
      }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M6 5L2 11L6 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 5L20 11L16 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 3L9 19" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <span style={{
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        fontWeight: 800,
        fontSize: '1.25rem',
        color: '#fff',
        letterSpacing: '-0.3px',
      }}>
        Sinova<span style={{ color: '#35E4FD' }}>AI</span>
      </span>
    </div>
  );
}

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));

    const token    = searchParams.get('token');
    const userId   = searchParams.get('userId');
    const userName = searchParams.get('userName');

    if (!token) {
      navigate('/connexion', { replace: true });
      return;
    }

    localStorage.setItem('token',    token);
    localStorage.setItem('userId',   userId   ?? '');
    localStorage.setItem('userName', userName ?? '');

    const timer = setTimeout(() => {
      navigate('/explorer', { replace: true });
    }, 950);

    return () => clearTimeout(timer);
  }, []);

  const page = {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgb(28, 29, 46)',
    overflow: 'hidden',
  };

  const orb = (top, left, color, size = 400) => ({
    position: 'absolute',
    top,
    left,
    width: size,
    height: size,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    pointerEvents: 'none',
    filter: 'blur(1px)',
  });

  const card = {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '52px 48px',
    background: 'rgba(51, 54, 81, 0.55)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 28,
    boxShadow: '0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(53,228,253,0.06)',
    maxWidth: 420,
    width: '90%',
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.98)',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  };

  const ETAPES = [
    { label: 'Vérification de l\'identité',            done: true,  delay: 200  },
    { label: 'Création de la session sécurisée',       done: true,  delay: 500  },
    { label: 'Redirection vers votre espace de travail', done: false, delay: 800  },
  ];

  return (
    <div style={page}>
      <div style={orb('-10%', '-8%',  'rgba(238,99,78,0.12)')} />
      <div style={orb('50%',  '60%',  'rgba(53,228,253,0.10)')} />
      <div style={orb('20%',  '55%',  'rgba(167,139,250,0.07)', 300)} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@700;800&display=swap');

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>

      <div style={card}>
        <SinovaLogo />

        <div style={{ marginBottom: 32 }}>
          <Spinner />
        </div>

        <h1 style={{
          margin: '0 0 10px',
          fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
          fontWeight: 800,
          fontSize: '1.3rem',
          color: '#ffffff',
          letterSpacing: '-0.3px',
          textAlign: 'center',
        }}>
          Connexion sécurisée en cours...
        </h1>

        <p style={{
          margin: '0 0 36px',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.875rem',
          color: 'rgba(186,188,210,0.8)',
          lineHeight: 1.6,
          textAlign: 'center',
          maxWidth: 300,
        }}>
          Veuillez patienter pendant que nous finalisons votre authentification Google et préparons votre espace de travail.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          width: '100%',
          paddingTop: 20,
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {ETAPES.map((s) => (
            <Step key={s.label} label={s.label} done={s.done} delay={s.delay} />
          ))}
        </div>

        <p style={{
          marginTop: 28,
          fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.2)',
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '0.02em',
          textAlign: 'center',
          animation: 'pulse 2.5s ease-in-out infinite',
        }}>
          Sécurisé avec OAuth 2.0 · SinovaAI
        </p>
      </div>
    </div>
  );
}