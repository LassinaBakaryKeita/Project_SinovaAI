import React, { useState } from 'react';
import './PersonalizeForm.css';

const LEVELS = ['Débutant', 'Intermédiaire', 'Avancé'];
const OBJECTIVES = ['Backend', 'Frontend', 'Data Science', 'IA', 'Mobile'];
const STYLES = ['Vidéos', 'Documentation', 'Exercices', 'Mixte'];
const AVAILABILITY = ['Moins de 30 min', '30 min - 1h', '1h - 2h', 'Plus de 2h'];
const LANGUAGES = ['Français', 'English', 'Both'];

function Chip({ label, active, onClick }) {
  return (
    <button type="button" className={`chip ${active ? 'active' : ''}`} onClick={onClick}>
      {label}
    </button>
  );
}

export default function PersonalizeForm({ onGenerate }) {
  const [level, setLevel] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [styles, setStyles] = useState([]);
  const [availability, setAvailability] = useState(AVAILABILITY[0]);
  const [language, setLanguage] = useState('Both');
  const [query, setQuery] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleMulti = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const handleSubmit = async () => {
    if (!query.trim()) {
      setFormError("Veuillez indiquer ce que vous voulez apprendre.");
      return;
    }

    if (!level) {
      setFormError("Veuillez sélectionner un niveau.");
      return;
    }

    if (styles.length === 0) {
      setFormError("Veuillez sélectionner au moins un style d'apprentissage.");
      return;
    }

    setFormError('');
    setIsLoading(true);

    try {
      await onGenerate({
        query: query.trim(),
        level,
        objectives,
        styles,
        availability,
        language
      });
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      setFormError("Une erreur est survenue lors de la génération des recommandations.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="personalize-form">
      <h2 className="personalize-title">Personnalisez vos recommandations</h2>

      <div className="personalize-grid">
        <div className="personalize-col">
          <div className="personalize-field">
            <label>Ce que vous voulez apprendre</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: React, Machine Learning…"
              disabled={isLoading}
            />
          </div>

          <div className="personalize-field">
            <label>Objectif</label>
            <div className="chip-row">
              {OBJECTIVES.map((o) => (
                <Chip 
                  key={o} 
                  label={o} 
                  active={objectives.includes(o)} 
                  onClick={() => !isLoading && toggleMulti(objectives, setObjectives, o)}
                />
              ))}
            </div>
          </div>

          <div className="personalize-field">
            <label>Disponibilité quotidienne</label>
            <select 
              value={availability} 
              onChange={(e) => setAvailability(e.target.value)}
              disabled={isLoading}
            >
              {AVAILABILITY.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="personalize-field">
            <label>Langue</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isLoading}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="personalize-col">
          <div className="personalize-field">
            <label>Niveau</label>
            <div className="chip-row">
              {LEVELS.map((l) => (
                <Chip 
                  key={l} 
                  label={l} 
                  active={level === l} 
                  onClick={() => !isLoading && setLevel(level === l ? null : l)}
                />
              ))}
            </div>
          </div>

          <div className="personalize-field">
            <label>Style d'apprentissage</label>
            <div className="chip-row">
              {STYLES.map((s) => (
                <Chip 
                  key={s} 
                  label={s} 
                  active={styles.includes(s)} 
                  onClick={() => !isLoading && toggleMulti(styles, setStyles, s)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {formError && (
        <p className="personalize-form-error" style={{ color: '#EE634E', marginTop: '8px', fontSize: '0.9rem' }}>
          {formError}
        </p>
      )}

      <button 
        type="button" 
        className="personalize-submit-btn" 
        onClick={handleSubmit}
        disabled={isLoading}
        style={{
          opacity: isLoading ? 0.7 : 1,
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? (
          <>
            <span className="spinner">⏳</span> Génération en cours...
          </>
        ) : (
          <>
            <span>✨</span> Générer des recommandations
          </>
        )}
      </button>
    </div>
  );
}