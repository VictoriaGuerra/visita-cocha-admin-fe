import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MODULE_TYPES } from '../../config/moduleTypes';
import ModuleCard from '../../components/UI/ModuleCard';
import '../../styles/modules.css';
import { AuthContext } from '../../auth/AuthContext';

const MODULE_DESCRIPTIONS = {
  attractions: 'Gestiona los atractivos turísticos de la ciudad',
  restaurants: 'Administra los restaurantes registrados',
  foods: 'Gestiona el catálogo de comidas típicas',
  itineraries: 'Administra los itinerarios y rutas turísticas',
  mainCategories: 'Gestiona las categorías principales del sistema',
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
    const modulesList = Object.values(MODULE_TYPES).map(module => ({
      id: module.id,
      title: module.name,
      description: MODULE_DESCRIPTIONS[module.id] || 'Gestiona los elementos de este módulo',
      icon: `fa-solid ${module.icon || 'fa-cube'}`,
      route: `/modules/${module.id}`,
      itemCount: 0,
      lastUpdated: null
    }));
    // Añadir tarjeta de Categorías (no está en MODULE_TYPES)
    modulesList.push({
      id: 'categories',
      title: 'Categorías',
      description: MODULE_DESCRIPTIONS['categories'],
      icon: 'fa-solid fa-list',
      route: '/modules/categories',
      itemCount: 0,
      lastUpdated: null
    });
    // Añadir tarjeta de Usuarios (acceso a gestión de usuarios)
    modulesList.push({
      id: 'users',
      title: 'Usuarios',
      description: 'Gestiona cuentas, roles y accesos',
      icon: 'fa-solid fa-users',
      route: '/users',
      itemCount: 0,
      lastUpdated: null,
    });
    setModules(modulesList);
  }, []);

  const handleModuleClick = (moduleId) => {
    navigate(`/modules/${moduleId}`);
  };

  const isSuperAdmin = user?.roles?.includes('SuperAdmin');

  return (
    <div className="modules-container">
      <h2>Módulos</h2>
      <div className="modules-grid">
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
