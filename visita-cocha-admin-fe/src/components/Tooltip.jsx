import React from 'react';
import '../styles/dashboard.css';

// Accessible tooltip: shows content on hover/focus; simple, CSS-driven
export default function Tooltip({ children, text }) {
  return (
    <span className="vc-tooltip" tabIndex={0} aria-label={text}>
      {children}
      <span className="vc-tooltip-text" role="tooltip">{text}</span>
    </span>
  );
}
