import React, { useState } from 'react';
import PropTypes from 'prop-types';

import '../../styles/common.css';
import '../../styles/modern-list.css';

const BaseList = ({
  title,
  items,
  columns,
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  onAdd = null,
  canEdit = false,
  canDelete = false,
  canAdd = true,
  idField = '_id'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter items based on search
  const filteredItems = (items || []).filter(item =>
    Object.values(item || {})
      .join(' ')
      .toLowerCase()
      .includes((searchTerm || '').toLowerCase())
  );

  // Estado para expandir/collapse filas
  const [expandedRow, setExpandedRow] = useState(null);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="modern-list-card">
      <div className="modern-list-header">
        <h2 className="modern-list-title">{title}</h2>
        <div className="modern-list-searchbar">
          <input
            type="text"
            placeholder="Buscar..."
            className="modern-list-searchinput"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          {canAdd && (
            <button
              className="modern-list-addbtn"
              onClick={() => onAdd ? onAdd() : onEdit()}
            >
              <i className="fas fa-plus" />
              Agregar nuevo
            </button>
          )}
        </div>
      </div>

      <div className="modern-list-tablewrap">
        <table className="modern-list-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {paginatedItems.map(item => {
              const itemId = item[idField] || item._id || item.id;
              const isExpanded = expandedRow === itemId;

              return (
                <React.Fragment key={itemId}>
                  <tr
                    className={`modern-list-row${isExpanded ? ' expanded' : ' collapsed'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setExpandedRow(isExpanded ? null : itemId)}
                  >
                    {columns.map(col => (
                      <td key={`${itemId}-${col.key}`}>
                        {col.render ? col.render(item[col.key], item) : item[col.key]}
                      </td>
                    ))}
                    <td>
                      <div className="modern-list-actions">
                        <button
                          className="modern-list-actionbtn view"
                          title="Ver detalles"
                          onClick={e => { e.stopPropagation(); onView(itemId); }}
                        >
                          <i className="fas fa-eye" />
                        </button>

                        {canEdit && (
                          <button
                            className="modern-list-actionbtn edit"
                            title="Editar"
                            onClick={e => { e.stopPropagation(); onEdit(itemId); }}
                          >
                            <i className="fas fa-edit" />
                          </button>
                        )}

                        {canDelete && (
                          <button
                            className="modern-list-actionbtn delete"
                            title="Eliminar"
                            onClick={e => { e.stopPropagation(); onDelete(itemId); }}
                          >
                            <i className="fas fa-trash" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="modern-list-details-row">
                      <td colSpan={columns.length + 1}>
                        <div className="modern-list-details">
                          <strong>Descripción:</strong> {item.descripcion || item.description || 'Sin descripción'}<br />
                          <strong>Dirección:</strong> {item.direccion || item.ubicacion?.direccion || '-'}<br />
                          <strong>Barrio:</strong> {item.barrio || item.ubicacion?.barrio || '-'}<br />
                          <strong>Ciudad:</strong> {item.ciudad || item.ubicacion?.ciudad || '-'}<br />
                          <strong>País:</strong> {item.pais || item.ubicacion?.pais || '-'}<br />
                          <strong>Horario:</strong> {item.horario || '-'}<br />
                          <strong>Tags:</strong> {(item.tags || []).map((tag, i) => (
                            <span key={i} className="modern-list-badge">{tag}</span>
                          ))}<br />
                          <strong>Actividades:</strong> {(item.actividades || []).join(', ') || '-'}<br />
                          <strong>Recomendaciones:</strong> {(item.recomendaciones || []).join(', ') || '-'}<br />
                          <strong>Imagen:</strong> {item.imagen ? (
                            <a href={item.imagen} target="_blank" rel="noopener noreferrer">Ver imagen</a>
                          ) : 'No disponible'}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="modern-list-pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`modern-list-pageitem${currentPage === page ? ' active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

BaseList.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    render: PropTypes.func
  })).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  canAdd: PropTypes.bool
};

export default BaseList;
