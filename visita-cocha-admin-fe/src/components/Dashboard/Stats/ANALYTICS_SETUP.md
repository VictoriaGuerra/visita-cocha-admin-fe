## Configurar Analytics (Firebase / GA4) y conectar el Panel de Estadísticas

Este proyecto incluye un panel de estadísticas en `app/dashboard/StatisticsPanel.tsx` que por defecto usa datos mock (archivo `app/services/analyticsService.ts`) para que puedas ver la interfaz localmente.

Objetivo
- Mostrar métricas reales (visitas por país, visitas por departamento, páginas más visitadas) en el panel.

Opciones para obtener datos reales
1) Exportar Firebase Analytics a BigQuery (recomendado para análisis avanzados)
   - En Firebase > Analytics > Configuración > Vincular con BigQuery.
   - BigQuery contendrá tablas con eventos que puedes consultar y agregar por país, por propiedad personalizada (p.ej. `department`), etc.
   - Crea un endpoint backend que consulte BigQuery y devuelva el JSON para el frontend.

2) Usar la Google Analytics Data API (GA4) desde un backend
   - Crea una cuenta de servicio en Google Cloud y descarga la clave JSON.
   - Asigna a la cuenta de servicio acceso a la propiedad GA4.
   - Instala la librería de cliente en tu backend: `npm i @google-analytics/data`.
   - Ejemplo de consulta (Node.js):

```js
// Ejemplo express endpoint
const {BetaAnalyticsDataClient} = require('@google-analytics/data');
const client = new BetaAnalyticsDataClient({ keyFilename: '/path/to/service-account.json' });

app.get('/api/analytics/dashboard', async (req, res) => {
  // Reemplaza: "properties/123456789" con tu property id
  const [response] = await client.runReport({
    property: 'properties/123456789',
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'activeUsers' }],
    limit: 50,
  });

  // transformar response.rows a un formato consumible por el frontend
  res.json({ /* visitsByCountry, visitsByDepartment, topPages */ });
});

Server de ejemplo incluido en este repo
--------------------------------------

He añadido un servidor ejemplo en `server/index.js` que expone el endpoint
`/api/analytics/dashboard` y llama a la Google Analytics Data API para devolver
las métricas en el formato que usa el frontend (`visitsByCountry`,
`visitsByDepartment`, `topPages`).

Variables de entorno para el servidor
- GA4_PROPERTY_ID — tu property id (puede ser el número, p.ej. `123456789` o `properties/123456789`).
- GOOGLE_APPLICATION_CREDENTIALS — ruta local al archivo JSON de la cuenta de servicio.
- (opcional) GA4_DEPARTMENT_DIMENSION — nombre de la dimensión que usas para "department" (si la configuraste como user property o custom dimension). Ejemplo: `userProperty:department`.

Ejemplo de arranque local del servidor

1) Asegúrate de que tienes una cuenta de servicio con acceso a tu propiedad GA4 y guarda el JSON en una ruta segura.
2) Exporta variables en la terminal (PowerShell):

```powershell
$env:GA4_PROPERTY_ID="properties/123456789"
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\service-account.json"
```

3) Arranca el servidor:

```powershell
npm install
npm run start:server
```

4) Por defecto el frontend busca `/api/analytics/dashboard` en la misma origin. Si arrancas el servidor en otro puerto (ej. 3001) y el frontend en otro (ej. Vite 5173), añade la variable a `.env.local`:

```
VITE_USE_REAL_ANALYTICS=true
VITE_ANALYTICS_URL=http://localhost:3001/api/analytics/dashboard
```

Esto hará que el frontend use la ruta absoluta del servidor local.
```

3) (Temporal) Usar los mocks incluidos
   - El frontend ya consume `fetchDashboardData()` del servicio `app/services/analyticsService.ts`.
   - Para usar un endpoint real en producción, sirve tu backend en `/api/analytics/dashboard` y activa la variable de entorno `VITE_USE_REAL_ANALYTICS=true`.

Variables de entorno y configuración local
- En `.env` o en el entorno de Vite coloca las variables:
  - VITE_FIREBASE_API_KEY
  - VITE_FIREBASE_AUTH_DOMAIN
  - VITE_FIREBASE_PROJECT_ID
  - VITE_FIREBASE_STORAGE_BUCKET
  - VITE_FIREBASE_MESSAGING_SENDER_ID
  - VITE_FIREBASE_APP_ID
  - VITE_FIREBASE_MEASUREMENT_ID
  - VITE_USE_REAL_ANALYTICS=true (para activar el uso del endpoint /api/analytics/dashboard)

  Ejemplo práctico (.env.local)

    1. Crea un archivo en la raíz del proyecto llamado `.env.local`.
    2. Copia las variables desde `.env.local.example` y pega tus valores reales.

  Ejemplo (NO COMMIT):

  ```env
  VITE_FIREBASE_API_KEY=AIzaSyBle9Kr-mI4-GQGIDMd9QsXZwFafoRzFvM
  VITE_FIREBASE_AUTH_DOMAIN=cocha-turismo.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=cocha-turismo
  VITE_FIREBASE_STORAGE_BUCKET=cocha-turismo.appspot.com
  VITE_FIREBASE_MESSAGING_SENDER_ID=814334659870
  VITE_FIREBASE_APP_ID=1:814334659870:web:8a8f2c7a4cb40598af8d0f
  VITE_FIREBASE_MEASUREMENT_ID=G-X052853P53

  # Cuando tengas un backend funcionando para devolver las métricas:
  VITE_USE_REAL_ANALYTICS=true
  ```

  Importante: NUNCA pongas las claves de servicio ni el JSON de la cuenta de servicio en el frontend ni en un archivo que se suba a Git.

Cómo ver el panel localmente
1) Instala dependencias (recharts y firebase se añadieron al `package.json`).
```powershell
npm install
npm run dev
```
2) Abre el navegador en `/` y haz click en "Ver panel de estadísticas" desde la página de bienvenida.

Notas de seguridad
- NUNCA incluyas la clave de servicio de Google (service-account.json) en el frontend. Usa siempre un backend para autenticar y consultar GA4/BigQuery.

Si quieres, puedo añadir el endpoint de ejemplo en Node.js con autenticación y consulta GA4 usando la cuenta de servicio — dime si quieres que lo implemente en este repo o si tienes tu propio backend donde lo integraríamos.
