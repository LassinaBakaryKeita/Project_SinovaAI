const { prisma } = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const RessourceService = require("../services/ressourceService");
const recommendationService = require("../services/recommendationService");
const YoutubeService = require("../services/youtubeService");
const DocumentationService = require("../services/documentationService");
const GeminiService = require("../services/geminiService");
const TrackingService = require("../services/trackingService");

// Génère un token JWT pour l'utilisateur
const createToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: 1 * 24 * 60 * 60 }
    );
};

// Inscription d'un nouvel utilisateur avec email/mot de passe
module.exports.sInscrireClassique = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name?.trim() || !email?.trim() || !password?.trim()) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires."
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (!validator.isEmail(cleanEmail)) {
            return res.status(400).json({
                message: "Le format de l'email est invalide."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Le mot de passe doit contenir au moins 8 caractères."
            });
        }

        const user = await prisma.user.findUnique({
            where: { email: cleanEmail }
        });

        if (user) {
            return res.status(409).json({
                message: "Cet email est déjà utilisé."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name: cleanName,
                email: cleanEmail,
                password: hashedPassword
            }
        });

        const token = createToken(newUser.id);

        return res.status(201).json({
            userId: newUser.id,
            userName: newUser.name,
            token,
            message: "Inscription réussie !"
        });

    } catch (error) {
        console.error("Erreur serveur :", error);
        return res.status(500).json({
            message: "Erreur serveur."
        });
    }
};

// Connexion d'un utilisateur existant
module.exports.seConnecterClassique = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires."
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        if (!validator.isEmail(cleanEmail)) {
            return res.status(400).json({
                message: "Le format de l'email est invalide."
            });
        }

        const user = await prisma.user.findUnique({
            where: { email: cleanEmail }
        });

        if (!user) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect."
            });
        }

        if (user.authProvider === "GOOGLE") {
            return res.status(400).json({
                message: "Ce compte utilise Google. Veuillez vous connecter avec Google."
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect."
            });
        }

        const token = createToken(user.id);

        return res.status(200).json({
            userId: user.id,
            userName: user.name,
            token,
            message: "Connexion réussie !"
        });

    } catch (error) {
        console.error("Erreur serveur :", error);
        return res.status(500).json({
            message: "Erreur serveur."
        });
    }
};

// Authentification via Google OAuth
module.exports.authGoogle = async (req, res) => {
    try {
        const profile = req.user;
        const email = profile.emails[0].value.trim().toLowerCase();

        let user = await prisma.user.findUnique({
            where: { googleId: profile.id }
        });

        if (!user) {
            user = await prisma.user.findUnique({
                where: { email }
            });

            if (user) {
                if (user.authProvider === "GOOGLE") {
                    // Rien à faire
                } else {
                    user = await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            googleId: profile.id,
                            photo: profile.photos?.[0]?.value,
                            authProvider: "GOOGLE"
                        }
                    });
                }
            } else {
                user = await prisma.user.create({
                    data: {
                        name: profile.displayName,
                        email,
                        googleId: profile.id,
                        photo: profile.photos?.[0]?.value,
                        authProvider: "GOOGLE"
                    }
                });
            }
        }

        const token = createToken(user.id);

        return res.redirect(
            `${process.env.FRONTEND_URL}/auth-success?token=${token}&userId=${user.id}&userName=${encodeURIComponent(user.name)}`
        );

    } catch (error) {
        console.error("Erreur Google :", error);
        return res.redirect(
            `${process.env.FRONTEND_URL}/connexion`
        );
    }
};

// Déconnexion de l'utilisateur
module.exports.seDeconnecter = async (req, res) => {
    res.status(200).json({ message: "Deconnexion reussie !" });
};

