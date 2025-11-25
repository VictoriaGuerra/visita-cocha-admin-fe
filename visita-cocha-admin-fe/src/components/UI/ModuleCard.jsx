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
    <div className="module-card">
      <div className="module-card-header">
        <div className="flex items-center gap-3">
          <i className={`fas ${icon} text-xl text-primary`}></i>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {itemCount && (
          <span className="badge badge-success">
            {itemCount} items
          </span>
        )}
      </div>
      
      <div className="module-card-body">
        <p className="text-gray-600 mb-4">{description}</p>
        {lastUpdated && (
          <div className="text-sm text-gray-500">
            Última actualización: {new Date(lastUpdated).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="module-card-footer">
        <Link to={route} className="btn btn-secondary">
          <i className="fas fa-list"></i>
          Ver lista
        </Link>
        {canEdit && (
          <Link to={`${route}${route === '/users' ? '/new' : '/new'}`} className="btn btn-primary">
            <i className="fas fa-plus"></i>
            {route === '/users' ? 'Crear usuario' : 'Agregar'}
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