const jwt = require("jsonwebtoken");

function extractUserId(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
}

//  requireAuth : bloque la requête (401) si aucun token valide n'est fourni.
// À utiliser sur les routes qui nécessitent obligatoirement d'être connecté
// (ex: effectuerRecherche, effectuerRecherchePersonnalisee — atteintes
// uniquement via la page /explorer, déjà protégée côté frontend).
function requireAuth(req, res, next) {
  const userId = extractUserId(req);

  if (!userId) {
    return res.status(401).json({
      message: "Authentification requise. Veuillez vous reconnecter."
    });
  }

  req.userId = userId;
  next();
}

//  optionalAuth : attache req.userId si un token valide est présent, mais
// laisse passer la requête même sans token (req.userId reste undefined).
// À utiliser sur les routes accessibles sans compte (ex: /video-detail/:id
// n'est pas encore protégée côté frontend) : on veut simplement tracker
// l'activité QUAND on connaît l'utilisateur, sans casser l'accès public.
function optionalAuth(req, res, next) {
  req.userId = extractUserId(req) || undefined;
  next();
}

module.exports = { requireAuth, optionalAuth };