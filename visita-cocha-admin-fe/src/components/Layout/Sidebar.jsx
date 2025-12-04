import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import { usePermissions } from '../../auth/permissions';
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
      title: 'Rutas',
      path: '/routes',
      icon: 'fa-route',
    },
    {
      title: 'Usuarios',
      path: '/users',
      icon: 'fa-users',
      superAdminOnly: true,
    },
    {
      title: 'Correos',
      path: '/emails',
      icon: 'fa-envelope',
      adminOnly: true,
    },
    {
      title: 'Configuración',
      path: '/settings',
      icon: 'fa-cog',
    },
    {
      title: 'Analytics',
      path: '/analytics',
      icon: 'fa-chart-area',
      module: 'analytics'
    }
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
          const canViewAnalytics = usePermissions(user?.role || user?.roles || user, 'analytics', 'read');
          const rawRoles = user?.roles || (user?.role ? [user.role] : []);
          const normRoles = Array.isArray(rawRoles) ? rawRoles.map(r => String(r).toUpperCase()) : [];
          const isSuper = normRoles.includes('SUPERADMIN') || normRoles.includes('SUPER-ADMIN') || normRoles.includes('SUPER ADMIN');
          const isAdmin = normRoles.includes('ADMIN');

          const canSee = item.module === 'analytics'
            ? canViewAnalytics
            : item.superAdminOnly
            ? isSuper
            : (!item.adminOnly || (rawRoles && (isSuper || isAdmin)));
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
        <button className="logout-button" onClick={logout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;