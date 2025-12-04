import axios from 'axios';

const baseURL = 'http://localhost:3000';

export async function verifyBackendRoutes() {
  const api = axios.create({ baseURL });
  
  const routes = {
    'attractions': ['/attractions', '/atractivos'],
    'restaurants': ['/restaurants', '/restaurantes'],
    'events': ['/events', '/eventos'],
    'hotels': ['/hotels'],
    'foods': ['/foods'],
    'announcements': ['/announcements', '/anuncios'],
    'pois': ['/pois', '/puntos'],
    'users': ['/user', '/users'],
    'reviews': ['/reviews', '/resenas'],
  };

  const verified = {};

  for (const [key, paths] of Object.entries(routes)) {
    for (const path of paths) {
      try {
        await api.get(path);
        verified[key] = path;
        console.log(`✅ ${key} → ${path}`);
        break;
      } catch (err) {
        if (err.response?.status !== 404) {
          verified[key] = path;
          console.log(`✅ ${key} → ${path} (AUTH REQUIRED)`);
          break;
        }
      }
    }
    if (!verified[key]) {
      console.warn(`❌ ${key} - no encontrado en ningún path`);
    }
  }

  return verified;
}

export default verifyBackendRoutes;
