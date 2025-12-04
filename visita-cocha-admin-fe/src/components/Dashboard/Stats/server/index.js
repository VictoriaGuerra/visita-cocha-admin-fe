/**
 * Simple Express server that exposes an endpoint /api/analytics/dashboard.
 *
 * This endpoint calls the Google Analytics Data API (GA4) using a service
 * account. You must set these environment variables locally before starting
 * the server:
 *   - GA4_PROPERTY_ID (numeric id or 'properties/123456789')
 *   - GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON)
 *   - (optional) GA4_DEPARTMENT_DIMENSION (the dimension name for department, e.g. 'userProperty:department' or a custom event dimension)
 */

import express from 'express';
import cors from 'cors';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

const propEnv = process.env.GA4_PROPERTY_ID || process.env.GA4_PROPERTY || '';
const property = propEnv ? (propEnv.startsWith('properties/') ? propEnv : `properties/${propEnv}`) : '';

const departmentDimension = process.env.GA4_DEPARTMENT_DIMENSION || null; // e.g. 'userProperty:department'

// Create client using GOOGLE_APPLICATION_CREDENTIALS env var or default ADC
let client;
try {
  client = new BetaAnalyticsDataClient();
} catch (e) {
  console.warn('Could not create BetaAnalyticsDataClient:', e?.message || e);
  client = null;
}

async function runReport({dimensions, metrics, limit = 50, dateRange = { startDate: '30daysAgo', endDate: 'today' }}) {
  const request = {
    property,
    dateRanges: [dateRange],
    dimensions: dimensions.map((d) => ({ name: d })),
    metrics: metrics.map((m) => ({ name: m })),
    limit,
  };

  const [response] = await client.runReport(request);
  return response;
}

// Convert GA4 runReport response into simple rows array
function toRows(response) {
  if (!response || !response.rows) return [];
  return response.rows.map((r) => {
    const values = r.dimensionValues?.map((d) => d.value) || [];
    const metrics = r.metricValues?.map((m) => Number(m.value)) || [];
    return { dimensions: values, metrics };
  });
}

app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    console.log('/api/analytics/dashboard requested');

    // If GA4 property not configured or client unavailable, return mock data
    if (!property || !client) {
      console.warn('GA4 not configured or client unavailable — returning mock data');

      // generate 30 days timeseries
      const timeSeries = [];
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime());
        d.setDate(now.getDate() - i);
        const date = d.toISOString().slice(0, 10);
        const value = Math.floor(1000 + Math.random() * 2000 + (30 - i) * 20);
        timeSeries.push({ date, activeUsers: value });
      }

      const visitsByCountry = [
        { country: 'Bolivia', visits: 1400 },
        { country: 'Peru', visits: 5120 },
        { country: 'Chile', visits: 2810 },
        { country: 'Colombia', visits: 1700 },
        { country: 'USA', visits: 540 },
      ];

      const visitsByDepartment = [
        { department: 'Soporte', views: 2500 },
        { department: 'Ventas', views: 1900 },
        { department: 'Marketing', views: 900 },
        { department: 'Operaciones', views: 770 },
      ];

      const topPages = [
        { path: '/home', views: 3400 },
        { path: '/visita-cocha', views: 3700 },
        { path: '/products', views: 2400 },
        { path: '/dashboard', views: 1800 },
      ];

      const activeNow = { last30min: 2, perMinute: [0, 1, 0, 0, 0, 1] };

      const retention = [
        { day: 0, percent: 100 },
        { day: 5, percent: 12 },
        { day: 12, percent: 5 },
        { day: 19, percent: 3 },
        { day: 26, percent: 2 },
        { day: 33, percent: 2 },
      ];

      // simple cohort: 6 weeks x 6 columns with decreasing percentages
      const cohort = [];
      for (let w = 0; w < 6; w++) {
        const row = [];
        for (let c = 0; c < 6; c++) {
          const base = Math.max(0, 30 - (c * 5 + w * 2));
          row.push(Math.max(0, Math.round((Math.random() * base) + (c === 0 ? 100 : 0))));
        }
        cohort.push({ weekStart: `week-${w}`, values: row });
      }

      const events = [
        { name: 'page_view', count: 4000 },
        { name: 'session_start', count: 3100 },
        { name: 'first_visit', count: 1400 },
        { name: 'user_engagement', count: 1200 },
      ];

      return res.json({ timeSeries, visitsByCountry, visitsByDepartment, topPages, activeNow, retention, cohort, events });
    }

    // 1) visits by country
    const countryResp = await runReport({ dimensions: ['country'], metrics: ['activeUsers'], limit: 100 });
    const countryRows = toRows(countryResp);
    const visitsByCountry = countryRows.map((r) => ({ country: r.dimensions[0] || 'Unknown', visits: r.metrics[0] || 0 }));

    // 2) top pages by activeUsers or eventCount
    let pageResp;
    try {
      pageResp = await runReport({ dimensions: ['pagePath'], metrics: ['activeUsers'], limit: 20 });
    } catch (e) {
      // fallback to pagePath as dimension with eventCount
      pageResp = await runReport({ dimensions: ['pagePath'], metrics: ['eventCount'], limit: 20 });
    }
    const pageRows = toRows(pageResp);
    const topPages = pageRows.map((r) => ({ path: r.dimensions[0] || '/', views: r.metrics[0] || 0 }));

    // 3) department dimension — optional. This requires you to configure a
    // dimension in GA4 and set GA4_DEPARTMENT_DIMENSION env var with the
    // name used by the API (for example 'userProperty:department').
    let visitsByDepartment = [];
    if (departmentDimension) {
      try {
        const depResp = await runReport({ dimensions: [departmentDimension], metrics: ['activeUsers'], limit: 50 });
        const depRows = toRows(depResp);
        visitsByDepartment = depRows.map((r) => ({ department: r.dimensions[0] || 'Unknown', views: r.metrics[0] || 0 }));
      } catch (e) {
        // accept empty
        visitsByDepartment = [];
      }
    }

    // Sort by visits descending
    visitsByCountry.sort((a, b) => b.visits - a.visits);
    topPages.sort((a, b) => b.views - a.views);
    visitsByDepartment.sort((a, b) => b.views - a.views);

    res.json({ visitsByCountry, visitsByDepartment, topPages });
  } catch (err) {
    console.error('Error running GA4 reports', err?.message || err);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Simple root and health endpoints to help debugging
app.get('/', (req, res) => {
  res.type('text').send('Analytics server running. Use /api/analytics/dashboard');
});

app.get('/server/health', (req, res) => {
  res.json({ ok: true, ga4Configured: Boolean(property) });
});

app.listen(port, () => {
  console.log(`Analytics server listening on http://localhost:${port}`);
  console.log('Ensure GA4_PROPERTY_ID and GOOGLE_APPLICATION_CREDENTIALS are set.');
});
