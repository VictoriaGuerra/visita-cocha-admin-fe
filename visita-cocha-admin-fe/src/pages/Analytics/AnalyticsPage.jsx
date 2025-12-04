import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { usePermissions } from '../../auth/permissions';
import StatsCard from '../../components/Dashboard/StatsCard';
import StatsChart from '../../components/Dashboard/StatsChart';
import '../../styles/dashboard.css';

export default function AnalyticsPage() {
  const { user } = useContext(AuthContext);
  const canView = usePermissions(user?.role, 'analytics', 'read');

  const useExt = String(import.meta.env.VITE_USE_EXT_ANALYTICS || '').toLowerCase() === 'true';
  const extUrl = import.meta.env.VITE_ANALYTICS_URL || import.meta.env.VITE_EXT_STATS_URL || '';

  const [statsSummary, setStatsSummary] = useState([
    { title: 'Usuarios', value: 0, icon: 'fa-users', variant: 'green' },
    { title: 'Módulos', value: 0, icon: 'fa-cubes', variant: 'purple' },
    { title: 'Eventos', value: 0, icon: 'fa-calendar', variant: 'orange' },
  ]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if (!mounted) return;
        // datos mock como fallback
        setStatsSummary(prev => [
          { ...prev[0], value: 12000 },
          { ...prev[1], value: 85 },
          { ...prev[2], value: 42 },
        ]);
      } catch (e) {
        console.error('Error cargando analytics:', e);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (!canView) return <div style={{ padding: 20 }}>No tienes permisos para ver Analytics.</div>;

  // Si se indica una URL externa para la app avanzada, la embebemos en un iframe
  if (useExt && extUrl) {
    return (
      <div style={{ padding: 12 }}>
        <div className="dashboard-header">
          <h1 className="dashboard-title"><i className="fas fa-chart-area"></i> Analytics</h1>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
            <a href={extUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">Abrir Analytics en nueva pestaña</a>
            <div style={{ color: '#555' }}>
              <div><strong>URL embebida:</strong> <span style={{ fontFamily: 'monospace' }}>{extUrl}</span></div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Si el iframe no carga, revisa la consola y las cabeceras HTTP (X-Frame-Options / Content-Security-Policy).</div>
            </div>
          </div>
          <iframe
            title="Analytics Extended"
            src={extUrl}
            style={{ width: '100%', height: '80vh', border: '0', minHeight: 600 }}
          />
          <div style={{ marginTop: 8, color: '#666', fontSize: 13 }}>
            Si ves un espacio vacío, abre el enlace en una nueva pestaña para comprobar si el servidor está levantado o si hay cabeceras que impiden embeber.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              <i className="fas fa-chart-area"></i>
              Analytics
            </h1>
            <div className="dashboard-welcome">Panel de Análisis</div>
          </div>
        </div>

        <div className="stats-panel">
          <div className="stats-grid">
            {statsSummary.map((stat, idx) => (
              <StatsCard
                key={idx}
                index={idx}
                title={stat.title}
                value={stat.value}
                icon={<i className={`fas ${stat.icon}`}></i>}
                variant={stat.variant}
                tooltip={`Total de ${stat.title.toLowerCase()}: ${stat.value}`}
              />
            ))}
          </div>
        </div>

        <section className="chart-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-chart-bar"></i>
              Resumen
            </h2>
          </div>
          <div className="chart-container">
            <StatsChart data={statsSummary.map(s => ({ name: s.title, value: s.value }))} />
          </div>
        </section>
      </div>
    </div>
  );
}
