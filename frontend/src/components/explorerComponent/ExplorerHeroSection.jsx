import React from 'react';
import './ExplorerHeroSection.css';

export default function ExplorerHeroSection({
  query,
  setQuery,
  onSearch,
  onReset,
  loading = false
}) {

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    if (loading) return;
    setQuery('');
    if (onReset) onReset();
  };

  const handleTagClick = (tag) => {
    if (loading) return;
    setQuery(tag);
    onSearch(tag);
  };

  const popularTags = ['Python', 'JavaScript', 'React', 'Java', 'Docker', 'Machine Learning'];

  return (
    <section className="explorer-hero">
      <div className="explorer-hero-container">

        <div className="explorer-hero-badge">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="5" fill="#EE634E" opacity="0.3" />
            <circle cx="5" cy="5" r="2.5" fill="#EE634E" />
          </svg>
          <span>Ressources</span>
        </div>

        <h1 className="explorer-hero-title">
          Explorer les ressources
        </h1>

        <p className="explorer-hero-subtitle">
          Découvrez les meilleures ressources pour chaque technologie
        </p>

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

        <div className="explorer-tags">
          <span className="explorer-tags-label">Populaires :</span>
          {popularTags.map((tag) => (
            <button
              key={tag}
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
              {tag}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}