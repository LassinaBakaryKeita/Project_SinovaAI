import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RessourcesSection.css";
import PersonalizeForm from "./PersonalizeForm";

const SOURCE_ICON = {
    YouTube: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path
                d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.4 3.6 12 3.6 12 3.6h0s-4.4 0-7.7.3c-.5 0-1.5.1-2.4 1C1.2 5.6 1 7.2 1 7.2S.8 9 .8 10.9v2c0 1.9.2 3.7.2 3.7s.2 1.6.9 2.3c.9.9 2.1.9 2.6 1 1.9.2 8.5.2 8.5.2s4.4 0 7.7-.3c.5 0 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.8.2-3.7v-2c0-1.9-.2-3.7-.2-3.7z"
                fill="#FF0000"
            />
            <path
                d="M9.7 14.9V8.7l6.5 3.1-6.5 3.1z"
                fill="white"
            />
        </svg>
    ),
    Documentation: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <rect
                x="3"
                y="2"
                width="18"
                height="20"
                rx="2"
                fill="#3776AB"
            />
            <path
                d="M7 7h10M7 11h10M7 15h6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    )
};

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
    </svg>
);

const TechnologyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
    </svg>
);

const SpellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
);

const SinovaIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
);

const BulbIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
    </svg>
);

const RESOURCE_TYPE_COLORS = {
    "Vidéo": "#EE634E",
    "Documentation officielle": "#35E4FD",
    "Article": "#A78BFA",
    "Tutoriel": "#00C853"
};

function formatDuration(isoDuration) {
    if (!isoDuration) return null;

    const match = isoDuration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
    if (!match) return isoDuration;

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    const parts = [];
    if (hours > 0) parts.push(`${hours} h`);
    if (minutes > 0) parts.push(`${minutes} min`);
    if (seconds > 0 && hours === 0) parts.push(`${seconds} sec`);

    return parts.length > 0 ? parts.join(' ') : '0 min';
}

function Thumbnail({ thumbnail }) {
    if (thumbnail) {
        return (
            <div className="resource-thumb-wrapper">
                <img
                    src={thumbnail}
                    alt="Miniature"
                    className="resource-thumb"
                />
                <div className="resource-thumb-overlay" />
            </div>
        );
    }

    return (
        <div className="resource-thumb-wrapper">
            <div className="resource-thumb resource-thumb-placeholder">
                <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    className="placeholder-icon"
                >
                    <rect
                        x="8"
                        y="6"
                        width="48"
                        height="52"
                        rx="8"
                        fill="rgba(255,255,255,0.05)"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M20 20H44"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M20 28H44"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M20 36H36"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <circle
                        cx="44"
                        cy="48"
                        r="10"
                        fill="rgba(53, 228, 253, 0.15)"
                        stroke="rgba(53, 228, 253, 0.3)"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M41 48L43.5 50.5L48.5 45.5"
                        stroke="#35E4FD"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <circle cx="44" cy="48" r="3" fill="#35E4FD" opacity="0.2" />
                </svg>
            </div>
            <div className="resource-thumb-overlay" />
        </div>
    );
}

