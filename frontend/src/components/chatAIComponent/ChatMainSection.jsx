import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatMainSection.css';

const QUICK_PROMPTS = [
  {
    label: 'Apprendre Python de zéro',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 1.5c-1.6 0-2.9.3-3.7.8-.8.5-1 1.1-1 1.6v1.8h4.8v.6H4.8c-1.4 0-2.5.6-3 1.6-.6 1.1-.6 2.5 0 3.6.5 1 1.4 1.6 2.5 1.6h1.4V11h0c0-1.4 1.1-2.5 2.5-2.5h4.4c1.1 0 1.9-.8 1.9-1.9V4.4c0-.6-.2-1.1-1-1.6-.8-.5-2.1-.8-3.7-.8H9z"
          fill="#3776AB"
        />
        <path
          d="M9 16.5c1.6 0 2.9-.3 3.7-.8.8-.5 1-1.1 1-1.6v-1.8H8.9V11.7h4.3c1.4 0 2.5-.6 3-1.6.6-1.1.6-2.5 0-3.6-.5-1-1.4-1.6-2.5-1.6h-1.4V6h0c0 1.4-1.1 2.5-2.5 2.5H5.4c-1.1 0-1.9.8-1.9 1.9v2.2c0 .6.2 1.1 1 1.6.8.5 2.1.8 3.7.8H9z"
          fill="#FFD43B"
        />
      </svg>
    ),
  },
  {
    label: 'Créer une API avec Django',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="2" stroke="#9698b4" strokeWidth="1.4" />
        <path
          d="M9 1.5v2.1M9 14.4v2.1M16.5 9h-2.1M3.6 9H1.5M14.1 3.9l-1.5 1.5M5.4 12.6l-1.5 1.5M14.1 14.1l-1.5-1.5M5.4 5.4L3.9 3.9"
          stroke="#9698b4"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: 'Introduction au Machine Learning',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="9" width="3" height="7" rx="1" fill="#35E4FD" />
        <rect x="7.5" y="5" width="3" height="11" rx="1" fill="#EE634E" />
        <rect x="13" y="2" width="3" height="14" rx="1" fill="#a78bfa" />
      </svg>
    ),
  },
  {
    label: 'Roadmap développeur Full-Stack',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="14" rx="2" stroke="#35E4FD" strokeWidth="1.4" />
        <path d="M5.5 11.5L8 8.5l2 1.8 2.5-3.3" stroke="#35E4FD" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const INITIAL_MESSAGE = {
  role: 'assistant',
  text:
    "Bonjour ! Je suis l'Assistant IA Sinova. Quelle technologie souhaitez-vous apprendre aujourd'hui ? Je peux vous recommander des ressources, expliquer des concepts ou créer un quiz personnalisé.",
};

// Clé localStorage utilisée pour faire persister l'historique du chat
// entre les changements de page. Header.jsx doit vider cette même clé
// lors de la déconnexion (voir handleLogout).
const CHAT_STORAGE_KEY = 'sinovaai_chat_messages';

function loadStoredMessages() {
  try {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Impossible de lire l'historique du chat sauvegardé:", e);
  }
  return [INITIAL_MESSAGE];
}

export default function ChatMainSection() {
  //  On initialise depuis localStorage plutôt que depuis INITIAL_MESSAGE,
  // pour retrouver la conversation même après avoir changé de page.
  const [messages, setMessages] = useState(loadStoredMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Auto-scroll vers le bas
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  //  Sauvegarde de l'historique à chaque changement, pour qu'il survive
  // à une navigation vers une autre page.
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn("Impossible de sauvegarder l'historique du chat:", e);
    }
  }, [messages]);

  const send = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text: text.trim() }]);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/poserQuestionAssistantSinovaAIGeneral`,
        {
          query: text.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const assistantReply = response.data.message || 
        "Je n'ai pas pu traiter votre question. Veuillez réessayer.";

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: assistantReply
        }
      ]);

    } catch (error) {
      console.error("Erreur lors de l'appel à l'assistant:", error);
      
      let errorMessage = "Désolé, une erreur est survenue. Veuillez réessayer plus tard.";
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
        
        if (error.response.status === 500) {
          errorMessage = "Le serveur rencontre un problème. Veuillez réessayer plus tard.";
        }
      } else if (error.request) {
        errorMessage = "Impossible de contacter le serveur. Vérifiez votre connexion.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: errorMessage
        }
      ]);

      setError(errorMessage);

    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      send(input);
    }
  };

  return (
    <div className="chat-main">
      <div className="chat-main-header">
        <div className="chat-main-icon">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M13 2l2.2 6.8L22 11l-6.8 2.2L13 20l-2.2-6.8L4 11l6.8-2.2L13 2z" fill="rgb(238,99,78)" />
          </svg>
        </div>

        <h1 className="chat-main-title">
          Assistant IA <span>Sinova</span>
        </h1>

        <p className="chat-main-subtitle">
          Votre guide personnel pour apprendre les langages informatiques
        </p>
      </div>

      <div className="chat-quick-prompts">
        {QUICK_PROMPTS.map((p) => (
          <button 
            key={p.label} 
            className="chat-quick-prompt-btn" 
            type="button" 
            onClick={() => send(p.label)}
            disabled={isLoading}
          >
            <span className="chat-quick-prompt-label">{p.label}</span>
            <span className="chat-quick-prompt-icon">{p.icon}</span>
          </button>
        ))}
      </div>

      <div className="chat-zone" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-message-row ${m.role}`}>
            {m.role === 'assistant' && (
              <div className="chat-bubble-avatar">
                <svg width="15" height="15" viewBox="0 0 26 26" fill="none">
                  <path d="M13 2l2.2 6.8L22 11l-6.8 2.2L13 20l-2.2-6.8L4 11l6.8-2.2L13 2z" fill="rgb(238,99,78)" />
                </svg>
              </div>
            )}
            <div className={`chat-bubble ${m.role}`}>
              {m.role === 'assistant' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.text}
                </ReactMarkdown>
              ) : (
                m.text
              )}
              {m.role === 'assistant' && isLoading && i === messages.length - 1 && (
                <span className="typing-indicator">
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                </span>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-message-row assistant">
            <div className="chat-bubble-avatar">
              <svg width="15" height="15" viewBox="0 0 26 26" fill="none">
                <path d="M13 2l2.2 6.8L22 11l-6.8 2.2L13 20l-2.2-6.8L4 11l6.8-2.2L13 2z" fill="rgb(238,99,78)" />
              </svg>
            </div>
            <div className="chat-bubble assistant loading">
              <span className="typing-dots">
                <span>•</span>
                <span>•</span>
                <span>•</span>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Quelle technologie souhaitez-vous apprendre ?"
          className="chat-input"
          disabled={isLoading}
        />
        <button 
          className="chat-send-btn" 
          type="button" 
          aria-label="Envoyer" 
          onClick={() => send(input)}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <span className="send-spinner">⏳</span>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h12M10 5l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}