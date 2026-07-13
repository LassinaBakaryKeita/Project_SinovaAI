const axios = require("axios");

const BASE_URL = "https://www.googleapis.com/youtube/v3";

class YoutubeService {

    async searchVideos(query, maxResults = 20) {

        try {

            const response = await axios.get(`${BASE_URL}/search`, {
                params: {
                    key: process.env.YOUTUBE_DATA_API_KEY,
                    part: "snippet",
                    q: query,
                    type: "video",
                    maxResults
                }
            });

            return response.data.items;

        } catch (error) {

            console.error(
                "Erreur YouTube API :",
                error.response?.data || error.message
            );

            throw new Error("Impossible de récupérer les vidéos.");

        }

    }

    async getVideoDetails(videoIds) {

        try {

            const ids = videoIds.join(",");

            const response = await axios.get(`${BASE_URL}/videos`, {
                params: {
                    key: process.env.YOUTUBE_DATA_API_KEY,
                    part: "snippet,statistics,contentDetails",
                    id: ids
                }
            });

            return response.data.items;

        } catch (error) {

            console.error(
                "Erreur YouTube API :",
                error.response?.data || error.message
            );

            throw new Error("Impossible de récupérer les détails des vidéos.");

        }

    }

}

module.exports = new YoutubeService();