// Recherche classique de ressources
module.exports.effectuerRecherche = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || !query.trim()) {
            return res.status(400).json({
                message: "Veuillez saisir une recherche."
            });
        }

        // On log la recherche indépendamment du résultat (succès ou échec),
        // via req.userId injecté par le middleware requireAuth.
        TrackingService.logSearchHistory(req.userId, query, "classique");

        const results = await RessourceService.resources(query);

        if (!results.success && !results.validTechnology) {
            return res.status(404).json({
                message: results.message || "Cette recherche ne correspond à aucune technologie informatique prise en charge par SinovaAI.",
                resources: []
            });
        }

        if (!results.success) {
            return res.status(404).json({
                message: results.message || "Aucune ressource trouvée.",
                resources: []
            });
        }

        const allResources = [
            ...(results.videos || []),
            ...(results.documentations || [])
        ];

        if (allResources.length === 0) {
            return res.status(404).json({
                message: "Aucune ressource trouvée pour cette recherche.",
                resources: []
            });
        }

        return res.status(200).json(allResources);

    } catch (error) {
        console.error("Erreur serveur :", error);
        return res.status(500).json({
            message: "Erreur serveur."
        });
    }
};

// Recherche personnalisée avec filtres
module.exports.effectuerRecherchePersonnalisee = async (req, res) => {
    try {
        const { query, level, objectives, styles, availability, language } = req.body;

        if (!query || !query.trim() || !level) {
            return res.status(400).json({
                message: "Les champs 'Ce que vous voulez apprendre' & 'Niveau' sont obligatoires"
            });
        }

        //  Log de la recherche personnalisée, dès validation des champs.
        TrackingService.logSearchHistory(req.userId, query, "personnalisee");

        const parsedObjectives = Array.isArray(objectives) ? objectives : [];
        const parsedStyles = Array.isArray(styles) ? styles : [];

        console.log("Données reçues:", { query, level, parsedObjectives, parsedStyles, availability, language });

        const recommendation = await recommendationService.personalizeSearch(
            query,
            level,
            parsedObjectives,
            parsedStyles,
            availability,
            language
        );

        console.log("Recommandation générée:", recommendation);

        if (!recommendation.isValidComputerScience) {
            return res.status(404).json({
                message: `"${query}" n'est pas un sujet lié à l'informatique ou à la technologie. SinovaAI est spécialisé dans les ressources informatiques. Veuillez essayer avec un sujet comme : JavaScript, Python, React, Machine Learning, etc.`,
                resources: []
            });
        }

        if (!recommendation.hasDocumentation) {
            return res.status(404).json({
                message: `"${query}" est un sujet informatique, mais nous n'avons pas encore de documentation officielle pour cette technologie. N'hésitez pas à essayer une autre technologie ou à effectuer une recherche classique.`,
                resources: []
            });
        }

        const results = await RessourceService.personalizedResources(recommendation);

        console.log("Résultats trouvés:", results);

        const allResources = [
            ...(results.videos || []),
            ...(results.documentations || [])
        ];

        if (allResources.length === 0) {
            let message = results.message || "Aucune ressource trouvée pour cette recherche.";

            if (!results.success) {
                message = `Désolé, nous n'avons pas trouvé de ressources pour "${query}". Essayez avec d'autres mots-clés ou vérifiez l'orthographe.`;
            }

            return res.status(404).json({
                message: message,
                resources: []
            });
        }

        return res.status(200).json(allResources);

    } catch (error) {
        console.error("Erreur serveur dans effectuerRecherchePersonnalisee:", error);
        return res.status(500).json({
            message: "Erreur serveur lors de la recherche personnalisée.",
            error: error.message
        });
    }
};

// Récupération des détails d'une vidéo
module.exports.getVideoDetails = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Récupération des détails pour la vidéo:", id);

        if (!id) {
            return res.status(400).json({
                message: "ID de vidéo manquant"
            });
        }

        const videoDetails = await YoutubeService.getVideoDetails([id]);

        if (!videoDetails || videoDetails.length === 0) {
            return res.status(404).json({
                message: "Vidéo non trouvée"
            });
        }

        const video = videoDetails[0];

        const titleWords = video.snippet.title.split(/\s+/);
        let relatedResources = [];

        for (const word of titleWords) {
            if (word.length > 3) {
                const docs = await DocumentationService.findTechnology(word);
                if (docs.length > 0) {
                    relatedResources = docs.map(doc => ({
                        label: doc.name,
                        url: doc.officialDocumentation || `https://www.google.com/search?q=${encodeURIComponent(doc.name)}+documentation`
                    }));
                    break;
                }
            }
        }

        if (relatedResources.length === 0) {
            relatedResources = [
                { label: 'Voir sur YouTube', url: `https://www.youtube.com/watch?v=${id}` },
                { label: 'Rechercher sur Google', url: `https://www.google.com/search?q=${encodeURIComponent(video.snippet.title)}` }
            ];
        } else {
            relatedResources.push({
                label: 'Voir sur YouTube',
                url: `https://www.youtube.com/watch?v=${id}`
            });
        }

        const videoData = {
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description || "Aucune description disponible.",
            thumbnail: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url || "",
            duration: video.contentDetails?.duration || "PT0S",
            source: "YouTube",
            level: "Tous niveaux",
            popularity: 85,
            tag: video.snippet.channelTitle || "Informatique",
            externalUrl: `https://www.youtube.com/watch?v=${video.id}`
        };

       
        TrackingService.logVideoVisit(req.userId, videoData);

        const response = {
            video: videoData,
            relatedResources: relatedResources
        };

        console.log("Détails de la vidéo envoyés avec succès");
        return res.status(200).json(response);

    } catch (error) {
        console.error("Erreur getVideoDetails:", error);
        return res.status(500).json({
            message: "Erreur lors de la récupération des détails de la vidéo",
            error: error.message
        });
    }
};

// Assistant IA pour une ressource spécifique (vidéo)
module.exports.poserQuestionAssistantSinovaAIRessource = async (req, res) => {
    try {
        const { videoId, message, videoData } = req.body;

        console.log("Question pour l'assistant ressource:", { videoId, message });

        if (!videoId) {
            return res.status(400).json({
                message: "L'ID de la vidéo est requis"
            });
        }

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: "La question ne peut pas être vide"
            });
        }

        if (!videoData) {
            return res.status(400).json({
                message: "Les données de la vidéo sont requises"
            });
        }

        const video = {
            id: videoData.id || videoId,
            snippet: {
                title: videoData.title || "Titre non disponible",
                description: videoData.description || "Description non disponible",
                channelTitle: videoData.tag || videoData.ownerName || "Chaîne non disponible",
            },
            contentDetails: {
                caption: "true"
            }
        };

        const response = await GeminiService.poserQuestionSinovaAIRessource(video, message);

        // ✅ Incrémente le compteur de questions posées pour cette vidéo,
        // uniquement si l'utilisateur est identifié.
        TrackingService.incrementQuestionCount(req.userId, videoId);

        return res.status(200).json({
            message: response
        });

    } catch (error) {
        console.error("Erreur poserQuestionAssistantSinovaAIRessource:", error);
        return res.status(500).json({
            message: "Erreur lors de la discussion avec l'assistant SinovaAI",
            error: error.message
        });
    }
};

// Assistant IA général (sans contexte de ressource)
module.exports.poserQuestionAssistantSinovaAIGeneral = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || !query.trim()) {
            return res.status(400).json({
                message: "La question ne peut pas être vide"
            });
        }

        console.log("Question pour l'assistant général:", query);

        const response = await GeminiService.poserQuestionSinovaAIGeneral(query);

        return res.status(200).json({
            message: response
        });

    } catch (error) {
        console.error("Erreur poserQuestionAssistantSinovaAIGeneral:", error);
        return res.status(500).json({
            message: "Erreur lors de la discussion avec l'assistant SinovaAI",
            error: error.message
        });
    }
};

// ✅ Nouveau : enregistrement du temps passé sur une vidéo
// Appelé par le frontend quand l'utilisateur quitte la page video-detail.
module.exports.trackTimeSpent = async (req, res) => {
    try {
        const { videoId, secondsSpent } = req.body;

        if (!videoId || typeof secondsSpent !== "number") {
            return res.status(400).json({
                message: "videoId et secondsSpent (nombre) sont requis"
            });
        }

        await TrackingService.addWatchTime(req.userId, videoId, secondsSpent);

        return res.status(200).json({ message: "Temps de visionnage enregistré." });

    } catch (error) {
        console.error("Erreur trackTimeSpent:", error);
        return res.status(500).json({
            message: "Erreur lors de l'enregistrement du temps de visionnage",
            error: error.message
        });
    }
};