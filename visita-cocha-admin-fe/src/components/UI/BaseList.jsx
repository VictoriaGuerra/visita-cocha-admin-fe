import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/common.css';

const BaseList = ({ 
  title,
  items,
  columns,
  onEdit,
  onDelete,
  onView,
  canEdit,
  canDelete,
  canAdd = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter items based on search
  const filteredItems = items.filter(item => 
    Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {canAdd && (
            <button 
              className="btn btn-primary"
              onClick={() => onEdit()}
            >
              <i className="fas fa-plus"></i>
              Agregar nuevo
            </button>
          )}
        </div>
      </div>

      <div className="card-body p-0">
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
  {paginatedItems.map(item => (
    <tr key={item._id || item.id}>
      {columns.map(col => (
        <td key={`${item._id || item.id}-${col.key}`}>
          {col.render ? col.render(item[col.key]) : item[col.key]}
        </td>
      ))}
      <td>
        <div className="flex gap-2">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onView(item._id || item.id)}
          >
            <i className="fas fa-eye"></i>
          </button>
          {canEdit && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onEdit(item._id || item.id)}
            >
              <i className="fas fa-edit"></i>
            </button>
          )}
          {canDelete && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(item._id || item.id)}
            >
              <i className="fas fa-trash"></i>
            </button>
          )}
        </div>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-item ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
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
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
  canAdd: PropTypes.bool
};

export default BaseList;
