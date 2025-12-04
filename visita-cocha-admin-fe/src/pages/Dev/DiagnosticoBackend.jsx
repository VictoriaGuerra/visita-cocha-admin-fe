import React, { useState } from 'react';
import axios from 'axios';

export default function DiagnosticoBackend() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const checkRoute = async (name, paths) => {
    const api = axios.create({ baseURL: 'http://localhost:3000' });
    
    for (const path of paths) {
      try {
        const res = await api.get(path, {
          headers: { Authorization: 'Bearer test' }
        });
        return { found: true, path, status: res.status };
      } catch (err) {
        if (err.code === 'ERR_NETWORK') {
          return { found: false, path, error: 'No hay conexión al backend' };
        }
        if (err.response?.status === 401 || err.response?.status === 403) {
          return { found: true, path, status: err.response.status, auth: true };
        }
        if (err.response?.status === 404) {
          continue;
        }
        return { found: false, path, status: err.response?.status };
      }
    }
    return { found: false, paths, error: 'Ninguno existe' };
  };

  const testAll = async () => {
    setLoading(true);
    const routes = {
      'Atractivos': ['/attractions', '/atractivos'],
      'Restaurantes': ['/restaurants', '/restaurantes'],
      'Eventos': ['/events', '/eventos'],
      'Hoteles': ['/hotels'],
      'Comidas': ['/foods'],
      'Anuncios': ['/announcements', '/anuncios'],
      'Puntos': ['/pois', '/puntos'],
      'Usuarios': ['/user', '/users'],
      'Reseñas': ['/reviews', '/resenas'],
      'Categorías Atracciones': ['/attraction-categories'],
      'Categorías Restaurantes': ['/restaurant-categories'],
      'Categorías Principales': ['/main-categories'],
    };

    const data = {};
    for (const [name, paths] of Object.entries(routes)) {
      data[name] = await checkRoute(name, paths);
    }
    setResults(data);
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🔍 Diagnóstico del Backend</h2>
      <p>Verifica qué rutas tiene tu backend activo en localhost:3000</p>
      
      <button onClick={testAll} disabled={loading} style={{
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px'
      }}>
        {loading ? 'Verificando...' : 'Verificar Backend'}
      </button>

      <div style={{ marginTop: '20px' }}>
        {Object.entries(results).map(([name, result]) => (
          <div key={name} style={{
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: result.found ? '#e8f5e9' : '#ffebee',
            border: `1px solid ${result.found ? '#4caf50' : '#f44336'}`,
            borderRadius: '5px'
          }}>
            <strong>{name}:</strong>
            {result.found ? (
              <span style={{ color: '#4caf50' }}>
                {' '}✅ {result.path} {result.auth ? '(requiere auth)' : ''}
              </span>
            ) : (
              <span style={{ color: '#f44336' }}>
                {' '}❌ No encontrado {result.error ? `(${result.error})` : ''}
              </span>
            )}
          </div>
        ))}
      </div>

      {Object.keys(results).length > 0 && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
          <h3>📋 Rutas Encontradas:</h3>
          <pre>{JSON.stringify(Object.fromEntries(
            Object.entries(results)
              .filter(([, r]) => r.found)
              .map(([k, r]) => [k, r.path])
          ), null, 2)}</pre>
          
          <h3>Actualiza src/config/backendEndpoints.js con estas rutas</h3>
        </div>
      )}
    </div>
  );
}
