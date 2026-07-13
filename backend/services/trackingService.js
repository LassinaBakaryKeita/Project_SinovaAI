const { prisma } = require("../config/prisma");

// Convertit une durée ISO-8601 (ex: "PT12M30S") en secondes.
function parseDurationToSeconds(isoDuration) {
  if (!isoDuration) return 0;

  const match = isoDuration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return 0;

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return hours * 3600 + minutes * 60 + seconds;
}

class TrackingService {

  /**
   * Enregistre une recherche effectuée par l'utilisateur (classique ou
   * personnalisée), qu'elle ait abouti ou non — une recherche qui échoue
   * est une donnée tout aussi utile pour entraîner un futur modèle de
   * recommandation.
   */
  async logSearchHistory(userId, motCle, typeRecherche) {
    if (!userId || !motCle?.trim()) return;

    try {
      await prisma.searchHistory.create({
        data: {
          userId,
          motCle: motCle.trim(),
          typeRecherche
        }
      });
    } catch (error) {
      // On ne bloque jamais la réponse principale pour un souci de logging.
      console.error("Erreur lors de l'enregistrement de l'historique de recherche:", error);
    }
  }

  _buildExternalId(source, externalResourceId) {
    return source === "YouTube"
      ? `youtube:${externalResourceId}`
      : `doc:${externalResourceId}`;
  }

  async _upsertRessource({ externalId, titre, description, duree, source, popularity, proprietaire, niveauDifficulte }) {
    return prisma.ressource.upsert({
      where: { externalId },
      update: {
        titre,
        description,
        popularity: popularity ?? 0
      },
      create: {
        externalId,
        titre: titre || "Titre non disponible",
        description: description || "",
        duree: duree || 0,
        source,
        popularity: popularity ?? 0,
        proprietaire: proprietaire || "Inconnu",
        niveauDifficulte: niveauDifficulte || "Tous niveaux"
      }
    });
  }

  /**
   * Appelé quand un utilisateur consulte une vidéo (arrivée sur la page
   * video-detail). Crée/retrouve la Ressource correspondante, met à jour
   * la date de consultation, et marque le feedback de recommandation
   * comme "cliqué".
   */
  async logVideoVisit(userId, videoData) {
    if (!userId || !videoData?.id) return null;

    try {
      const externalId = this._buildExternalId("YouTube", videoData.id);

      const ressource = await this._upsertRessource({
        externalId,
        titre: videoData.title,
        description: videoData.description,
        duree: parseDurationToSeconds(videoData.duration),
        source: "YouTube",
        popularity: videoData.popularity,
        proprietaire: videoData.tag,
        niveauDifficulte: videoData.level
      });

      await prisma.userActivity.upsert({
        where: { userId_ressourceId: { userId, ressourceId: ressource.id } },
        update: { dateConsultation: new Date() },
        create: { userId, ressourceId: ressource.id }
      });

      await prisma.recommendationFeedback.upsert({
        where: { userId_ressourceId: { userId, ressourceId: ressource.id } },
        update: { clique: true },
        create: { userId, ressourceId: ressource.id, clique: true }
      });

      return ressource;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la visite vidéo:", error);
      return null;
    }
  }

  /**
   * Incrémente le nombre de questions posées à l'assistant IA pour une
   * vidéo donnée. Si la visite n'a pas encore été enregistrée (cas rare),
   * on ne fait rien plutôt que de créer une activité incomplète.
   */
  async incrementQuestionCount(userId, youtubeVideoId) {
    if (!userId || !youtubeVideoId) return;

    try {
      const externalId = this._buildExternalId("YouTube", youtubeVideoId);
      const ressource = await prisma.ressource.findUnique({ where: { externalId } });
      if (!ressource) return;

      await prisma.userActivity.update({
        where: { userId_ressourceId: { userId, ressourceId: ressource.id } },
        data: { nombreQuestionIA: { increment: 1 } }
      });
    } catch (error) {
      console.error("Erreur lors de l'incrémentation du nombre de questions IA:", error);
    }
  }

  /**
   * Ajoute du temps de visionnage (en secondes) à une vidéo pour un
   * utilisateur donné. Additionne au temps déjà enregistré (n'écrase pas).
   */
  async addWatchTime(userId, youtubeVideoId, secondsSpent) {
    const roundedSeconds = Math.round(secondsSpent);
    if (!userId || !youtubeVideoId || !roundedSeconds || roundedSeconds <= 0) return;

    try {
      const externalId = this._buildExternalId("YouTube", youtubeVideoId);
      const ressource = await prisma.ressource.findUnique({ where: { externalId } });
      if (!ressource) return;

      await prisma.userActivity.update({
        where: { userId_ressourceId: { userId, ressourceId: ressource.id } },
        data: { tempsPasse: { increment: roundedSeconds } }
      });

      await prisma.recommendationFeedback.update({
        where: { userId_ressourceId: { userId, ressourceId: ressource.id } },
        data: { tempsVisionnage: { increment: roundedSeconds } }
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du temps de visionnage:", error);
    }
  }
}

module.exports = new TrackingService();