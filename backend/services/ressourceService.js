const YoutubeService = require("./youtubeService");
const RecommendationService = require("./recommendationService");
const DocumentationService = require("./documentationService");

class RessourceService {

    /**
     * Recherche classique de ressources
     * @param {string} query - La requête de recherche
     * @returns {Promise<Object>}g - Résultats de la recherche
     */
    async resources(query) {
        try {
            //  1. Validation métier ÉLARGIE : on utilise désormais la même
            // logique que la recherche personnalisée (table Technology OU
            // liste de concepts informatiques comme "machine learning",
            // "algorithme", etc.), au lieu d'exiger une correspondance
            // exacte dans la table Technology. C'est ce qui bloquait
            // complètement "Machine Learning" alors que c'est un sujet
            // informatique parfaitement légitime, juste sans documentation
            // officielle dédiée dans notre table.
            const csCheck = await RecommendationService.isComputerScienceQuery(query);

            if (!csCheck.isValid) {
                return {
                    success: false,
                    validTechnology: false,
                    message: csCheck.message,
                    videos: [],
                    documentations: []
                };
            }

            //  2. La documentation officielle devient OPTIONNELLE : son
            // absence ne bloque plus la recherche YouTube.
            const documentations = await DocumentationService.findTechnology(query);

            //  3. Construction d'une requête YouTube désambiguïsée, SANS
            // appel à une IA (pour rester rapide) : si la requête correspond
            // à une technologie connue en base, on enrichit avec son nom
            // exact et sa catégorie pour orienter YouTube vers du contenu
            // pédagogique/informatique plutôt que des vidéos qui contiennent
            // juste le mot par coïncidence (ex: "react" → vidéos de
            // réactions au lieu de la librairie JS).
            let youtubeSearchQuery = query;

            if (documentations.length > 0) {
                const matched = documentations[0];
                youtubeSearchQuery = `${matched.name} ${matched.category} programming tutorial`;
            } else {
                // Sujet informatique valide mais sans doc officielle
                // (ex: "machine learning") : on ajoute quand même un
                // qualificatif générique pour biaiser vers du contenu
                // technique/pédagogique.
                youtubeSearchQuery = `${query} programming tutorial`;
            }

            // 4. Recherche YouTube
            const searchVideos = await YoutubeService.searchVideos(youtubeSearchQuery);

            let videos = [];
            let rankedVideos = [];

            if (searchVideos && searchVideos.length > 0) {
                const ids = searchVideos.map(video => video.id.videoId);
                videos = await YoutubeService.getVideoDetails(ids);
                // ⚠️ Le classement de pertinence reste basé sur la requête
                // ORIGINALE de l'utilisateur (pas la version enrichie) :
                // c'est elle qui doit apparaître dans le titre/la description
                // pour qu'une vidéo soit jugée pertinente.
                rankedVideos = RecommendationService.rankVideos(videos, query);
            }

            // 5. Préparation des vidéos
            const formattedVideos = rankedVideos.map(item => ({
                id: item.video.id,
                title: item.video.snippet.title,
                description: item.video.snippet.description,
                level: "Tous niveaux",
                duration: item.video.contentDetails.duration,
                source: "YouTube",
                popularity: Math.round(item.sinovaScore * 100),
                ownerName: item.video.snippet.channelTitle,
                ownerLogo: "youtube",
                variant: 0,
                thumbnail: item.video.snippet.thumbnails.high.url,
                externalUrl: `https://www.youtube.com/watch?v=${item.video.id}`,
                resourceType: "Vidéo"
            }));

            // 6. Préparation documentations (peut être vide, sans bloquer)
            const formattedDocs = documentations.map(doc => ({
                id: doc.id,
                title: doc.name,
                description: doc.description,
                level: "Documentation officielle",
                duration: null,
                source: "Documentation",
                popularity: null,
                ownerName: doc.name,
                ownerLogo: doc.logo,
                variant: 1,
                thumbnail: doc.logo,
                externalUrl: doc.officialDocumentation,
                resourceType: "Documentation officielle"
            }));

            // 7. Résultat final
            return {
                success: true,
                validTechnology: true,
                message: null,
                videos: formattedVideos,
                documentations: formattedDocs
            };

        } catch (error) {
            console.error("Erreur lors de la recherche classique:", error);
            return {
                success: false,
                validTechnology: false,
                message: "Une erreur est survenue lors de la recherche.",
                videos: [],
                documentations: []
            };
        }
    }

