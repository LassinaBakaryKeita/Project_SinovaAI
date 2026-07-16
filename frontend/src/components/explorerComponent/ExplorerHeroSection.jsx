import React from 'react';
import './ExplorerHeroSection.css';

export default function ExplorerHeroSection({
  query,
  setQuery,
  onSearch,
  onReset,
  loading = false //  empêche de relancer une recherche pendant qu'une autre tourne
}) {

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      onSearch(query);
    }
  };

  // Fonction pour effacer la recherche
  const handleClear = () => {
    if (loading) return;
    setQuery('');
    if (onReset) onReset();
  };

  const handleTagClick = (tag) => {
    if (loading) return;
    setQuery(tag.value);
    // On passe directement la valeur du tag à onSearch, plutôt que de
    // compter sur l'état `query` (qui n'est pas encore synchronisé à cet
    // instant précis). C'est ce qui causait le décalage "d'une recherche".
    onSearch(tag.value);
  };

  //  Tags populaires : "label" est ce qui s'affiche (court, lisible),
  // "value" est la vraie requête envoyée (plus précise). Objectif : que
  // l'utilisateur associe inconsciemment "recherche précise" = "bons
  // résultats", sans pour autant afficher un texte à rallonge dans le bouton.
  const popularTags = [
    { label: 'Python débutant', value: 'Python tutoriel débutant' },
    { label: 'JavaScript moderne', value: 'JavaScript ES6 tutoriel' },
    { label: 'React JS (librairie)', value: 'React JS librairie tutoriel' },
    { label: 'Java orienté objet', value: 'Java programmation orientée objet' },
    { label: 'Docker conteneurs', value: 'Docker conteneurs tutoriel' },
    { label: 'Machine Learning débutant', value: 'Machine Learning tutoriel débutant' },
  ];

  return (
    <section className="explorer-hero">
      <div className="explorer-hero-container">

        {/* ===== Badge ===== */}
        <div className="explorer-hero-badge">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="5" fill="#EE634E" opacity="0.3" />
            <circle cx="5" cy="5" r="2.5" fill="#EE634E" />
          </svg>
          <span>Ressources</span>
        </div>

        {/* ===== Titre ===== */}
        <h1 className="explorer-hero-title">
          Explorer les ressources
        </h1>

        {/* ===== Sous-titre ===== */}
        <p className="explorer-hero-subtitle">
          Découvrez les meilleures ressources pour chaque technologie
        </p>

        {/* ===== Barre de recherche ===== */}
        <div className="explorer-search-bar">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="explorer-search-icon"
          >
            <circle
              cx="9"
              cy="9"
              r="6"
              stroke="rgb(150,152,180)"
              strokeWidth="1.8"
            />
            <path
              d="M14 14L18 18"
              stroke="rgb(150,152,180)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>

          <input
            type="text"
            placeholder="Rechercher Python, JavaScript, Java..."
            className="explorer-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          {/* ===== BOUTON EFFACER ===== */}
          {query && (
            <button
              className="explorer-clear-btn"
              type="button"
              aria-label="Effacer la recherche"
              onClick={handleClear}
              disabled={loading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}

          <button
            className="explorer-search-btn"
            type="button"
            aria-label="Rechercher"
            onClick={() => onSearch(query)}
            disabled={loading || !query.trim()}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <span style={{ fontSize: '14px' }}>⏳</span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle
                  cx="9"
                  cy="9"
                  r="6"
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  d="M14 14L18 18"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* ===== TAGS POPULAIRES ===== */}
        <div className="explorer-tags">
          <span className="explorer-tags-label">Populaires :</span>
          {popularTags.map((tag) => (
            <button
              key={tag.label}
              className="explorer-tag"
              disabled={loading}
              onClick={() => {
                handleTagClick(tag);
              }}
              style={{
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* ===== ASTUCE PRÉCISION (discrète, non culpabilisante) ===== */}
        <p className="explorer-precision-hint">
          💡 Plus votre recherche est précise (ex : « Django REST API » plutôt que « Python »), meilleurs seront les résultats. Cette optimisation sera automatisée par IA dans une prochaine version.
        </p>

      </div>
    </section>
  );
}