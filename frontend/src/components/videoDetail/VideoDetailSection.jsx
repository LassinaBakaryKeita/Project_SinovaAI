import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axiosClient'; // ✅ adapte ce chemin si VideoDetailSection.jsx n'est pas directement sous src/components/xxx (ex: '../../api/axiosClient')
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './VideoDetailSection.css';

const SummaryIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
    </svg>
);

const QuizIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
);

const ExplainIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
    </svg>
);

const KeyPointsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
    </svg>
);

const SendIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
);

const BackIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"/>
    </svg>
);

const PlayIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.6)"/>
        <path d="M10 8L16 12L10 16V8Z" fill="white"/>
    </svg>
);

export default function VideoDetailSection() {
  const navigate = useNavigate();
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedResources, setRelatedResources] = useState([]);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Bonjour ! Je suis votre assistant IA. Posez-moi une question sur cette ressource.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollRef = useRef(null);

  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${BASE_URL}/api/user/video/details/${id}`
        );

        setVideoData(response.data.video);
        setRelatedResources(response.data.relatedResources || []);

      } catch (error) {
        console.error("Erreur lors du chargement de la vidéo:", error);
        setError("Impossible de charger les détails de la vidéo. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideoData();
    }
  }, [id, BASE_URL]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // ✅ Enregistre le temps de visionnage par petits paquets réguliers
  // (toutes les 20s) pendant que la page est ouverte, PLUS un dernier envoi
  // du reliquat à la sortie. L'ancienne version n'envoyait qu'à la sortie
  // via le nettoyage du useEffect — mais ce nettoyage ne se déclenche
  // jamais si l'utilisateur ferme l'onglet ou recharge la page (F5),
  // laissant tempsPasse/tempsVisionnage à 0 dans ce cas. Le heartbeat
  // corrige ça : même sans sortie "propre", l'essentiel du temps est déjà
  // enregistré par les envois périodiques précédents.
  useEffect(() => {
    let lastSentAt = Date.now();

    const sendElapsed = () => {
      const secondsSpent = Math.round((Date.now() - lastSentAt) / 1000);
      if (secondsSpent < 3) return;

      lastSentAt = Date.now();

      axios.post(`${BASE_URL}/api/user/trackTimeSpent`, {
        videoId: id,
        secondsSpent
      }).catch(() => {
        // silencieux : un échec de tracking ne doit jamais gêner l'utilisateur
      });
    };

    // Envoi périodique toutes les 20 secondes pendant le visionnage.
    const intervalId = setInterval(sendElapsed, 20000);

    return () => {
      clearInterval(intervalId);
      // Dernier envoi du reliquat (temps écoulé depuis le dernier heartbeat)
      // au moment où l'utilisateur quitte la page via la navigation interne.
      sendElapsed();
    };
  }, [id, BASE_URL]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text: text.trim() }]);
    setInput('');
    setIsChatLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/poserQuestionAssistantSinovaAIRessource`,
        {
          videoId: id,
          message: text.trim(),
          videoData: videoData
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: response.data.message || 'Je n\'ai pas pu traiter votre question. Veuillez réessayer.'
        }
      ]);

    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);

      const serverMessage = error.response?.data?.message;

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: serverMessage || 'Désolé, une erreur est survenue. Veuillez réessayer plus tard.'
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const QUICK_ACTIONS = [
    { label: 'Résumer', icon: <SummaryIcon /> },
    { label: 'Générer un quiz', icon: <QuizIcon /> },
    { label: 'Expliquer simplement', icon: <ExplainIcon /> },
    { label: 'Points clés', icon: <KeyPointsIcon /> },
  ];

  const formatDuration = (isoDuration) => {
    if (!isoDuration) return 'Durée inconnue';

    const match = isoDuration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
    if (!match) return isoDuration;

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}min`);
    if (seconds > 0 && hours === 0) parts.push(`${seconds}sec`);

    return parts.length > 0 ? parts.join(' ') : 'Durée inconnue';
  };

  const truncateDescription = (text, maxLength = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="video-detail-section">
        <div className="video-loading">
          <div className="loading-spinner"></div>
          <p>Chargement de la vidéo...</p>
        </div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="video-detail-section">
        <button
          type="button"
          className="video-back-btn"
          onClick={() => navigate('/explorer', { replace: true })}
        >
          <BackIcon /> Retour
        </button>
        <div className="video-error">
          <p>{error || "Vidéo non trouvée"}</p>
          <button
            onClick={() => navigate('/explorer', { replace: true })}
            className="video-error-btn"
          >
            Retourner à l'exploration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-detail-section">
      <button
        type="button"
        className="video-back-btn"
        onClick={() => navigate('/explorer', { replace: true })}
      >
        <BackIcon /> Retour
      </button>

      <div className="video-detail-grid">
        <div className="video-left-col">
          <div className="video-player-card">
            {videoData.id ? (
              <iframe
                className="video-iframe"
                src={`https://www.youtube.com/embed/${videoData.id}?autoplay=0&rel=0&modestbranding=1`}
                title={videoData.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="video-player-placeholder">
                <PlayIcon />
                <p>Vidéo non disponible</p>
              </div>
            )}
          </div>

          <div className="video-info-card">
            <h1 className="video-info-title">{videoData.title}</h1>

            <div className="video-info-badges">
              <span className="video-badge tag">{videoData.tag || 'Informatique'}</span>
              <span className="video-badge level">{videoData.level || 'Tous niveaux'}</span>
              <span className="video-badge meta">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="#9698b4" strokeWidth="1.3" />
                  <path d="M7 4v3l2 1.5" stroke="#9698b4" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                {formatDuration(videoData.duration)}
              </span>
              <span className="video-badge meta">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.4 3.6 12 3.6 12 3.6h0s-4.4 0-7.7.3c-.5 0-1.5.1-2.4 1C1.2 5.6 1 7.2 1 7.2S.8 9 .8 10.9v2c0 1.9.2 3.7.2 3.7s.2 1.6.9 2.3c.9.9 2.1.9 2.6 1 1.9.2 8.5.2 8.5.2s4.4 0 7.7-.3c.5 0 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.8.2-3.7v-2c0-1.9-.2-3.7-.2-3.7z"
                    fill="#FF0000"
                  />
                  <path d="M9.7 14.9V8.7l6.5 3.1-6.5 3.1z" fill="white" />
                </svg>
                {videoData.source || 'YouTube'}
              </span>
            </div>

            <div className="video-popularity">
              <span className="video-popularity-value">{videoData.popularity || 0}%</span>
              <span className="video-popularity-label">Score popularité</span>
            </div>

            <div className="video-description-wrapper">
              <p className="video-description">
                {descriptionExpanded
                  ? videoData.description || 'Aucune description disponible.'
                  : truncateDescription(videoData.description || 'Aucune description disponible.', 200)
                }
              </p>
              {videoData.description && videoData.description.length > 200 && (
                <button
                  className="video-description-toggle"
                  onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                >
                  {descriptionExpanded ? 'Voir moins' : 'Voir plus'}
                </button>
              )}
            </div>

            {relatedResources.length > 0 && (
              <>
                <h3 className="video-related-title">Ressources associées</h3>
                <div className="video-related-grid">
                  {relatedResources.map((r, index) => (
                    <a
                      key={index}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="video-related-link"
                    >
                      → {r.label}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="video-assistant-card">
          <div className="video-assistant-header">
            <div className="video-assistant-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2l1.7 5.3L17 9l-5.3 1.7L10 16l-1.7-5.3L3 9l5.3-1.7L10 2z" fill="white" />
              </svg>
            </div>
            <div>
              <h3>Assistant IA</h3>
              <span className="video-assistant-status">
                <span className="dot" /> En ligne
              </span>
            </div>
          </div>

          <div className="video-assistant-actions">
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                type="button"
                className="video-assistant-action-btn"
                onClick={() => sendMessage(a.label)}
                disabled={isChatLoading}
              >
                <span className="action-icon">{a.icon}</span>
                <span className="action-label">{a.label}</span>
              </button>
            ))}
          </div>

          <div className="video-assistant-chat" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`video-chat-bubble ${m.role}`}>
                {m.role === 'assistant' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.text}
                  </ReactMarkdown>
                ) : (
                  m.text
                )}
              </div>
            ))}
            {isChatLoading && (
              <div className="video-chat-bubble assistant">
                <span className="typing-dots">...</span>
              </div>
            )}
          </div>

          <div className="video-assistant-input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isChatLoading) {
                  sendMessage(input);
                }
              }}
              placeholder="Posez votre question..."
              disabled={isChatLoading}
            />
            <button
              type="button"
              className="video-assistant-send-btn"
              onClick={() => sendMessage(input)}
              disabled={isChatLoading || !input.trim()}
              aria-label="Envoyer"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}