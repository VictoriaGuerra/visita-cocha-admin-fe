import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../../styles/common.css';

const ModuleCard = ({ 
  title, 
  description, 
  icon, 
  route, 
  itemCount, 
  lastUpdated,
  canEdit,
  canDelete 
}) => {
  return (
    <div className="module-card" style={{
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 2px 12px rgba(63,144,142,0.08)',
      padding: 28,
      minHeight: 260,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'box-shadow 0.2s',
      position: 'relative',
      marginBottom: 0
    }}>
      <div className="module-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <i className={`fas ${icon}`} style={{ fontSize: 32, color: '#3f908e', minWidth: 36 }}></i>
          <h3 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{title}</h3>
        </div>
        <span style={{
          background: '#f3f4f6',
          color: '#3f908e',
          borderRadius: 12,
          fontWeight: 700,
          fontSize: 20,
          padding: '4px 18px',
          minWidth: 40,
          textAlign: 'center',
          marginLeft: 8
        }}>{itemCount}</span>
      </div>
      <div className="module-card-body" style={{ marginTop: 18, flex: 1 }}>
        <p style={{ color: '#444', fontSize: 16, marginBottom: 18 }}>{description}</p>
        {lastUpdated && (
          <div style={{ fontSize: 13, color: '#888' }}>
            Última actualización: {new Date(lastUpdated).toLocaleDateString()}
          </div>
        )}
      </div>
      <div className="module-card-footer" style={{ display: 'flex', gap: 12, marginTop: 18 }}>
        <Link to={route} className="btn btn-secondary" style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>
          <i className="fas fa-list"></i> Ver lista
        </Link>
        {canEdit && (
          <Link to={`${route}${route === '/users' ? '/new' : '/new'}`} className="btn btn-primary" style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>
            <i className="fas fa-plus"></i> {route === '/users' ? 'Crear usuario' : 'Agregar'}
          </Link>
        )}
      </div>
    </div>
  );
};

ModuleCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  itemCount: PropTypes.number,
  lastUpdated: PropTypes.string,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool
};

export default ModuleCard;