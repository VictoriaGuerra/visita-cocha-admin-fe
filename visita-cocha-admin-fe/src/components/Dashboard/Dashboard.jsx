// src/components/Dashboard/Dashboard.jsx
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { usePermissions } from '../../auth/permissions';
import UserTable from './UserTable';
import ModuleTable from './ModuleTable';
import * as api from '../../api';
import { localStoreApi } from '../../api/localStoreApi';
import { USE_BACKEND, getContentList } from '../../api';
import StatsCard from './StatsCard';
import StatsChart from './StatsChart';
import { MODULE_TYPES } from '../../config/moduleTypes';
import '../../styles/dashboard.css';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const canViewUsers = usePermissions(user?.role, 'users', 'read');
  const canViewModules = usePermissions(user?.role, 'modules', 'read');

  // Listado de módulos visibles en el sidebar (los que el usuario puede gestionar)
  const MODULES_TO_COUNT = [
    { id: 'attractions', title: 'Atracciones', icon: 'fa-landmark', variant: 'blue' },
    { id: 'restaurants', title: 'Restaurantes', icon: 'fa-utensils', variant: 'purple' },
    { id: 'foods', title: 'Comidas', icon: 'fa-bowl-food', variant: 'orange' },
    { id: 'itineraries', title: 'Itinerarios', icon: 'fa-route', variant: 'gray' },
    { id: 'routes', title: 'Rutas', icon: 'fa-map-marked-alt', variant: 'indigo' },
    { id: 'events', title: 'Eventos', icon: 'fa-calendar', variant: 'yellow' },
    { id: 'hotels', title: 'Hoteles', icon: 'fa-hotel', variant: 'teal' },
    { id: 'categories', title: 'Categorías', icon: 'fa-list', variant: 'gray' },
    { id: 'announcements', title: 'Anuncios', icon: 'fa-bullhorn', variant: 'red' },
    { id: 'points', title: 'Puntos', icon: 'fa-location-dot', variant: 'pink' },
    { id: 'users', title: 'Usuarios', icon: 'fa-users', variant: 'green' },
  ];

  const [statsSummary, setStatsSummary] = useState([
    { title: 'Usuarios', value: 0, icon: 'fa-users', variant: 'green' },
    { title: 'Módulos', value: MODULES_TO_COUNT.length, icon: 'fa-cubes', variant: 'purple' },
    ...MODULES_TO_COUNT.map(m => ({ title: m.title, value: 0, icon: m.icon, variant: m.variant }))
  ]);

  const [usersList, setUsersList] = useState([]);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    let mounted = true
    
    const load = async () => {
      try {
        if (canViewModules) {
          const list = await api.getModules()
          if (mounted) setModules(list)
        }
      } catch(e) { console.error(e) }
    }
    
    load()
    return () => mounted = false
  }, [canViewModules])

  useEffect(() => {
    let mounted = true
    
    const loadUsers = async () => {
      try {
        if (canViewUsers) {
          const us = await api.getUsers()
          if (mounted) setUsersList(us)
        }
      } catch(e) { console.error(e) }
    }
    
    loadUsers()
    return () => mounted = false
  }, [canViewUsers])

  // Cargar estadísticas y actualizar periódicamente (simular tiempo real)
  useEffect(() => {
    let mounted = true;
    const loadCounts = async () => {
      try {
        // Usuarios
        let users = [];
        try {
          users = await api.getUsers();
        } catch (e) { users = []; }

        // Módulos (definidos en la base de datos, no solo los visibles)
        let mods = [];
        try {
          mods = await api.getModules();
        } catch (e) { mods = []; }

        // Para cada módulo visible, obtener el conteo real
        const moduleCounts = await Promise.all(
          MODULES_TO_COUNT.map(async (mod) => {
            try {
              if (mod.id === 'users') {
                return users.length;
              } else if (mod.id === 'categories') {
                // Sumar categorías de atracciones y restaurantes (sin principales)
                const cats1 = await api.getContentList('attraction-categories');
                const cats2 = await api.getContentList('restaurant-categories');
                return (cats1?.length || 0) + (cats2?.length || 0);
              } else {
                const arr = await getContentList(mod.id);
                return Array.isArray(arr) ? arr.length : 0;
              }
            } catch (e) {
              return 0;
            }
          })
        );

        if (!mounted) return;

        // Construir el resumen completo
        setStatsSummary([
          { title: 'Usuarios', value: users.length, icon: 'fa-users', variant: 'green' },
          { title: 'Módulos', value: MODULES_TO_COUNT.length, icon: 'fa-cubes', variant: 'purple' },
          ...MODULES_TO_COUNT.map((m, i) => ({
            title: m.title,
            value: moduleCounts[i],
            icon: m.icon,
            variant: m.variant
          }))
        ]);
      } catch (e) {
        console.error('Error al cargar estadísticas:', e);
      }
    };

    loadCounts();
    const id = setInterval(loadCounts, 30000); // actualizar cada 30s
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              <i className="fas fa-chart-line"></i>
              Panel de Control
            </h1>
            <div className="dashboard-welcome">
              Bienvenido, {user?.name || 'Usuario'}
            </div>
          </div>
          <div className="dashboard-actions">
            <button className="btn btn-icon" title="Actualizar datos">
              <i className="fas fa-sync-alt"></i>
            </button>
            <button className="btn btn-icon" title="Exportar datos">
              <i className="fas fa-download"></i>
            </button>
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i>
              Nuevo Reporte
            </button>
          </div>
        </div>

        <div className="stats-panel">
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            {statsSummary.map((stat, index) => (
              <StatsCard
                key={index}
                index={index}
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
              Análisis de Actividad
            </h2>
          </div>
          <div className="chart-container">
            <StatsChart data={statsSummary.map(s => ({ name: s.title, value: s.value }))} />
          </div>
        </section>

        {canViewUsers && (
          <section className="data-section">
            <div className="section-header">
              <h2>
                <i className="fas fa-users"></i>
                Usuarios del Sistema
              </h2>
            </div>
            <div className="section-content">
              <UserTable users={usersList} />
            </div>
          </section>
        )}

        {canViewModules && (
          <section className="data-section">
            <div className="section-header">
              <h2>
                <i className="fas fa-cubes"></i>
                Módulos Activos
              </h2>
            </div>
            <div className="section-content">
              <ModuleTable />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
