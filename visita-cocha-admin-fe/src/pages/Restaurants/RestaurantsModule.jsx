import React from 'react';
import ModuleBase from '../components/Modules/ModuleBase';
import { mockRestaurants } from '../data/mockData';

const RestaurantsModule = () => {
  const columns = [
    { 
      key: 'name', 
      label: 'Nombre' 
    },
    { 
      key: 'address', 
      label: 'Dirección' 
    },
    { 
      key: 'category', 
      label: 'Categoría' 
    },
    { 
      key: 'rating', 
      label: 'Calificación',
      render: (value) => (
        <div className="rating">
          {value} <i className="fas fa-star text-warning"></i>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Estado',
      render: (value) => (
        <span className={`status-badge ${value.toLowerCase()}`}>
          {value}
        </span>
      )
    }
  ];

  const fetchData = async () => {
    // Simular llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRestaurants);
      }, 1000);
    });
  };

  const handleCreate = () => {
    // Implementar lógica de creación
    console.log('Crear nuevo restaurante');
  };

  const handleEdit = (id) => {
    // Implementar lógica de edición
    console.log('Editar restaurante:', id);
  };

  const handleDelete = (id) => {
    // Implementar lógica de eliminación
    console.log('Eliminar restaurante:', id);
  };

  return (
    <ModuleBase 
      title="Restaurantes"
      icon="fa-utensils"
      entityName="Restaurante"
      columns={columns}
      fetchData={fetchData}
      handleCreate={handleCreate}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default RestaurantsModule;