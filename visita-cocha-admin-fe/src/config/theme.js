// Color scheme basado en el logo de Cochabamba
// Colores principales: Verde, Azul, Naranja/Dorado

export const THEME_COLORS = {
  // Primarios (basados en logos típicos de Cochabamba)
  primary: '#2D7F3E',        // Verde principal
  primaryLight: '#4CAF50',   // Verde claro
  primaryDark: '#1B5E2E',    // Verde oscuro
  
  // Secundarios
  secondary: '#0066CC',      // Azul
  secondaryLight: '#4D94FF', // Azul claro
  secondaryDark: '#003D99',  // Azul oscuro
  
  // Acentos
  accent: '#FF9900',         // Naranja/Dorado
  accentLight: '#FFB84D',    // Naranja claro
  accentDark: '#CC7700',     // Naranja oscuro
  
  // Neutrales
  white: '#FFFFFF',
  light: '#F5F7FA',
  lightGray: '#E8EBF0',
  gray: '#A0A9B8',
  darkGray: '#606B82',
  dark: '#2C3E50',
  black: '#1A1A1A',
  
  // Estados
  success: '#27AE60',
  warning: '#F39C12',
  danger: '#E74C3C',
  info: '#3498DB',
  
  // Backgrounds
  bgPrimary: '#F8FAFB',
  bgSecondary: '#FFFFFF',
  bgDark: '#E8EBF0'
};

export const THEME_FONTS = {
  primary: '"Poppins", sans-serif',
  secondary: '"Inter", sans-serif',
  mono: '"Fira Code", monospace'
};

export const THEME_SHADOWS = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  focus: `0 0 0 3px rgba(45, 127, 62, 0.1), 0 0 0 2px ${THEME_COLORS.primary}`
};

export const THEME_BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};
