const { prisma } = require("../config/prisma");

class DocumentationService {

    /**
     * Recherche une technologie dans la base de données
     * @param {string} query - La requête de recherche
     * @returns {Promise<Array>} - Liste des technologies trouvées
     */
    async findTechnology(query) {
      
        // Vérification de la requête
        if (!query || !query.trim()) {
            return [];
        }

        try {
          
            // Découpage de la recherche
   
            const mots = query
                .trim()
                .toLowerCase()
                .split(/\s+/)
                .filter(Boolean);

            if (mots.length === 0) {
                return [];
            }

            
            // Recherche optimisée avec Prisma
            // On recherche toutes les technologies dont le slug correspond à un des mots
            const technologies = await prisma.technology.findMany({
                where: {
                    slug: {
                        in: mots,
                        mode: "insensitive"
                    }
                }
            });

           
            // Si aucune technologie exacte n'est trouvée,
            // on essaie une recherche plus flexible
            if (technologies.length === 0) {
                // Recherche partielle sur le nom
                const partialMatch = await prisma.technology.findMany({
                    where: {
                        OR: mots.map(mot => ({
                            name: {
                                contains: mot,
                                mode: "insensitive"
                            }
                        }))
                    }
                });

                // Éliminer les doublons
                const uniqueTechnologies = new Map();
                for (const tech of partialMatch) {
                    uniqueTechnologies.set(tech.id, tech);
                }

                return [...uniqueTechnologies.values()];
            }

            
            // Résultat final (sans doublons)
            const uniqueTechnologies = new Map();
            for (const tech of technologies) {
                uniqueTechnologies.set(tech.id, tech);
            }

            return [...uniqueTechnologies.values()];

        } catch (error) {
            console.error("Erreur lors de la recherche de technologies:", error);
            return [];
        }
    }

    /**
     * Recherche une technologie par son nom exact
     * @param {string} name - Le nom de la technologie
     * @returns {Promise<Object|null>} - La technologie trouvée ou null
     */
    async findTechnologyByName(name) {
        if (!name || !name.trim()) {
            return null;
        }

        try {
            return await prisma.technology.findFirst({
                where: {
                    name: {
                        equals: name.trim(),
                        mode: "insensitive"
                    }
                }
            });
        } catch (error) {
            console.error("Erreur lors de la recherche par nom:", error);
            return null;
        }
    }

    /**
     * Recherche plusieurs technologies par leurs noms
     * @param {Array} names - Liste des noms de technologies
     * @returns {Promise<Array>} - Liste des technologies trouvées
     */
    async findTechnologiesByNames(names) {
        if (!Array.isArray(names) || names.length === 0) {
            return [];
        }

        try {
            const sanitizedNames = names
                .filter(name => name && name.trim())
                .map(name => name.trim());

            if (sanitizedNames.length === 0) {
                return [];
            }

            const technologies = await prisma.technology.findMany({
                where: {
                    name: {
                        in: sanitizedNames,
                        mode: "insensitive"
                    }
                }
            });

            return technologies;
        } catch (error) {
            console.error("Erreur lors de la recherche par noms:", error);
            return [];
        }
    }
}

module.exports = new DocumentationService();



