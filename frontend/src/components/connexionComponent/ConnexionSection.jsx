import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ConnexionSection.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function InputField({
  label,
  placeholder,
  type = 'text',
  value,
  onChange
}) {
  return (
    <div className="connexion-field">
      <label>{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={type === 'password'
          ? 'current-password'
          : 'on'
        }
      />
    </div>
  );
}

function GoogleButton({ onClick, loading }) {
  return (
    <button
      className="connexion-google-btn"
      type="button"
      onClick={onClick}
      disabled={loading}
    >
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path
          d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8c-.2 1.1-.9 2.1-1.9 2.7v2.3h3c1.8-1.6 2.7-4 2.7-6.6z"
          fill="#4285F4"
        />
        <path
          d="M9 18c2.4 0 4.5-.8 6-2.2l-3-2.3c-.8.6-1.9.9-3 .9-2.3 0-4.3-1.6-5-3.7H1v2.4C2.5 16 5.5 18 9 18z"
          fill="#34A853"
        />
        <path
          d="M4 10.7c-.2-.6-.3-1.1-.3-1.7s.1-1.2.3-1.7V4.9H1C.4 6.1 0 7.5 0 9s.4 2.9 1 4.1l3-2.4z"
          fill="#FBBC05"
        />
        <path
          d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6C13.5.8 11.4 0 9 0 5.5 0 2.5 2 1 4.9l3 2.4c.7-2.1 2.7-3.7 5-3.7z"
          fill="#EA4335"
        />
      </svg>

      {loading
        ? 'Redirection...'
        : 'Continuer avec Google'}
    </button>
  );
}

export default function ConnexionSection() {

  const navigate = useNavigate();

  const [mode, setMode] = useState('signup');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const switchMode = (newMode) => {

    setMode(newMode);

    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');

    setError('');
  };

  const saveUserSession = (user) => {

    localStorage.setItem('userId', user.userId);
    localStorage.setItem('userName', user.userName);
    localStorage.setItem('token', user.token);

  };

  const handleSignup = async () => {

    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/user/sInscrireClassique`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Erreur lors de l'inscription."
        );
      }

      saveUserSession(result);

      navigate('/explorer');

    }
    catch (error) {

      setError(error.message);

    }
    finally {

      setLoading(false);

    }

  };

  const handleLogin = async () => {

    setError('');

    if (!email.trim() || !password.trim()) {

      setError('Veuillez remplir tous les champs.');
      return;

    }

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/user/seConnecterClassique`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {

        throw new Error(
          result.message ||
          'Email ou mot de passe incorrect.'
        );

      }

      saveUserSession(result);

      navigate('/explorer');

    }
    catch (error) {

      setError(error.message);

    }
    finally {

      setLoading(false);

    }

  };

  const handleGoogle = () => {

    window.location.href =
      `${API_URL}/api/user/authGoogle`;

  };

  const handleSubmit = () => {

    if (mode === 'signup') {

      handleSignup();

    } else {

      handleLogin();

    }

  };

    return (
    <div className="connexion-section">

      <button
        type="button"
        className="connexion-back-btn"
        onClick={() => window.history.back()}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M10 3L5 8l5 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        Retour
      </button>

      <div className="connexion-card">

        <div className="connexion-card-header">

          <h1>

            {
              mode === "signup"
                ? "Créer un compte"
                : "Se connecter"
            }

            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10 2l1.7 5.3L17 9l-5.3 1.7L10 16l-1.7-5.3L3 9l5.3-1.7L10 2z"
                fill="rgb(238,99,78)"
              />
            </svg>

          </h1>

          <p>

            {
              mode === "signup"
                ? "Rejoignez 10 000+ apprenants sur SinovaAI"
                : "Heureux de vous revoir sur SinovaAI"
            }

          </p>

        </div>

        <div className="connexion-toggle">

          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => switchMode("login")}
          >
            Se connecter
          </button>

          <button
            type="button"
            className={mode === "signup" ? "active" : ""}
            onClick={() => switchMode("signup")}
          >
            S'inscrire
          </button>

        </div>

        {
          error &&
          (
            <p className="connexion-error">
              {error}
            </p>
          )
        }

        <div
          className="connexion-fields"
          key={mode}
        >

          {
            mode === "signup" &&
            (
              <InputField
                label="Nom complet"
                placeholder="Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )
          }

          <InputField
            label="Adresse email"
            placeholder="vous@exemple.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            label="Mot de passe"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {
            mode === "signup" &&
            (
              <InputField
                label="Confirmer le mot de passe"
                placeholder="••••••••"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />
            )
          }

          {
            mode === "login" &&
            (
              <div className="connexion-forgot-row">
                <span>
                  Mot de passe oublié ?
                </span>
              </div>
            )
          }

        </div>

        <button
          type="button"
          className="connexion-submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >

          {
            loading
              ? "Chargement..."
              : mode === "signup"
              ? "Créer mon compte"
              : "Se connecter"
          }

          {
            !loading &&
            (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )
          }

        </button>

        <div className="connexion-divider">

          <div className="connexion-divider-line" />

          <span>ou</span>

          <div className="connexion-divider-line" />

        </div>

        <GoogleButton
          onClick={handleGoogle}
          loading={loading}
        />

      </div>

    </div>
  );

}