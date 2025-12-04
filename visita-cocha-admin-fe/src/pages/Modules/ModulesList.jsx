import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MODULE_TYPES } from '../../config/moduleTypes';
import ModuleCard from '../../components/UI/ModuleCard';
import '../../styles/modules.css';
import { AuthContext } from '../../auth/AuthContext';
import { isSuperAdmin } from '../../utils/roleUtils';
import * as api from '../../api';

const MODULE_DESCRIPTIONS = {
  attractions: 'Gestiona los atractivos turísticos de la ciudad',
  restaurants: 'Administra los restaurantes registrados',
  foods: 'Gestiona el catálogo de comidas típicas',
  itineraries: 'Administra los itinerarios y rutas turísticas',
  routes: 'Gestiona rutas turísticas con hoteles, restaurantes y POIs',
  // mainCategories eliminado
  events: 'Administra eventos (fechas, lugar, entradas, etc.)',
  hotels: 'Gestiona hoteles y alojamientos (servicios, precios, habitaciones)',
  points: 'Administra puntos de interés generales (marcadores rápidos)',
  announcements: 'Administra anuncios y comunicados breves',
  categories: 'Editar categorías (atracciones, restaurantes, principales)'
};

export default function ModulesList() {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function loadModules() {
      // Módulos principales (sin mainCategories)
      const baseModules = Object.values(MODULE_TYPES)
        .filter(module => module.id !== 'mainCategories')
        .map(module => ({
          id: module.id,
          title: module.name,
          description: MODULE_DESCRIPTIONS[module.id] || 'Gestiona los elementos de este módulo',
          icon: `fa-solid ${module.icon || 'fa-cube'}`,
          route: `/modules/${module.id}`,
          itemCount: 0,
          lastUpdated: null
        }));

      // Añadir tarjeta de Categorías (no está en MODULE_TYPES)
      baseModules.push({
        id: 'categories',
        title: 'Categorías',
        description: MODULE_DESCRIPTIONS['categories'],
        icon: 'fa-solid fa-list',
        route: '/modules/categories',
        itemCount: 0,
        lastUpdated: null
      });
      // Añadir tarjeta de Usuarios (acceso a gestión de usuarios)
      baseModules.push({
        id: 'users',
        title: 'Usuarios',
        description: 'Gestiona cuentas, roles y accesos',
        icon: 'fa-solid fa-users',
        route: '/users',
        itemCount: 0,
        lastUpdated: null,
      });

      // Obtener conteos reales de la API
      const updatedModules = await Promise.all(baseModules.map(async (mod) => {
        try {
          if (mod.id === 'users') {
            const users = await api.getUsers();
            return { ...mod, itemCount: Array.isArray(users) ? users.length : 0 };
          } else if (mod.id === 'categories') {
            // Sumar solo categorías de atracciones y restaurantes
            const cats1 = await api.getContentList('attraction-categories');
            const cats2 = await api.getContentList('restaurant-categories');
            const total = (cats1?.length || 0) + (cats2?.length || 0);
            return { ...mod, itemCount: total };
          } else {
            const items = await api.getContentList(mod.id);
            return { ...mod, itemCount: Array.isArray(items) ? items.length : 0 };
          }
        } catch (e) {
          return { ...mod, itemCount: 0 };
        }
      }));
      setModules(updatedModules);
    }
    loadModules();
  }, []);

  const handleModuleClick = (moduleId) => {
    navigate(`/modules/${moduleId}`);
  };

  const isSuperAdmin = user?.roles?.includes('SuperAdmin');

  return (
    <div className="modules-container">
      <h2 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: 24 }}>Módulos</h2>
      <div className="modules-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
        {modules.map(module => (
          <ModuleCard
            key={module.id}
            title={module.title}
            description={module.description}
            icon={module.icon}
            route={module.route}
            itemCount={module.itemCount}
            lastUpdated={module.lastUpdated}
            canEdit={module.id === 'users' ? isSuperAdmin : true}
            onClick={() => handleModuleClick(module.id)}
          />
        ))}
      </div>
    </div>
  );
}
