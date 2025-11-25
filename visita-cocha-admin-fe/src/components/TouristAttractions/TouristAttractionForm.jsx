import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BaseForm from '../UI/BaseForm';
import { fetchTouristAttraction, createTouristAttraction, updateTouristAttraction } from '../../api/api';

const TouristAttractionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: '',
    description: '',
    city: '',
    address: '',
    category: '',
    images: [],
    status: true,
    coordinates: {
      lat: '',
      lng: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadAttraction();
    }
  }, [id]);

  const loadAttraction = async () => {
    try {
      const data = await fetchTouristAttraction(id);
      setValues(data);
    } catch (err) {
      setError('Error al cargar el atractivo turístico');
      console.error(err);
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setValues(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setValues(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (formValues) => {
    setLoading(true);
    setError(null);
    
    try {
      if (id) {
        await updateTouristAttraction(id, formValues);
      } else {
        await createTouristAttraction(formValues);
      }
      navigate('/attractions');
    } catch (err) {
      setError('Error al guardar el atractivo turístico');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: 'name',
      label: 'Nombre',
      required: true,
      placeholder: 'Nombre del atractivo turístico'
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      required: true,
      placeholder: 'Descripción detallada del atractivo'
    },
    {
      name: 'city',
      label: 'Ciudad',
      required: true
    },
    {
      name: 'address',
      label: 'Dirección',
      required: true
    },
    {
      name: 'category',
      label: 'Categoría',
      type: 'select',
      required: true,
      options: [
        { value: 'historical', label: 'Histórico' },
        { value: 'cultural', label: 'Cultural' },
        { value: 'natural', label: 'Natural' },
        { value: 'entertainment', label: 'Entretenimiento' }
      ]
    },
    {
      name: 'coordinates.lat',
      label: 'Latitud',
      type: 'number',
      required: true,
      step: 'any'
    },
    {
      name: 'coordinates.lng',
      label: 'Longitud',
      type: 'number',
      required: true,
      step: 'any'
    },
    {
      name: 'images',
      label: 'Imágenes',
      type: 'file',
      accept: 'image/*',
      multiple: true,
      help: 'Puedes seleccionar múltiples imágenes'
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'true', label: 'Activo' },
        { value: 'false', label: 'Inactivo' }
      ]
    }
  ];

  return (
    <BaseForm
      title={id ? 'Editar Atractivo Turístico' : 'Nuevo Atractivo Turístico'}
      fields={fields}
      values={values}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isLoading={loading}
      error={error}
    />
  );
};

export default TouristAttractionForm;