/**
 * 🧪 Componente de Prueba - visitaCochaApi
 * 
 * Usa este componente para verificar que la API está funcionando correctamente.
 * Importalo en tu App.jsx temporalmente para hacer pruebas.
 */

import { useState } from 'react';
import { 
  atractivosApi, 
  restaurantesApi, 
  eventosApi,
  hotelesApi,
  comidasApi,
  anunciosApi,
  puntosApi,
  rutasApi,
  attractionCategoriesApi,
  restaurantCategoriesApi,
  mainCategoriesApi,
  reviewsApi,
  usersApi
} from '../api/visitaCochaApi';

function TestVisitaCochaApi() {
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const probarEndpoint = async (nombre, apiCall) => {
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const response = await apiCall();
      setResultado({
        nombre,
        exito: true,
        datos: response.data,
        cantidad: Array.isArray(response.data) ? response.data.length : 'N/A'
      });
    } catch (err) {
      setError({
        nombre,
        mensaje: err.response?.data?.message || err.message,
        status: err.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const limpiar = () => {
    setResultado(null);
    setError(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧪 Test de Visita Cocha API</h1>
      
      <div style={styles.info}>
        <p><strong>Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}</p>
        <p><strong>Backend Habilitado:</strong> {import.meta.env.VITE_USE_BACKEND || 'false'}</p>
        <p><strong>Token:</strong> {localStorage.getItem('access_token') ? '✅ Presente' : '❌ No encontrado'}</p>
      </div>

      <div style={styles.buttonGrid}>
        <button 
          onClick={() => probarEndpoint('Atractivos', () => atractivosApi.getAll())}
          disabled={loading}
          style={styles.button}
        >
          🏛️ Atractivos (85)
        </button>

        <button 
          onClick={() => probarEndpoint('Restaurantes', () => restaurantesApi.getAll())}
          disabled={loading}
          style={styles.button}
        >
          🍽️ Restaurantes (49)
        </button>

        <button 
          onClick={() => probarEndpoint('Eventos', () => eventosApi.getAll())}
          disabled={loading}
          style={styles.button}
        >
          🎉 Eventos (2)
        </button>

        <button 
          onClick={() => probarEndpoint('Hoteles', () => hotelesApi.getAll())}
          disabled={loading}
          style={styles.button}
        >
          🏨 Hoteles (2)
        </button>

        <button 
          onClick={() => probarEndpoint('Comidas', () => comidasApi.getAll())}
          disabled={loading}
          style={styles.button}
        >
          🍴 Comidas (35)
        </button>

        <button 
          onClick={() => probarEndpoint('Anuncios', () => anunciosApi.getAll())}
          disabled={loading}
          style={styles.button}
        >
          📢 Anuncios (97)
        </button>

        <button 
          onClick={() => probarEndpoint('Puntos de Interés', () => puntosApi.getAll())}
          disabled={loading}
          style={styles.button}
        >
          📍 POIs (2)
        </button>

        <button 
          onClick={() => probarEndpoint('Rutas', () => rutasApi.getAll())}
          disabled={loading}
          style={styles.button}
        >
          🗺️ Rutas (0)
        </button>

        <button 
          onClick={() => probarEndpoint('Categorías Atractivos', () => attractionCategoriesApi.getAll())}
          disabled={loading}
          style={styles.button}
        >
          🏷️ Cat. Atractivos (7)
        </button>

        <button 
          onClick={() => probarEndpoint('Categorías Restaurantes', () => restaurantCategoriesApi.getAll())}
          disabled={loading}
          style={styles.button}
        >
          🍽️ Cat. Restaurantes (8)
        </button>

        <button 
          onClick={() => probarEndpoint('Categorías Principales', () => mainCategoriesApi.getAll())}
          disabled={loading}
          style={styles.button}
        >
          📂 Cat. Principales (9)
        </button>

        <button 
          onClick={() => probarEndpoint('Reviews', () => reviewsApi.getAll())}
          disabled={loading}
          style={styles.button}
        >
          ⭐ Reviews (4)
        </button>

        <button 
          onClick={() => probarEndpoint('Usuarios', () => usersApi.getAll())}
          disabled={loading}
          style={styles.button}
        >
          👤 Usuarios (3)
        </button>

        <button 
          onClick={() => probarEndpoint('Eventos Próximos', () => eventosApi.getProximos())}
          disabled={loading}
          style={styles.button}
        >
          📅 Eventos Próximos
        </button>

        <button 
          onClick={() => probarEndpoint('Atractivos - Monumentos', () => atractivosApi.getByCategoria('Monumentos'))}
          disabled={loading}
          style={styles.button}
        >
          🗿 Filtrar Categoría
        </button>

        <button 
          onClick={limpiar}
          style={{...styles.button, ...styles.clearButton}}
        >
          🧹 Limpiar
        </button>
      </div>

      {loading && (
        <div style={styles.loading}>
          <p>⏳ Cargando...</p>
        </div>
      )}

      {error && (
        <div style={styles.error}>
          <h3>❌ Error en: {error.nombre}</h3>
          <p><strong>Mensaje:</strong> {error.mensaje}</p>
          {error.status && <p><strong>Status:</strong> {error.status}</p>}
          <details style={{ marginTop: '10px' }}>
            <summary>Ver detalles</summary>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {resultado && (
        <div style={styles.success}>
          <h3>✅ Éxito: {resultado.nombre}</h3>
          <p><strong>Cantidad de items:</strong> {resultado.cantidad}</p>
          <details style={{ marginTop: '10px' }}>
            <summary>Ver datos completos</summary>
            <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '400px' }}>
              {JSON.stringify(resultado.datos, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <div style={styles.instructions}>
        <h3>📋 Instrucciones</h3>
        <ol>
          <li>Asegúrate de que tu backend está corriendo en <code>http://localhost:3000</code></li>
          <li>Verifica que <code>VITE_USE_BACKEND=true</code> en tu archivo <code>.env</code></li>
          <li>Haz clic en los botones para probar cada endpoint</li>
          <li>Si ves errores de CORS, habilita CORS en tu backend</li>
          <li>Si ves errores 401, verifica tu token de autorización</li>
        </ol>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '20px auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px'
  },
  info: {
    background: '#f0f0f0',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '10px',
    marginBottom: '20px'
  },
  button: {
    padding: '12px 20px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '6px',
    background: '#007bff',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  clearButton: {
    background: '#6c757d'
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    background: '#fff3cd',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  error: {
    background: '#f8d7da',
    padding: '20px',
    borderRadius: '8px',
    color: '#721c24',
    marginBottom: '20px'
  },
  success: {
    background: '#d4edda',
    padding: '20px',
    borderRadius: '8px',
    color: '#155724',
    marginBottom: '20px'
  },
  instructions: {
    background: '#e7f3ff',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px'
  }
};

export default TestVisitaCochaApi;
