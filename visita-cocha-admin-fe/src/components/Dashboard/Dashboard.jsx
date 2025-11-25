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
import '../../styles/dashboard.css';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const canViewUsers = usePermissions(user?.role, 'users', 'read');
  const canViewModules = usePermissions(user?.role, 'modules', 'read');

  const [statsSummary, setStatsSummary] = useState([
    { title: 'Usuarios', value: 0, icon: 'fa-users', variant: 'green' },
    { title: 'Módulos', value: 0, icon: 'fa-cubes', variant: 'purple' },
    { title: 'Eventos', value: 0, icon: 'fa-calendar', variant: 'orange' },
  ])

  const [usersList, setUsersList] = useState([])
  const [modules, setModules] = useState([])

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
    let mounted = true
    const loadCounts = async () => {
      try {
        let users = []
        let mods = []
        const events = await (USE_BACKEND ? getContentList('events') : localStoreApi.getAll('events'))

        if (!mounted) return
        
        setStatsSummary(prev => [
          { ...prev[0], value: users.length },
          { ...prev[1], value: mods.length },
          { ...prev[2], value: (Array.isArray(events) ? events.length : 0) }
        ])
      } catch(e) { 
        console.error('Error al cargar estadísticas:', e) 
      }
    }

    loadCounts()
    const id = setInterval(loadCounts, 30000) // actualizar cada 30s
    return () => { 
      mounted = false
      clearInterval(id) 
    }
  }, [])

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
          <div className="stats-grid">
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
