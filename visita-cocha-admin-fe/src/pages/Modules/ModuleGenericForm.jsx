import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BaseForm from '../../components/UI/BaseForm';
import { MODULE_TYPES } from '../../config/moduleTypes';
import { getContentById, createContent, updateContent } from '../../api';

export default function ModuleGenericForm() {
  const { moduleId, id } = useParams();
  const navigate = useNavigate();

  
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Detectar tipo de módulo (por ejemplo: attractions, restaurants)
  const moduleType =
    Object.values(MODULE_TYPES).find((m) => m.id === moduleId) || {
      id: moduleId,
      name: moduleId,
      fields: [{ name: 'name', type: 'text', label: 'Nombre' }],
    };

  // Cargar datos si es edición
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (id) {
        try {
          setLoading(true);
          const item = await getContentById(moduleId, id);
          if (mounted && item) setValues(item);
        } catch (err) {
          console.error('Error cargando item para edición:', err);
          setError('Error al cargar datos');
        } finally {
          setLoading(false);
        }
      } else {
        // Valores por defecto si es nuevo
        const defaults = {};
        (moduleType.fields || []).forEach((f) => {
          defaults[f.name] = f.default || '';
        });
        setValues(defaults);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [moduleId, id]);

  // Manejo de cambios en campos
  const handleFieldChange = (fieldName, value) => {
    // Si es un archivo (imagen), convertir a base64
    if (
      value &&
      (value instanceof File ||
        (value instanceof Object && value[0] && value[0] instanceof File))
    ) {
      const files = value instanceof File ? [value] : Array.from(value);
      Promise.all(
        files.map(
          (f) =>
            new Promise((res, rej) => {
              const reader = new FileReader();
              reader.onload = () => res(reader.result);
              reader.onerror = rej;
              reader.readAsDataURL(f);
            })
        )
      )
        .then((dataUrls) => {
          setValues((prev) => ({
            ...prev,
            [fieldName]: dataUrls.length === 1 ? dataUrls[0] : dataUrls,
          }));
        })
        .catch((err) => console.error(err));
    } else {
      setValues((prev) => ({ ...prev, [fieldName]: value }));
    }
  };

  // Enviar formulario
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...formData,
        _id: id || formData.name?.toLowerCase().replace(/\s+/g, '-') || '',
        location: {
          address: formData.location?.address || '',
          coords: {
            lat: formData.location?.lat || '',
            lng: formData.location?.lng || '',
          },
        },
        contact: {
          mail: formData.contact?.mail || '',
          phone: formData.contact?.phone || '',
          link: formData.contact?.link || '',
        },
      };

      if (id) await updateContent(moduleId, id, payload);
      else await createContent(moduleId, payload);

      navigate(`/modules/${moduleId}`);
    } catch (e) {
      console.error(e);
      setError('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  // Convertir campos del módulo en definición para BaseForm
  const formFields = (moduleType.fields || []).map((f) => {
    const field = {
      name: f.name,
      label: f.label || f.name,
      type: f.type || 'text',
      required: !!f.required,
    };
    if (f.type === 'select' || f.type === 'multiselect') {
      field.options = f.options || [];
    }
    if (f.type === 'file' || f.type === 'image') {
      field.accept = f.accept || 'image/*';
    }
    return field;
  });

  if (!moduleType) return <div>Módulo desconocido</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {id ? 'Editar' : 'Nuevo'} - {moduleType.name}
      </h2>

      <BaseForm
        title={`${id ? 'Editar' : 'Nuevo'} ${moduleType.name}`}
        fields={formFields}
        values={values}
        onChange={handleFieldChange}
        onSubmit={handleSubmit}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}
