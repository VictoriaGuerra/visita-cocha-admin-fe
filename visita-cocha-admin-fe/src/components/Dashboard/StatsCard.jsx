// src/components/Dashboard/StatsCard.jsx
import React from "react";
import { formatNumber } from "../../utils/helpers";
import Tooltip from '../../components/Tooltip';

// StatsCard: uses classes defined in src/styles/dashboard.css
// Props:
// - title, value
// - icon: optional node
// - variant: green|orange|red|purple
// - tooltip: optional string to show on hover
// - index: optional number to stagger entrance animation
export default function StatsCard({ title, value, icon = null, variant = "green", tooltip = '', index = 0 }) {
  const allowed = ["green", "orange", "red", "purple"];
  const v = allowed.includes(variant) ? variant : "green";

  const formatted = typeof value === 'number' ? formatNumber(value) : value;

  const delay = typeof index === 'number' ? `${index * 80}ms` : undefined;

  return (
    <div className={`stat-card stat-enter`} style={{ minWidth: 140, display: "flex", alignItems: "center", justifyContent: "center", animationDelay: delay }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {icon && (
          <div className={`stat-icon-bg ${v}`} aria-hidden>
            <span className="stat-icon">{icon}</span>
          </div>
        )}

        <div className="stat-content" style={{ textAlign: icon ? "left" : "center" }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p className="stat-label">{title}</p>
            {tooltip && (
              <Tooltip text={tooltip}>
                <span className="stat-tooltip" aria-hidden>ℹ</span>
              </Tooltip>
            )}
          </div>
          <p className="stat-count">{formatted}</p>
        </div>
      </div>
    </div>
  );
}