function OwnerLogo({ source }) {
    if (source === "YouTube") {
        return (
            <div className="resource-owner-logo youtube">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.4 3.6 12 3.6 12 3.6h0s-4.4 0-7.7.3c-.5 0-1.5.1-2.4 1C1.2 5.6 1 7.2 1 7.2S.8 9 .8 10.9v2c0 1.9.2 3.7.2 3.7s.2 1.6.9 2.3c.9.9 2.1.9 2.6 1 1.9.2 8.5.2 8.5.2s4.4 0 7.7-.3c.5 0 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.8.2-3.7v-2c0-1.9-.2-3.7-.2-3.7z"
                        fill="#FF0000"
                    />
                    <path
                        d="M9.7 14.9V8.7l6.5 3.1-6.5 3.1z"
                        fill="white"
                    />
                </svg>
            </div>
        );
    }

    return (
        <div className="resource-owner-logo documentation">
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
            >
                <rect
                    x="4"
                    y="3"
                    width="16"
                    height="18"
                    rx="2"
                    fill="#3776AB"
                />
                <path
                    d="M8 8H16"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                />
                <path
                    d="M8 12H16"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                />
                <path
                    d="M8 16H13"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}

function WelcomeSection() {
    const exampleSearches = ["Python", "JavaScript", "React", "Java", "Docker", "Machine Learning"];

    return (
        <div className="welcome-section">
            <div className="welcome-illustration">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="50" fill="rgba(53, 228, 253, 0.05)" />
                    <circle cx="60" cy="60" r="35" fill="rgba(53, 228, 253, 0.08)" />
                    <circle cx="60" cy="60" r="20" fill="rgba(53, 228, 253, 0.12)" />
                    
                    <path d="M45 50L60 40L75 50V70L60 80L45 70V50Z" stroke="#35E4FD" strokeWidth="2" fill="rgba(53, 228, 253, 0.05)" />
                    <path d="M50 55L60 48L70 55V67L60 74L50 67V55Z" stroke="#35E4FD" strokeWidth="1.5" fill="rgba(53, 228, 253, 0.08)" />
                    
                    <circle cx="60" cy="60" r="3" fill="#35E4FD" opacity="0.6" />
                    
                    <path d="M35 65L40 60L45 65" stroke="#35E4FD" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M75 65L80 60L85 65" stroke="#35E4FD" strokeWidth="1.5" strokeLinecap="round" />
                    
                    <circle cx="55" cy="55" r="2" fill="#35E4FD" opacity="0.3" />
                    <circle cx="65" cy="55" r="2" fill="#35E4FD" opacity="0.3" />
                    <circle cx="60" cy="65" r="1.5" fill="#35E4FD" opacity="0.2" />
                </svg>
            </div>
            
            <h2 className="welcome-title">Découvrez les meilleures ressources pour apprendre</h2>
            <p className="welcome-description">
                Explorez une sélection de vidéos YouTube et documentations officielles,
                soigneusement choisies par SinovaAI pour vous aider à maîtriser vos technologies préférées.
            </p>
            
            <div className="welcome-examples">
                <span className="welcome-examples-label">Essayez :</span>
                {exampleSearches.map((tech, index) => (
                    <span key={index} className="welcome-example-tag">
                        {tech}
                    </span>
                ))}
            </div>
        </div>
    );
}

function NoResultsSection({ searchQuery, errorMessage }) {
    const suggestions = [
        {
            icon: <SearchIcon />,
            text: "Essayez un autre mot-clé"
        },
        {
            icon: <TechnologyIcon />,
            text: "Utilisez un nom de technologie plus large"
        },
        {
            icon: <SpellIcon />,
            text: "Vérifiez l'orthographe"
        },
        {
            icon: <SinovaIcon />,
            text: "SinovaAI est spécialisé dans les technologies informatiques"
        }
    ];

    return (
        <div className="no-results-section">
            <div className="no-results-illustration">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="40" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1.5" />
                    <circle cx="50" cy="50" r="28" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1.5" strokeDasharray="4 4" />
                    
                    <path d="M35 35L45 45" stroke="#9698b4" strokeWidth="2" strokeLinecap="round" />
                    <path d="M55 55L65 65" stroke="#9698b4" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="15" stroke="#9698b4" strokeWidth="2" />
                    <path d="M61 61L68 68" stroke="#9698b4" strokeWidth="2" strokeLinecap="round" />
                    
                    <circle cx="45" cy="45" r="2" fill="#9698b4" opacity="0.3" />
                    <circle cx="55" cy="45" r="2" fill="#9698b4" opacity="0.3" />
                    <circle cx="50" cy="52" r="1.5" fill="#9698b4" opacity="0.2" />
                </svg>
            </div>
            
            <h3 className="no-results-title">Aucun résultat trouvé</h3>
            <p className="no-results-description">
                {errorMessage || `Nous n'avons pas trouvé de ressources pour « ${searchQuery} ».`}
            </p>
            
            <ul className="no-results-suggestions">
                {suggestions.map((suggestion, index) => (
                    <li key={index} className="suggestion-item">
                        <span className="suggestion-icon">{suggestion.icon}</span>
                        <span className="suggestion-text">{suggestion.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ResourceCard({ data, onOpen }) {
    const [expanded, setExpanded] = useState(false);
    const formattedDuration = formatDuration(data.duration);

    return (
        <div
            className="resource-card"
            onClick={onOpen}
        >
            <div className="resource-thumb-wrap">
                <Thumbnail thumbnail={data.thumbnail} />
                
                <div className="resource-level-badge">
                    <span
                        className="resource-level-dot"
                        style={{
                            backgroundColor:
                                RESOURCE_TYPE_COLORS[data.resourceType] ??
                                "#35E4FD"
                        }}
                    />
                    <span>{data.resourceType}</span>
                </div>

                <button
                    className="resource-play-btn"
                    type="button"
                    aria-label="Ouvrir la ressource"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen();
                    }}
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                    >
                        <path
                            d="M5.5 3.5L14 9L5.5 14.5V3.5Z"
                            fill="white"
                        />
                    </svg>
                </button>
            </div>

            <div className="resource-content">
                <h3 className="resource-title">{data.title}</h3>

                <p
                    className={`resource-description ${
                        expanded ? "expanded" : ""
                    }`}
                >
                    {data.description}
                </p>

                <button
                    className="resource-toggle-desc"
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }}
                >
                    {expanded ? "Voir moins" : "Voir plus"}
                </button>

                <div className="resource-meta">
                    {formattedDuration && (
                        <div className="resource-meta-chip">
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 14 14"
                                fill="none"
                            >
                                <circle
                                    cx="7"
                                    cy="7"
                                    r="5.5"
                                    stroke="#9698b4"
                                    strokeWidth="1.3"
                                />
                                <path
                                    d="M7 4v3l2 1.5"
                                    stroke="#9698b4"
                                    strokeWidth="1.3"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span>{formattedDuration}</span>
                        </div>
                    )}

                    <div className="resource-meta-chip">
                        {SOURCE_ICON[data.source]}
                        <span>{data.source}</span>
                    </div>

                    {data.popularity !== null &&
                        data.popularity !== undefined && (
                            <div className="resource-meta-chip">
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                >
                                    <path
                                        d="M2.5 9.5L5.2 6.8L7.1 8.7L11.5 4.3"
                                        stroke="#9698b4"
                                        strokeWidth="1.3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M9.3 4.3H11.5V6.5"
                                        stroke="#9698b4"
                                        strokeWidth="1.3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>{Math.round(data.popularity)}% populaire</span>
                            </div>
                        )}
                </div>

                <div className="resource-divider" />

                <div className="resource-owner">
                    <OwnerLogo source={data.source} />
                    <span>{data.ownerName}</span>
                </div>
            </div>
        </div>
    );
}

export default function ResourcesSection({
    resources,
    loading,
    error,
    searchQuery,
    onGeneratePersonalized
}) {
    // ✅ "mode" est maintenant piloté UNIQUEMENT par une action explicite
    // de l'utilisateur (clic sur un toggle, ou fin d'une recherche
    // personnalisée). On ne le fait plus dépendre de l'état ambiant
    // (resources/error déjà présents en mémoire), ce qui provoquait le
    // blocage : cliquer sur "Recherche personnalisée" alors que d'anciens
    // résultats ou une ancienne erreur traînaient encore faisait rebondir
    // immédiatement vers "Explorer" avant même que le formulaire s'affiche.
    const [mode, setMode] = useState("explorer");
    const navigate = useNavigate();

    function handleOpenResource(resource) {
        const isVideo = resource.source === "YouTube" || 
                       resource.resourceType === "Vidéo" ||
                       resource.resourceType?.includes("Vidéo");

        if (isVideo && resource.id) {
            navigate(`/video-detail/${resource.id}`);
            return;
        }

        if (resource.externalUrl) {
            window.open(
                resource.externalUrl,
                "_blank",
                "noopener,noreferrer"
            );
            return;
        }

        console.warn("Aucune URL disponible pour cette ressource:", resource);
    }

    // ✅ On bascule vers "explorer" explicitement une fois la recherche
    // personnalisée terminée (succès OU échec), pour afficher le résultat.
    // Cette bascule est déclenchée par l'action elle-même, pas par un
    // effet qui observe l'état — donc plus de blocage au clic suivant.
    const handleGenerate = async (formData) => {
        try {
            await onGeneratePersonalized(formData);
        } finally {
            setMode("explorer");
        }
    };

    return (
        <section className="resources-section">
            <div className="resources-toggle">
                <button
                    className={`resources-toggle-btn ${
                        mode === "explorer" ? "active-white" : ""
                    }`}
                    onClick={() => setMode("explorer")}
                >
                    Explorer
                </button>
                <button
                    className={`resources-toggle-btn ${
                        mode === "personalize" ? "active-accent" : ""
                    }`}
                    onClick={() => setMode("personalize")}
                >
                    Recherche personnalisée
                </button>
            </div>

            {mode === "personalize" ? (
                <div className="resources-content">
                    <PersonalizeForm onGenerate={handleGenerate} />
                </div>
            ) : (
                <div className="resources-content">
                    {!loading &&
                        !error &&
                        resources.length === 0 &&
                        !searchQuery && (
                            <WelcomeSection />
                        )}

                    {loading && (
                        <div className="resources-loading">
                            <div className="loading-spinner"></div>
                            <span>Chargement des ressources...</span>
                        </div>
                    )}

                    {!loading && error && (
                        <NoResultsSection 
                            searchQuery={searchQuery || "votre recherche"} 
                            errorMessage={error}
                        />
                    )}

                    {!loading &&
                        !error &&
                        resources.length > 0 && (
                            <>
                                <h2 className="resources-title">
                                    Résultats
                                    {searchQuery && (
                                        <> pour : <span>{searchQuery}</span></>
                                    )}
                                </h2>
                                <div className="resources-grid">
                                    {resources.map((resource, index) => (
                                        <ResourceCard
                                            key={`${resource.source}-${resource.id || index}`}
                                            data={resource}
                                            onOpen={() =>
                                                handleOpenResource(resource)
                                            }
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                    {!loading &&
                        !error &&
                        resources.length === 0 &&
                        searchQuery && (
                            <NoResultsSection 
                                searchQuery={searchQuery}
                                errorMessage={`Aucune ressource trouvée pour « ${searchQuery} ».`}
                            />
                        )}
                </div>
            )}
        </section>
    );
}