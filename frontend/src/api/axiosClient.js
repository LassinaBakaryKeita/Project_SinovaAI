import axios from 'axios';

// ✅ Instance axios qui attache automatiquement le header Authorization
// à chaque requête, si un token est présent dans localStorage.
// Remplace simplement `import axios from 'axios'` par
// `import axios from '<chemin vers ce fichier>'` dans chaque fichier qui
// fait des appels API — le reste du code (BASE_URL, params, etc.) ne change pas.
const axiosClient = axios.create();

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;