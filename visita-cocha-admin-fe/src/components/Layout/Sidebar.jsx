import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import { isSuperAdmin, isAdmin } from '../../utils/roleUtils';
import './Sidebar.css';
import logo from '../../assets/images/logo.png';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/',
      icon: 'fa-chart-pie',
    },
    {
      title: 'Módulos',
      path: '/modules',
      icon: 'fa-cubes',
    },
    {
      title: 'Atractivos Turísticos',
      path: '/modules/attractions',
      icon: 'fa-mountain',
    },
    {
      title: 'Restaurantes',
      path: '/modules/restaurants',
      icon: 'fa-utensils',
    },
    {
      title: 'Comidas',
      path: '/modules/foods',
      icon: 'fa-apple-alt',
    },
    {
      title: 'Itinerarios',
      path: '/modules/itineraries',
      icon: 'fa-route',
    },
    {
      title: 'Rutas Turísticas',
      path: '/modules/routes',
      icon: 'fa-map-marked-alt',
    },
    {
      title: 'Rutas de Transporte',
      path: '/transport-routes',
      icon: 'fa-bus',
    },
    {
      title: 'Eventos',
      path: '/modules/events',
      icon: 'fa-calendar-alt',
    },
    {
      title: 'Hoteles',
      path: '/modules/hotels',
      icon: 'fa-hotel',
    },
    {
      title: 'Categorías',
      path: '/modules/categories',
      icon: 'fa-tags',
    },
    {
      title: 'Anuncios',
      path: '/modules/announcements',
      icon: 'fa-bullhorn',
    },
    {
      title: 'Puntos',
      path: '/modules/points',
      icon: 'fa-map-marker-alt',
    },
    {
      title: 'Usuarios',
      path: '/users',
      icon: 'fa-users',
      superAdminOnly: true,
    },
    {
      title: 'Configuración',
      path: '/settings',
      icon: 'fa-cog',
      superAdminOnly: true,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img 
          src={logo}
          alt="Visita Cocha"
          className="sidebar-logo"
        />
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const canSee = item.superAdminOnly
            ? isSuperAdmin(user)
            : (!item.adminOnly || isSuperAdmin(user) || isAdmin(user));
          if (!canSee) return null;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info-card">
          <div className="user-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="user-details">
            <div className="user-email">{user?.email || 'Usuario'}</div>
            <div className="user-role">{user?.rol || user?.role || 'SuperAdmin'}</div>
          </div>
        </div>
        <button className="logout-button" onClick={logout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;