const { prisma } = require("../config/prisma");
const DocumentationService = require("./documentationService");

/**
 * Vérifie si une requête appartient au domaine de l'informatique
 * @param {string} query - La requête de recherche
 * @returns {Promise<Object>} - { isValid: boolean, message: string }
 */
async function isComputerScienceQuery(query) {
    if (!query || !query.trim()) {
        return { isValid: false, message: "Veuillez saisir un sujet de recherche." };
    }

    const normalizedQuery = query.toLowerCase().trim();

    // Vérification dans la base de données des technologies
    try {
        const technologies = await prisma.technology.findMany({
            select: { name: true }
        });

        const technologyFound = technologies.some(technology =>
            normalizedQuery.includes(technology.name.toLowerCase())
        );

        if (technologyFound) {
            return { isValid: true, message: "Technologie trouvée." };
        }
    } catch (error) {
        console.error("Erreur lors de la vérification des technologies:", error);
    }

    // Vérification dans la liste statique des concepts informatiques
    const concepts = [
        "array", "list", "tuple", "dictionary", "map", "set",
        "stack", "queue", "tree", "binary tree", "graph",
        "linked list", "hash table", "hashmap",
        "class", "object", "interface", "inheritance",
        "encapsulation", "polymorphism", "abstraction",
        "algorithm", "algorithme", "sorting", "search",
        "binary search", "recursion", "dynamic programming",
        "greedy", "backtracking",
        "variable", "constant", "function", "method",
        "parameter", "argument", "loop", "for", "while",
        "if", "else", "switch", "exception", "thread",
        "process", "pointer", "reference", "memory",
        "compiler", "interpreter", "syntax", "runtime",
        "debugging", "bug",
        "callback", "promise", "async", "await",
        "closure", "event loop",
        "frontend", "backend", "fullstack", "api", "rest",
        "graphql", "http", "https", "json", "xml",
        "cookie", "session", "jwt",
        "database", "sql", "nosql", "transaction", "index",
        "query", "join", "primary key", "foreign key",
        "machine learning", "deep learning", "artificial intelligence",
        "intelligence artificielle", "neural network",
        "computer vision", "vision par ordinateur", "nlp",
        "llm", "transformer", "embedding", "token",
        "prompt engineering", "rag", "fine tuning",
        "data science", "data analysis", "data analytics",
        "big data", "feature engineering", "classification",
        "regression", "clustering",
        "cybersecurity", "cybersécurité", "ethical hacking",
        "penetration testing", "encryption", "cryptography",
        "firewall",
        "network", "tcp", "udp", "dns", "ip", "socket", "port",
        "devops", "ci/cd", "container", "virtual machine",
        "uml", "design pattern", "architecture",
        "software engineering", "génie logiciel",
        "programmation", "développement", "informatique", "logiciel",
        "programación", "desarrollo", "informática",
        "برمجة", "البرمجة", "الذكاء الاصطناعي",
        "تعلم الآلة", "علوم البيانات",
        "difference between", "différence entre", "versus", "vs"
    ];

    const conceptFound = concepts.some(concept =>
        normalizedQuery.includes(concept.toLowerCase())
    );

    if (conceptFound) {
        return { isValid: true, message: "Concept informatique trouvé." };
    }

    // Aucun match - retour avec message de suggestion
    return {
        isValid: false,
        message: `"${query}" n'est pas un sujet lié à l'informatique. SinovaAI se concentre sur les technologies informatiques comme : Python, JavaScript, React, Machine Learning, etc.`
    };
}

/**
 * Calcule le score SES (Sinova Engagement Score)
 */
function calculateSES(video, query) {
    try {
        const { statistics, snippet } = video;

        if (!statistics || !snippet) {
            return 0;
        }

        const viewCount = parseInt(statistics.viewCount) || 0;
        const likeCount = parseInt(statistics.likeCount) || 0;
        const commentCount = parseInt(statistics.commentCount) || 0;

        const totalEngagement = viewCount + likeCount + commentCount;
        if (totalEngagement === 0) {
            return 0;
        }

        const likeRatio = viewCount > 0 ? likeCount / viewCount : 0;
        const commentRatio = viewCount > 0 ? commentCount / viewCount : 0;

        let score = 0;
        const viewScore = Math.min(viewCount / 1000000, 1) * 0.5;
        score += viewScore;
        const likeScore = Math.min(likeRatio * 10, 1) * 0.3;
        score += likeScore;
        const commentScore = Math.min(commentRatio * 20, 1) * 0.2;
        score += commentScore;

        if (viewCount < 100) {
            score *= 0.5;
        }

        if (likeRatio > 0.05) {
            score *= 1.1;
        }

        const titleMatch = snippet.title?.toLowerCase().includes(query.toLowerCase());
        const descMatch = snippet.description?.toLowerCase().includes(query.toLowerCase());

        if (titleMatch || descMatch) {
            score *= 1.1;
        }

        return Math.min(Math.max(score, 0), 1);

    } catch (error) {
        console.error("Erreur lors du calcul SES:", error);
        return 0;
    }
}

/**
 * Calcule le score de pertinence d'une vidéo par rapport à une requête
 */
