// src/components/Dashboard/StatsCard.jsx
import React from "react";
import { formatNumber } from "../../utils/helpers";
import Tooltip from '../../components/Tooltip';

// Función para renderizar el icono de Font Awesome
const renderIcon = (iconClass) => {
  if (!iconClass) return null;
  
  // Si no es string, convertir a string
  if (typeof iconClass !== 'string') {
    return iconClass;
  }
  
  // Convertir de formato simple (ej: 'fa-users') a clases completas.
  // Usar prefijo moderno `fa-solid` (FA6) y dejar compatibilidad con nombres `fa-...`.
  const iconString = iconClass.includes('fa-') ? iconClass : `fa-${iconClass}`;
  const fullClass = iconString.startsWith('fa-') ? `fa-solid ${iconString}` : iconString;

  return <i className={fullClass} aria-hidden="true"></i>;
};

// StatsCard: uses classes defined in src/styles/dashboard.css
// Props:
// - title, value
// - icon: optional string (Font Awesome class like 'fa-users' or full class 'fas fa-users')
// - variant: green|orange|red|purple
// - tooltip: optional string to show on hover
// - index: optional number to stagger entrance animation
export default function StatsCard({ title, value, icon = null, variant = "green", tooltip = '', index = 0 }) {
  // Paleta de colores para variantes
  const palette = {
    green: { bg: '#4ade80', fg: '#fff' },
    purple: { bg: '#a78bfa', fg: '#fff' },
    orange: { bg: '#fbbf24', fg: '#fff' },
    red: { bg: '#fb7185', fg: '#fff' },
    blue: { bg: '#60a5fa', fg: '#fff' },
    teal: { bg: '#2dd4bf', fg: '#fff' },
    yellow: { bg: '#fde047', fg: '#222' },
    pink: { bg: '#f472b6', fg: '#fff' },
    indigo: { bg: '#818cf8', fg: '#fff' },
    gray: { bg: '#d1d5db', fg: '#222' },
    default: { bg: '#e5e7eb', fg: '#222' }
  };
  const v = palette[variant] || palette.default;

  const formatted = typeof value === 'number' ? formatNumber(value) : value;
  const delay = typeof index === 'number' ? `${index * 80}ms` : undefined;

  return (
    <div className="stats-card stat-enter" style={{ animationDelay: delay }}>
      {icon && (
        <div
          className="icon-circle"
          style={{ background: v.bg, color: v.fg }}
          aria-hidden
        >
          {renderIcon(icon)}
        </div>
      )}
      <div className="stat-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', width: '100%' }}>
          <span className="stat-label">{title}</span>
          {tooltip && (
            <Tooltip text={tooltip}>
              <span className="stat-tooltip" aria-hidden>ℹ</span>
            </Tooltip>
          )}
        </div>
        <div className="stat-value">{formatted}</div>
      </div>
    </div>
  );
}
