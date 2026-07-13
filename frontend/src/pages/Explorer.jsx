import React, { useState, useEffect, useRef } from "react";
import axios from '../api/axiosClient'; 

import ExplorerHeroSection from "../components/explorerComponent/ExplorerHeroSection";
import RessourcesSection from "../components/explorerComponent/RessourcesSection";

export default function Explorer() {

  const [query, setQuery] = useState(() => {
    return localStorage.getItem('explorer_query') || "";
  });

  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem('explorer_resources');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(() => {
    return localStorage.getItem('explorer_error') || "";
  });

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('explorer_query', query);
  }, [query]);

  useEffect(() => {
    localStorage.setItem('explorer_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('explorer_error', error);
  }, [error]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const effectuerRecherche = async (overrideQuery) => {
    const searchTerm = (overrideQuery ?? query).trim();
    if (!searchTerm) return;
    if (loading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentRequestId = ++requestIdRef.current;

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${BASE_URL}/api/user/effectuerRecherche`,
        { params: { query: searchTerm }, signal: controller.signal }
      );

      if (currentRequestId !== requestIdRef.current) return;

      setQuery(searchTerm);
      setResources(response.data);
      setError("");

    } catch (error) {
      if (axios.isCancel(error) || error.name === "CanceledError" || error.code === "ERR_CANCELED") {
        return;
      }

      if (currentRequestId !== requestIdRef.current) return;

      console.error(error);

      if (error.response) {
        const errorMessage = error.response.data?.message;

        if (error.response.status === 404) {
          setError(
            errorMessage ||
            `"${searchTerm}" ne correspond à aucune technologie informatique. Essayez avec : JavaScript, Python, React, etc.`
          );
        } else if (error.response.status === 400) {
          setError(errorMessage || "Veuillez saisir une recherche valide.");
        } else {
          setError(errorMessage || "Une erreur est survenue lors de la recherche.");
        }
      } else if (error.request) {
        setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
      } else {
        setError("Une erreur inattendue est survenue.");
      }

      setResources([]);

    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const effectuerRecherchePersonnalisee = async (formData) => {
    if (loading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentRequestId = ++requestIdRef.current;

    try {
      setLoading(true);
      setError("");

      console.log("Envoi des données personnalisées:", formData);

      const response = await axios.post(
        `${BASE_URL}/api/user/effectuerRecherchePersonnalisee`,
        {
          query: formData.query,
          level: formData.level || '',
          objectives: formData.objectives || [],
          styles: formData.styles || [],
          availability: formData.availability || '',
          language: formData.language || 'Both'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        }
      );

      if (currentRequestId !== requestIdRef.current) return;

      console.log('Ressources personnalisées reçues:', response.data);
      setResources(response.data);
      setError("");
      setQuery(formData.query);

    } catch (error) {
      if (axios.isCancel(error) || error.name === "CanceledError" || error.code === "ERR_CANCELED") {
        return;
      }

      if (currentRequestId !== requestIdRef.current) return;

      console.error("Erreur lors de la recherche personnalisée:", error);

      if (error.response) {
        const errorMessage = error.response.data?.message;

        if (error.response.status === 404) {
          setError(
            errorMessage ||
            `"${formData.query}" ne correspond à aucun sujet informatique. SinovaAI est spécialisé dans les technologies comme : JavaScript, Python, React, Machine Learning, etc.`
          );
        } else if (error.response.status === 400) {
          setError(errorMessage || "Veuillez remplir tous les champs obligatoires.");
        } else {
          setError(errorMessage || "Une erreur est survenue lors de la recherche personnalisée.");
        }
      } else if (error.request) {
        setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
      } else {
        setError("Une erreur inattendue est survenue.");
      }

      setResources([]);

    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const resetSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    requestIdRef.current++;
    setQuery("");
    setResources([]);
    setError("");
    setLoading(false);
    localStorage.removeItem('explorer_query');
    localStorage.removeItem('explorer_resources');
    localStorage.removeItem('explorer_error');
  };

  return (
    <>
      <ExplorerHeroSection
        query={query}
        setQuery={setQuery}
        onSearch={effectuerRecherche}
        onReset={resetSearch}
        loading={loading}
      />

      <RessourcesSection
        resources={resources}
        loading={loading}
        error={error}
        searchQuery={query}
        onGeneratePersonalized={effectuerRecherchePersonnalisee}
      />
    </>
  );
}