function calculatePertinence(video, query) {
    try {
        if (!video || !video.snippet) {
            return 0;
        }

        const { title, description } = video.snippet;
        const normalizedQuery = query.toLowerCase().trim();
        const normalizedTitle = title?.toLowerCase() || '';
        const normalizedDescription = description?.toLowerCase() || '';

        const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 2);

        if (queryWords.length === 0) {
            return 0.5;
        }

        let titleMatches = 0;
        let descriptionMatches = 0;

        for (const word of queryWords) {
            if (normalizedTitle.includes(word)) {
                titleMatches++;
            }
            if (normalizedDescription.includes(word)) {
                descriptionMatches++;
            }
        }

        const titleScore = queryWords.length > 0 ? titleMatches / queryWords.length : 0;
        const descScore = queryWords.length > 0 ? descriptionMatches / queryWords.length : 0;

        let score = (titleScore * 0.7) + (descScore * 0.3);

        if (normalizedTitle.includes(normalizedQuery)) {
            score += 0.3;
        }

        if (normalizedDescription.includes(normalizedQuery)) {
            score += 0.1;
        }

        return Math.min(Math.max(score, 0), 1);

    } catch (error) {
        console.error("Erreur lors du calcul de pertinence:", error);
        return 0;
    }
}

/**
 * Classe les vidéos par score combiné (SES + Pertinence)
 */
function rankVideos(videos, query) {
    if (!Array.isArray(videos) || videos.length === 0) {
        return [];
    }

    try {
        const ranked = videos.map(video => {
            const sesScore = calculateSES(video, query);
            const pertinenceScore = calculatePertinence(video, query);
            const sinovaScore = (pertinenceScore * 0.6) + (sesScore * 0.4);

            return {
                video,
                sesScore,
                pertinenceScore,
                sinovaScore: Math.min(Math.max(sinovaScore, 0), 1)
            };
        });

        return ranked.sort((a, b) => b.sinovaScore - a.sinovaScore);

    } catch (error) {
        console.error("Erreur lors du classement des vidéos:", error);
        return [];
    }
}

/**
 * Personnalise la recherche en fonction des préférences utilisateur
 */
async function personalizeSearch(
    query,
    level,
    objectives,
    styles,
    availability,
    language
) {
    if (!query || !query.trim()) {
        return {
            youtubeQuery: '',
            documentationQuery: '',
            searchYoutube: false,
            searchDocumentation: false,
            isValidComputerScience: false,
            hasDocumentation: false,
            technologies: [],
            error: 'Veuillez saisir un sujet de recherche.'
        };
    }

    const trimmedQuery = query.trim();

    // Vérification si le sujet est en informatique
    const csCheck = await isComputerScienceQuery(trimmedQuery);
    const isValidComputerScience = csCheck.isValid;

    if (!isValidComputerScience) {
        return {
            youtubeQuery: '',
            documentationQuery: '',
            searchYoutube: false,
            searchDocumentation: false,
            isValidComputerScience: false,
            hasDocumentation: false,
            technologies: [],
            error: csCheck.message || `"${trimmedQuery}" n'est pas un sujet lié à l'informatique.`
        };
    }

    // Recherche des technologies correspondantes
    const technologies = await DocumentationService.findTechnology(trimmedQuery);
    const hasDocumentation = technologies.length > 0;

    // Construction de la requête YouTube avec les filtres
    let youtubeQuery = trimmedQuery;

    if (objectives && Array.isArray(objectives) && objectives.length > 0) {
        const objectiveKeywords = {
            'Backend': 'backend programming',
            'Frontend': 'frontend development',
            'Data Science': 'data science',
            'IA': 'machine learning artificial intelligence',
            'Mobile': 'mobile development'
        };

        const objectiveTerms = objectives
            .map(obj => objectiveKeywords[obj] || obj)
            .filter(Boolean)
            .join(' ');

        if (objectiveTerms) {
            youtubeQuery += ` ${objectiveTerms}`;
        }
    }

    if (level) {
        const levelMap = {
            'Débutant': 'beginner tutorial',
            'Intermédiaire': 'intermediate tutorial',
            'Avancé': 'advanced tutorial'
        };
        youtubeQuery += ` ${levelMap[level] || level}`;
    }

    if (language === 'Français') {
        youtubeQuery += ' french';
    } else if (language === 'English') {
        youtubeQuery += ' english';
    }

    const stylesArray = Array.isArray(styles) ? styles : [];

    const searchYoutube = stylesArray.some(style =>
        style === 'Vidéos' || style === 'Mixte' || style === 'Videos'
    );
    const searchDocumentation = stylesArray.some(style =>
        style === 'Documentation' || style === 'Mixte'
    );

    return {
        youtubeQuery: youtubeQuery.trim(),
        documentationQuery: trimmedQuery,
        searchYoutube: searchYoutube,
        searchDocumentation: searchDocumentation,
        isValidComputerScience: true,
        hasDocumentation: hasDocumentation,
        technologies: technologies,
        error: null
    };
}

module.exports = {
    isComputerScienceQuery,
    calculateSES,
    calculatePertinence,
    rankVideos,
    personalizeSearch
};