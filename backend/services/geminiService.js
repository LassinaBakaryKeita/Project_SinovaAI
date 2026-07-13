const { GoogleGenAI } = require("@google/genai");
const { getSubtitles } = require("youtube-caption-extractor");
require("dotenv").config();

// Service d'intégration avec l'API Gemini de Google
class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY manquante dans les variables d'environnement");
    }

    this.client = new GoogleGenAI({ apiKey: this.apiKey });

    // Deux modèles utilisés : le principal (qualité) et un de secours (quota plus large)
    this.models = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
    
    this.defaultConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    };
  }

  // Répond à une question générale sans contexte de ressource
  async poserQuestionSinovaAIGeneral(query) {
    try {
      this._validateQuery(query);
      const prompt = this._buildGeneralPrompt(query);
      const response = await this._askGemini(prompt);
      return response;
    } catch (error) {
      console.error("Erreur dans poserQuestionSinovaAIGeneral:", error);
      throw new Error(error.message || "Erreur lors de la génération de la réponse");
    }
  }

  // Répond à une question en contexte de vidéo (avec ou sans transcription)
  async poserQuestionSinovaAIRessource(video, query) {
    try {
      this._validateQuery(query);
      this._validateVideo(video);

      const metadata = this._extractVideoMetadata(video);

      let transcript = null;
      let hasTranscript = false;

      // Extraction des sous-titres si disponibles
      if (video.contentDetails?.caption === "true") {
        try {
          transcript = await this._extractTranscript(video.id);
          hasTranscript = transcript !== null && transcript.length > 0;
        } catch (error) {
          console.warn(`Impossible d'extraire les sous-titres pour ${video.id}:`, error.message);
          transcript = null;
        }
      }

      const prompt = this._buildResourcePrompt(metadata, transcript, hasTranscript, query);
      const response = await this._askGemini(prompt);

      return response;
    } catch (error) {
      console.error("Erreur dans poserQuestionSinovaAIRessource:", error);
      throw new Error(error.message || "Erreur lors de la génération de la réponse");
    }
  }

  // Validation de la question
  _validateQuery(query) {
    if (!query || typeof query !== "string" || !query.trim()) {
      throw new Error("La question ne peut pas être vide");
    }
  }

  // Validation des données vidéo
  _validateVideo(video) {
    if (!video || typeof video !== "object") {
      throw new Error("L'objet vidéo est invalide");
    }
    if (!video.id) {
      throw new Error("L'ID de la vidéo est manquant");
    }
    if (!video.snippet) {
      throw new Error("Les métadonnées de la vidéo sont manquantes");
    }
  }

  // Extraction des métadonnées de la vidéo
  _extractVideoMetadata(video) {
    return {
      id: video.id,
      title: video.snippet.title || "Titre non disponible",
      description: video.snippet.description || "Description non disponible",
      channelTitle: video.snippet.channelTitle || "Chaîne non disponible",
      hasCaptions: video.contentDetails?.caption === "true",
    };
  }

  // Récupération de la transcription de la vidéo
  async _extractTranscript(videoId) {
    try {
      const captions = await getSubtitles({ videoID: videoId, lang: "fr" });

      if (!captions || captions.length === 0) {
        return null;
      }

      const transcript = captions
        .map(caption => caption.text || caption)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      return transcript || null;
    } catch (error) {
      console.warn(`Erreur d'extraction des sous-titres pour ${videoId}:`, error.message);
      return null;
    }
  }

  // Construction du prompt pour une question générale
  _buildGeneralPrompt(query) {
    return `
${this._getSystemPrompt()}

## QUESTION DE L'ÉTUDIANT

${query.trim()}

## INSTRUCTIONS SPÉCIFIQUES

Répondez à cette question de manière claire, pédagogique et adaptée au niveau de l'étudiant.

- Soyez encourageant et bienveillant
- Utilisez des exemples concrets si nécessaire
- Proposez des exercices ou des ressources complémentaires si pertinent
- Si la question est hors sujet, refusez poliment et expliquez que SinovaAI est spécialisé en informatique
`;
  }

  // Construction du prompt pour une question en contexte de vidéo
  _buildResourcePrompt(metadata, transcript, hasTranscript, query) {
    let transcriptSection = "";
    let contextNotice = "";

    if (hasTranscript && transcript) {
      const maxTranscriptLength = 8000;
      const truncatedTranscript = transcript.length > maxTranscriptLength
        ? transcript.substring(0, maxTranscriptLength) + "... (transcription tronquée)"
        : transcript;

      transcriptSection = `
## TRANSCRIPTION DE LA VIDÉO

${truncatedTranscript}
`;

      contextNotice = `
Utilisez la transcription comme source principale pour répondre à la question.
`;
    } else {
      transcriptSection = `
## TRANSCRIPTION DE LA VIDÉO

Aucune transcription disponible pour cette vidéo.
`;
      contextNotice = `
Cette vidéo ne possède pas de transcription exploitable. Répondez uniquement à partir du titre, de la description et de vos connaissances en informatique.
`;
    }

    return `
${this._getSystemPrompt()}

## CONTEXTE VIDÉO

### Titre
${metadata.title}

### Chaîne
${metadata.channelTitle}

### Description
${metadata.description}

### Sous-titres disponibles
${metadata.hasCaptions ? "Oui" : "Non"}
${transcriptSection}
${contextNotice}

## QUESTION DE L'ÉTUDIANT

${query.trim()}

## INSTRUCTIONS SPÉCIFIQUES

Répondez à cette question en vous basant sur les informations disponibles.

- Si une transcription est disponible, utilisez-la comme source principale
- Si aucune transcription n'est disponible, basez-vous sur le titre, la description et vos connaissances
- Soyez honnête sur ce que vous savez et ce que vous ne savez pas
- N'inventez PAS d'informations
- Restez pédagogique, encourageant et adapté au niveau de l'étudiant
`;
  }

  // Prompt système définissant le rôle et le comportement de l'assistant
  _getSystemPrompt() {
    return `
# SYSTÈME : SinovaAI - Assistant Pédagogique

## IDENTITÉ

Vous êtes **SinovaAI**, un assistant pédagogique spécialisé en informatique.

Vous êtes à la fois :
- Un enseignant patient qui explique avec clarté
- Un mentor bienveillant qui encourage et motive
- Un coach de programmation qui donne des conseils pratiques
- Un guide qui aide les étudiants à progresser pas à pas

SinovaAI est une plateforme d'apprentissage des langages informatiques qui utilise l'IA pour aider les étudiants à apprendre plus intelligemment.

## VOTRE MISSION

Votre mission est d'aider les étudiants à comprendre et maîtriser les concepts informatiques en :

1. Expliquant simplement : Rendez les concepts complexes accessibles
2. Adaptant votre discours : Ajustez-vous au niveau de l'étudiant
3. Donnant des exemples concrets : Illustrez chaque concept avec des exemples pratiques
4. Proposant des exercices : Suggérez des exercices pour renforcer l'apprentissage
5. Utilisant des analogies : Créez des ponts entre les concepts abstraits et la réalité
6. Encourageant l'apprentissage : Motivez l'étudiant à persévérer

## DOMAINES DE COMPÉTENCE

Programmation, Génie logiciel, Algorithmique, Intelligence Artificielle, Bases de données, Réseaux, Cybersécurité, Cloud & DevOps, Développement Web, Développement Mobile.

## RÈGLES DE COMPORTEMENT

À FAIRE :
- Expliquer de manière claire et structurée
- Utiliser des exemples de code quand c'est pertinent
- Adapter le niveau de difficulté à l'étudiant
- Encourager et motiver l'étudiant
- Proposer des exercices pratiques
- Reconnaître quand vous ne savez pas

À NE PAS FAIRE :
- Répondre à des questions hors informatique
- Être condescendant ou impatient
- Inventer des informations

## GESTION DES SUJETS HORS CADRE

Si un étudiant pose une question hors du domaine de l'informatique, refusez poliment et expliquez que SinovaAI est spécialisé en informatique.

## TON ET STYLE

- Ton : Amical, professionnel et encourageant
- Style : Pédagogique, structuré et accessible
`;
  }

  // Appel à l'API Gemini avec gestion des erreurs et fallback entre modèles
  async _askGemini(prompt, modelIndex = 0, attempt = 1) {
    const MAX_ATTEMPTS = 3;
    const RETRY_DELAYS = [1000, 3000];

    const currentModel = this.models[modelIndex];

    try {
      const response = await this.client.models.generateContent({
        model: currentModel,
        contents: prompt,
        config: this.defaultConfig,
      });

      const text = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("Gemini n'a pas retourné de réponse valide");
      }

      if (modelIndex > 0) {
        console.log(`Réponse générée via le modèle de secours : ${currentModel}`);
      }

      return text.trim();
    } catch (error) {
      const isOverloaded =
        error?.status === 503 ||
        error?.status === "UNAVAILABLE" ||
        (typeof error?.message === "string" && error.message.includes("UNAVAILABLE"));

      const isQuotaExceeded =
        error?.status === 429 ||
        error?.status === "RESOURCE_EXHAUSTED" ||
        (typeof error?.message === "string" &&
          (error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("429")));

      // Si quota épuisé, on bascule sur le modèle de secours
      if (isQuotaExceeded && modelIndex < this.models.length - 1) {
        console.warn(
          `Quota épuisé sur ${currentModel}, bascule sur ${this.models[modelIndex + 1]}...`
        );
        return this._askGemini(prompt, modelIndex + 1, 1);
      }

      // Si service surchargé, on réessaie le même modèle
      if (isOverloaded && attempt < MAX_ATTEMPTS) {
        const delay = RETRY_DELAYS[attempt - 1] || 3000;
        console.warn(
          `${currentModel} est surchargé (tentative ${attempt}/${MAX_ATTEMPTS}), nouvel essai dans ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this._askGemini(prompt, modelIndex, attempt + 1);
      }

      // Si le modèle actuel est surchargé et qu'un secours existe
      if (isOverloaded && modelIndex < this.models.length - 1) {
        console.warn(
          `${currentModel} reste indisponible, bascule sur ${this.models[modelIndex + 1]}...`
        );
        return this._askGemini(prompt, modelIndex + 1, 1);
      }

      console.error(`Erreur lors de l'appel à Gemini (${currentModel}):`, error);

      if (isQuotaExceeded) {
        throw new Error(
          "Le quota gratuit de l'assistant IA est épuisé pour aujourd'hui. Merci de réessayer demain."
        );
      }

      if (isOverloaded) {
        throw new Error(
          "Le service IA est momentanément surchargé. Merci de réessayer dans quelques instants."
        );
      }

      throw new Error(error.message || "Échec de la communication avec Gemini");
    }
  }
}

module.exports = new GeminiService();