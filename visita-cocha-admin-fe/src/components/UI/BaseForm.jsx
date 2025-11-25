import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/common.css';

const BaseForm = ({ 
  title,
  fields,
  values,
  onChange,
  onSubmit,
  isLoading,
  error
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <form onSubmit={handleSubmit} className="card-body">
        {error && (
          <div className="error-message mb-4">
            {error}
          </div>
        )}

        {fields.map(field => (
          <div key={field.name} className="form-group">
            <label className="form-label">
              {field.label}
              {field.required && <span className="text-danger">*</span>}
            </label>

            {field.type === 'select' ? (
              <select
                name={field.name}
                value={values[field.name] || ''}
                onChange={e => onChange(field.name, e.target.value)}
                className="form-control"
                required={field.required}
              >
                <option value="">Seleccionar...</option>
                {field.options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                name={field.name}
                value={values[field.name] || ''}
                onChange={e => onChange(field.name, e.target.value)}
                className="form-control"
                required={field.required}
                rows={4}
              />
            ) : field.type === 'file' ? (
              <input
                type="file"
                name={field.name}
                onChange={e => onChange(field.name, e.target.files[0])}
                className="form-control"
                required={field.required}
                accept={field.accept}
              />
            ) : (
              <input
                type={field.type || 'text'}
                name={field.name}
                value={values[field.name] || ''}
                onChange={e => onChange(field.name, e.target.value)}
                className="form-control"
                required={field.required}
                placeholder={field.placeholder}
              />
            )}

            {field.help && (
              <small className="form-help text-gray-500">
                {field.help}
              </small>
            )}
          </div>
        ))}

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

BaseForm.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    help: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }))
  })).isRequired,
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string
};

export default BaseForm;