    /**
     * Recherche personnalisée de ressources
     * @param {Object} recommendation - Objet de recommandation personnalisée
     * @returns {Promise<Object>} - Résultats de la recherche personnalisée
     */
    async personalizedResources(recommendation) {
        try {
            const {
                youtubeQuery,
                documentationQuery,
                searchYoutube,
                searchDocumentation,
                isValidComputerScience,
                hasDocumentation,
                technologies,
                error
            } = recommendation;

            let formattedVideos = [];
            let formattedDocs = [];
            let message = null;
            let success = true;
            let validTechnology = true;

            // 1. Vérification initiale
            if (!isValidComputerScience) {
                return {
                    success: false,
                    validTechnology: false,
                    message: error || "Cette recherche ne correspond à aucun sujet informatique.",
                    videos: [],
                    documentations: []
                };
            }

            // 2. Recherche de documentations
            if (searchDocumentation) {
                if (hasDocumentation && technologies && technologies.length > 0) {
                    formattedDocs = technologies.map(doc => ({
                        id: doc.id,
                        title: doc.name,
                        description: doc.description,
                        level: "Documentation officielle",
                        duration: null,
                        source: "Documentation",
                        popularity: null,
                        ownerName: doc.name,
                        ownerLogo: doc.logo,
                        variant: 1,
                        thumbnail: doc.logo,
                        externalUrl: doc.officialDocumentation,
                        resourceType: "Documentation officielle"
                    }));
                } else {
                    message = "Ce sujet appartient à l'informatique mais aucune documentation officielle n'est actuellement disponible.";
                    validTechnology = true;
                }
            }

            // 3. Recherche YouTube
            // Même logique d'enrichissement que la recherche classique :
            // si une techno connue correspond, on précise nom + catégorie
            // pour réduire les résultats hors-sujet.
            if (searchYoutube) {
                let enrichedYoutubeQuery = youtubeQuery;

                if (technologies && technologies.length > 0) {
                    const matched = technologies[0];
                    enrichedYoutubeQuery = `${matched.name} ${matched.category} ${youtubeQuery}`;
                }

                const searchVideos = await YoutubeService.searchVideos(enrichedYoutubeQuery);

                if (searchVideos && searchVideos.length > 0) {
                    const ids = searchVideos.map(video => video.id.videoId);
                    const videos = await YoutubeService.getVideoDetails(ids);
                    const rankedVideos = RecommendationService.rankVideos(videos, documentationQuery || youtubeQuery);

                    formattedVideos = rankedVideos.map(item => ({
                        id: item.video.id,
                        title: item.video.snippet.title,
                        description: item.video.snippet.description,
                        level: "Tous niveaux",
                        duration: item.video.contentDetails.duration,
                        source: "YouTube",
                        popularity: Math.round(item.sinovaScore * 100),
                        ownerName: item.video.snippet.channelTitle,
                        ownerLogo: "youtube",
                        variant: 0,
                        thumbnail: item.video.snippet.thumbnails.high.url,
                        externalUrl: `https://www.youtube.com/watch?v=${item.video.id}`,
                        resourceType: "Vidéo"
                    }));
                }
            }

            // 4. Gestion des cas particuliers
            if (searchDocumentation && formattedDocs.length === 0 && formattedVideos.length > 0) {
                message = "Aucune documentation officielle trouvée, mais des vidéos sont disponibles.";
                validTechnology = true;
            }

            if (searchYoutube && formattedVideos.length === 0 && formattedDocs.length > 0) {
                message = "Aucune vidéo trouvée, mais des documentations sont disponibles.";
                validTechnology = true;
            }

            if (formattedDocs.length === 0 && formattedVideos.length === 0) {
                if (searchDocumentation && !searchYoutube) {
                    if (!message) {
                        message = "Aucune documentation officielle n'est disponible pour ce sujet.";
                    }
                } else if (searchYoutube && !searchDocumentation) {
                    message = "Aucune vidéo n'a été trouvée pour ce sujet.";
                } else {
                    message = "Aucune ressource n'a été trouvée pour ce sujet.";
                }
                success = false;
            }

            // 5. Résultat final
            return {
                success: success,
                validTechnology: validTechnology,
                message: message,
                videos: formattedVideos,
                documentations: formattedDocs
            };

        } catch (error) {
            console.error("Erreur lors de la recherche personnalisée:", error);
            return {
                success: false,
                validTechnology: false,
                message: "Une erreur est survenue lors de la recherche personnalisée.",
                videos: [],
                documentations: []
            };
        }
    }
}

module.exports = new RessourceService();