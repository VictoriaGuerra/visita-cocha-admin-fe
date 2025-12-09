// src/components/Dashboard/StatsCard.jsx
import React from "react";
import { formatNumber } from "../../utils/helpers";
import Tooltip from '../../components/Tooltip';

// Función para renderizar el icono de Font Awesome
const renderIcon = (iconClass) => {
  if (!iconClass) return null;
  
  // Convertir de formato simple (ej: 'fa-users') a clases completas (ej: 'fas fa-users')
  const iconString = iconClass.includes('fa-') ? iconClass : `fa-${iconClass}`;
  const fullClass = iconString.startsWith('fa-') ? `fas ${iconString}` : iconString;
  
  return <i className={fullClass}></i>;
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
    <div
      className="stat-card stat-enter"
      style={{
        minWidth: 180,
        minHeight: 100,
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 8px rgba(63,144,142,0.07)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '18px 16px',
        animationDelay: delay,
        marginBottom: 0,
        position: 'relative',
        transition: 'box-shadow 0.18s',
        textAlign: 'center',
      }}
    >
      {icon && (
        <div
          style={{
            background: v.bg,
            color: v.fg,
            borderRadius: '50%',
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            flexShrink: 0,
          }}
          aria-hidden
        >
          {renderIcon(icon)}
        </div>
      )}
      <div className="stat-content" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
          <span className="stat-label" style={{ fontWeight: 500, fontSize: 12, color: '#666', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
          {tooltip && (
            <Tooltip text={tooltip}>
              <span className="stat-tooltip" aria-hidden style={{ color: '#888', fontSize: 14, marginLeft: 2, cursor: 'pointer' }}>ℹ</span>
            </Tooltip>
          )}
        </div>
        <div style={{ fontWeight: 700, fontSize: 24, color: '#222', marginTop: 4 }}>{formatted}</div>
      </div>
    </div>
  );
}
