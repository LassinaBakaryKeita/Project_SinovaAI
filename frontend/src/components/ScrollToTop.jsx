import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Remonte automatiquement la page en haut à chaque changement de route.
 * React Router ne le fait jamais tout seul (contrairement à une vraie
 * navigation de page) : sans ce composant, la position de scroll de la
 * page précédente est conservée telle quelle sur la nouvelle page.
 *
 * Ne rend rien à l'écran (retourne null) — c'est un composant purement
 * "effet de bord". À monter une seule fois, à l'intérieur du Router,
 * au-dessus des <Routes>.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}