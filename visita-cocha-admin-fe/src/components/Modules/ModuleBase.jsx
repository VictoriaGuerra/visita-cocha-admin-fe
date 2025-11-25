import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ModuleBase.css';

const ModuleBase = ({ 
  title,
  icon,
  entityName,
  columns,
  fetchData,
  handleCreate,
  handleEdit,
  handleDelete
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchData();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="module-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Cargando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="module-error">
        <i className="fas fa-exclamation-circle"></i>
        <span>{error}</span>
        <button onClick={loadData} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="module-container">
      <div className="module-header">
        <div className="module-title">
          <i className={`fas ${icon}`}></i>
          <h1>{title}</h1>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(`/create-${entityName.toLowerCase()}`)}
        >
          <i className="fas fa-plus"></i>
          Crear {entityName}
        </button>
      </div>

      <div className="module-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder={`Buscar ${entityName.toLowerCase()}...`}
          />
        </div>
        <div className="filter-buttons">
          <button className="btn btn-icon">
            <i className="fas fa-filter"></i>
          </button>
          <button className="btn btn-icon">
            <i className="fas fa-sort"></i>
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                {columns.map(col => (
                  <td key={`${item.id}-${col.key}`}>
                    {col.render ? col.render(item[col.key]) : item[col.key]}
                  </td>
                ))}
                <td className="actions-cell">
                  <button 
                    className="btn btn-icon"
                    onClick={() => handleEdit(item.id)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="btn btn-icon text-error"
                    onClick={() => handleDelete(item.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="module-pagination">
        <span className="pagination-info">
          Mostrando 1-10 de {items.length} resultados
        </span>
        <div className="pagination-controls">
          <button className="btn btn-icon" disabled>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="btn btn-icon">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleBase;