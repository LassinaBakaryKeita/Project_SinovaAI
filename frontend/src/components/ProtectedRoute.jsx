import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute
 * Enveloppe une page qui nécessite d'être connecté.
 * Si aucun token n'est présent dans le localStorage, on redirige
 * automatiquement vers /connexion (on mémorise la page d'origine dans
 * le state, utile si un jour on veut renvoyer l'utilisateur à sa page
 * initiale juste après la connexion).
 *
 * Usage :
 * <Route
 *   path="/explorer"
 *   element={
 *     <ProtectedRoute>
 *       <Explorer />
 *     </ProtectedRoute>
 *   }
 * />
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/connexion" replace state={{ from: location }} />;
  }

  return children;
}