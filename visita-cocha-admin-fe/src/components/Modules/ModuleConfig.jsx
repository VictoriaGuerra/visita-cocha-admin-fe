import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import BaseForm from '../UI/BaseForm';
import { PERMISSIONS, MODULES } from '../../auth/permissions';
import '../../styles/common.css';

const ModuleConfig = () => {
  const { moduleId } = useParams();
  const { user } = useContext(AuthContext);
  const [config, setConfig] = useState({
    name: '',
    description: '',
    enabled: true,
    roles: {
      admin: {
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false
      },
      mantenedor: {
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false
      }
    },
    requiredFields: [],
    customFields: [],
    validations: {}
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (moduleId) {
      loadModuleConfig();
    }
  }, [moduleId]);

  const loadModuleConfig = async () => {
    try {
      // Aquí irá la llamada a tu API para cargar la configuración
      const response = await fetch(`/api/modules/${moduleId}/config`);
      const data = await response.json();
      setConfig(data);
    } catch (err) {
      setError('Error al cargar la configuración del módulo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // Aquí irá la llamada a tu API para guardar la configuración
      await fetch(`/api/modules/${moduleId}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      // Actualizar la configuración local
      setConfig(values);
    } catch (err) {
      setError('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: 'name',
      label: 'Nombre del Módulo',
      required: true
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea'
    },
    {
      name: 'enabled',
      label: 'Estado del Módulo',
      type: 'select',
      options: [
        { value: 'true', label: 'Activo' },
        { value: 'false', label: 'Inactivo' }
      ]
    },
    {
      name: 'roles.admin',
      label: 'Permisos de Administrador',
      type: 'checkboxGroup',
      options: [
        { value: 'canCreate', label: 'Crear' },
        { value: 'canRead', label: 'Ver' },
        { value: 'canUpdate', label: 'Editar' },
        { value: 'canDelete', label: 'Eliminar' }
      ]
    },
    {
      name: 'roles.mantenedor',
      label: 'Permisos de Mantenedor',
      type: 'checkboxGroup',
      options: [
        { value: 'canCreate', label: 'Crear' },
        { value: 'canRead', label: 'Ver' },
        { value: 'canUpdate', label: 'Editar' },
        { value: 'canDelete', label: 'Eliminar' }
      ]
    },
    {
      name: 'requiredFields',
      label: 'Campos Requeridos',
      type: 'multiselect',
      options: [
        { value: 'name', label: 'Nombre' },
        { value: 'description', label: 'Descripción' },
        { value: 'image', label: 'Imagen' },
        { value: 'location', label: 'Ubicación' }
      ]
    },
    {
      name: 'customFields',
      label: 'Campos Personalizados',
      type: 'dynamicFields',
      fields: [
        { name: 'name', label: 'Nombre del Campo' },
        { name: 'type', label: 'Tipo', options: ['text', 'number', 'date', 'select'] },
        { name: 'required', label: 'Requerido', type: 'boolean' }
      ]
    }
  ];

  if (!user || user.role !== 'superadmin') {
    return <div className="error-message">No tienes permisos para ver esta página</div>;
  }

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="module-config">
      <h2 className="text-2xl font-bold mb-6">Configuración del Módulo</h2>
      <BaseForm
        title="Configuración"
        fields={fields}
        values={config}
        onSubmit={handleSubmit}
        isLoading={loading}
        error={error}
      />

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Vista Previa de Permisos</h3>
        <div className="card">
          <div className="card-body">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rol</th>
                  <th>Crear</th>
                  <th>Ver</th>
                  <th>Editar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(config.roles).map(([role, permissions]) => (
                  <tr key={role}>
                    <td className="font-semibold capitalize">{role}</td>
                    <td>{permissions.canCreate ? '✓' : '×'}</td>
                    <td>{permissions.canRead ? '✓' : '×'}</td>
                    <td>{permissions.canUpdate ? '✓' : '×'}</td>
                    <td>{permissions.canDelete ? '✓' : '×'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleConfig;