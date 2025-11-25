// Simple settings API backed by localStorage
const KEY = 'vc_settings_v1';

const defaults = {
  general: {
    siteName: 'Visita Cocha Admin',
    organization: 'Gobierno Autónomo Municipal de Cochabamba',
    contactEmail: 'info@cocha.bo',
    itemsPerPage: 10,
    maintenanceMode: false
  },
  appearance: {
    primaryColor: '#0ea5e9',
    secondaryColor: '#111827',
    logoUrl: '',
    darkMode: false
  },
  localization: {
    language: 'es',
    timezone: 'America/La_Paz',
    dateFormat: 'DD/MM/YYYY',
    currency: 'BOB'
  },
  notifications: {
    emailEnabled: true,
    pushEnabled: false,
    weeklySummary: true
  },
  security: {
    require2FA: false,
    sessionTimeoutMinutes: 60,
    allowPublicRegistration: false
  },
  advanced: {
    analyticsId: '',
    mapsApiKey: '',
    dataExportEnabled: true
  }
};

const deepMerge = (base, override) => {
  const out = { ...base };
  for (const k in override || {}) {
    const v = override[k];
    if (v && typeof v === 'object' && !Array.isArray(v)) out[k] = deepMerge(base[k] || {}, v);
    else out[k] = v;
  }
  return out;
};

export const settingsApi = {
  get: () => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return deepMerge(defaults, parsed);
    } catch {
      return { ...defaults };
    }
  },
  save: (settings) => {
    const toSave = deepMerge(defaults, settings || {});
    localStorage.setItem(KEY, JSON.stringify(toSave));
    return toSave;
  },
  reset: () => {
    localStorage.setItem(KEY, JSON.stringify(defaults));
    return { ...defaults };
  },
  defaults
};
