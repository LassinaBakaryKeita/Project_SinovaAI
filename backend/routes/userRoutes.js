const express = require("express");
const passport = require("passport");

const router = express.Router();

const userController = require("../controllers/userController");
const { requireAuth, optionalAuth } = require("../middlewares/authMiddleware");

// Authentification classique
router.post("/sInscrireClassique", userController.sInscrireClassique);
router.post("/seConnecterClassique", userController.seConnecterClassique);

// Démarrer l'authentification Google
router.get(
    "/authGoogle",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false //  évite toute dépendance à express-session (MemoryStore),
                        // incompatible avec le côté stateless de Vercel serverless
    })
);


// Google redirige automatiquement l'utilisateur vers cette route
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/connexion"
    }),
    userController.authGoogle
);

// Déconnexion
router.post("/seDeconnecter", userController.seDeconnecter);

// Ressources
//  requireAuth : ces routes ne sont atteignables que via /explorer,
// déjà protégée côté frontend — donc pas de risque de casser un accès
// public en l'exigeant ici aussi.
router.get("/effectuerRecherche", requireAuth, userController.effectuerRecherche);
router.post("/effectuerRecherchePersonnalisee", requireAuth, userController.effectuerRecherchePersonnalisee);

// Routes pour les assistants SinovaAI
//  optionalAuth : /video-detail/:id n'est pas encore protégée côté
// frontend, donc on ne bloque pas — on trace juste l'activité quand un
// utilisateur connecté est identifié.
router.post("/poserQuestionAssistantSinovaAIGeneral", userController.poserQuestionAssistantSinovaAIGeneral);
router.post("/poserQuestionAssistantSinovaAIRessource", optionalAuth, userController.poserQuestionAssistantSinovaAIRessource);

// Détails de la vidéo
router.get("/video/details/:id", optionalAuth, userController.getVideoDetails);

//  Nouvelle route : enregistrement du temps de visionnage d'une vidéo
router.post("/trackTimeSpent", optionalAuth, userController.trackTimeSpent);

module.exports = router;


