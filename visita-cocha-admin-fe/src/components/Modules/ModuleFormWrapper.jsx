import React from 'react';
import { useParams } from 'react-router-dom';
import ModuleForm from './ModuleForm';

const ModuleFormWrapper = () => {
  const { moduleType } = useParams();

  const moduleConfigs = {
    attractions: {
      title: 'Atractivo Turístico',
      icon: 'fa-mountain',
      fields: [
        { name: 'name', label: 'Nombre', type: 'text', required: true },
        { name: 'description', label: 'Descripción', type: 'textarea', required: true },
        { name: 'category', label: 'Categoría', type: 'select', required: true,
          options: ['Histórico', 'Natural', 'Cultural', 'Religioso', 'Arqueológico'] },
        { name: 'address', label: 'Dirección', type: 'text', required: true },
        { name: 'location', label: 'Ubicación', type: 'location', required: true },
        { name: 'visitHours', label: 'Horario de Visita', type: 'schedule', required: true },
        { name: 'ticketPrice', label: 'Precio de Entrada', type: 'price', required: true },
        { name: 'contactPhone', label: 'Teléfono de Contacto', type: 'tel', required: true },
        { name: 'email', label: 'Correo Electrónico', type: 'email', required: false },
        { name: 'website', label: 'Sitio Web', type: 'url', required: false },
        { name: 'images', label: 'Imágenes', type: 'images', required: true, multiple: true },
        { name: 'amenities', label: 'Servicios', type: 'multiselect', required: false,
          options: ['Estacionamiento', 'Guía Turístico', 'Baños', 'Cafetería', 'Tienda de Souvenirs'] },
        { name: 'accessibility', label: 'Accesibilidad', type: 'multiselect', required: false,
          options: ['Rampa de Acceso', 'Baños Adaptados', 'Estacionamiento para Discapacitados'] },
        { name: 'status', label: 'Estado', type: 'select', required: true,
          options: ['Activo', 'Mantenimiento', 'Cerrado Temporalmente'] },
      ]
    },
    restaurants: {
      title: 'Restaurante',
      icon: 'fa-utensils',
      fields: [
        { name: 'name', label: 'Nombre', type: 'text', required: true },
        { name: 'description', label: 'Descripción', type: 'textarea', required: true },
        { name: 'category', label: 'Categoría', type: 'select', required: true,
          options: ['Tradicional', 'Internacional', 'Fusión', 'Cafetería', 'Bar'] },
        { name: 'cuisine', label: 'Tipo de Cocina', type: 'select', required: true,
          options: ['Peruana', 'Italiana', 'China', 'Japonesa', 'Mexicana', 'Internacional'] },
        { name: 'address', label: 'Dirección', type: 'text', required: true },
        { name: 'location', label: 'Ubicación', type: 'location', required: true },
        { name: 'schedule', label: 'Horario', type: 'schedule', required: true },
        { name: 'priceRange', label: 'Rango de Precios', type: 'select', required: true,
          options: ['$', '$$', '$$$', '$$$$'] },
        { name: 'capacity', label: 'Capacidad', type: 'number', required: true },
        { name: 'contactPhone', label: 'Teléfono', type: 'tel', required: true },
        { name: 'email', label: 'Correo Electrónico', type: 'email', required: false },
        { name: 'website', label: 'Sitio Web', type: 'url', required: false },
        { name: 'images', label: 'Imágenes', type: 'images', required: true, multiple: true },
        { name: 'menu', label: 'Menú', type: 'file', required: true, accept: '.pdf,.jpg,.png' },
        { name: 'features', label: 'Características', type: 'multiselect', required: false,
          options: ['Wifi', 'Estacionamiento', 'Terraza', 'Música en Vivo', 'Delivery'] },
        { name: 'paymentMethods', label: 'Métodos de Pago', type: 'multiselect', required: true,
          options: ['Efectivo', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Transferencia'] },
        { name: 'status', label: 'Estado', type: 'select', required: true,
          options: ['Abierto', 'Cerrado Temporalmente', 'Próxima Apertura'] },
      ]
    },
    hotels: {
      title: 'Hotel',
      icon: 'fa-hotel',
      fields: [
        { name: 'name', label: 'Nombre', type: 'text', required: true },
        { name: 'description', label: 'Descripción', type: 'textarea', required: true },
        { name: 'category', label: 'Categoría', type: 'select', required: true,
          options: ['Hotel', 'Hostal', 'Apart-Hotel', 'Resort'] },
        { name: 'stars', label: 'Estrellas', type: 'number', required: true, min: 1, max: 5 },
        { name: 'address', label: 'Dirección', type: 'text', required: true },
        { name: 'location', label: 'Ubicación', type: 'location', required: true },
        { name: 'checkIn', label: 'Hora de Check-in', type: 'time', required: true },
        { name: 'checkOut', label: 'Hora de Check-out', type: 'time', required: true },
        { name: 'totalRooms', label: 'Número Total de Habitaciones', type: 'number', required: true },
        { name: 'roomTypes', label: 'Tipos de Habitación', type: 'rooms', required: true },
        { name: 'priceRange', label: 'Rango de Precios', type: 'select', required: true,
          options: ['$', '$$', '$$$', '$$$$'] },
        { name: 'contactPhone', label: 'Teléfono', type: 'tel', required: true },
        { name: 'email', label: 'Correo Electrónico', type: 'email', required: true },
        { name: 'website', label: 'Sitio Web', type: 'url', required: false },
        { name: 'images', label: 'Imágenes', type: 'images', required: true, multiple: true },
        { name: 'amenities', label: 'Servicios', type: 'multiselect', required: true,
          options: [
            'Wifi Gratis', 'Estacionamiento', 'Piscina', 'Gimnasio', 'Spa',
            'Restaurante', 'Bar', 'Servicio a la Habitación', 'Lavandería',
            'Sala de Conferencias', 'Business Center'
          ]
        },
        { name: 'paymentMethods', label: 'Métodos de Pago', type: 'multiselect', required: true,
          options: ['Efectivo', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Transferencia'] },
        { name: 'status', label: 'Estado', type: 'select', required: true,
          options: ['Operativo', 'Renovación', 'Próxima Apertura'] },
      ]
    },
    events: {
      title: 'Evento',
      icon: 'fa-calendar',
      fields: [
        { name: 'name', label: 'Nombre del Evento', type: 'text', required: true },
        { name: 'description', label: 'Descripción', type: 'textarea', required: true },
        { name: 'category', label: 'Categoría', type: 'select', required: true,
          options: ['Cultural', 'Musical', 'Deportivo', 'Gastronómico', 'Artístico', 'Empresarial'] },
        { name: 'startDate', label: 'Fecha de Inicio', type: 'datetime-local', required: true },
        { name: 'endDate', label: 'Fecha de Fin', type: 'datetime-local', required: true },
        { name: 'venue', label: 'Lugar', type: 'text', required: true },
        { name: 'location', label: 'Ubicación', type: 'location', required: true },
        { name: 'organizer', label: 'Organizador', type: 'text', required: true },
        { name: 'capacity', label: 'Capacidad', type: 'number', required: true },
        { name: 'ticketInfo', label: 'Información de Entradas', type: 'tickets', required: true },
        { name: 'contactPhone', label: 'Teléfono de Contacto', type: 'tel', required: true },
        { name: 'email', label: 'Correo Electrónico', type: 'email', required: true },
        { name: 'website', label: 'Sitio Web del Evento', type: 'url', required: false },
        { name: 'images', label: 'Imágenes', type: 'images', required: true, multiple: true },
        { name: 'schedule', label: 'Programa del Evento', type: 'schedule', required: true },
        { name: 'amenities', label: 'Servicios', type: 'multiselect', required: false,
          options: [
            'Estacionamiento', 'Alimentación', 'Baños', 'Área VIP',
            'Zona de Descanso', 'Primeros Auxilios'
          ]
        },
        { name: 'restrictions', label: 'Restricciones', type: 'multiselect', required: false,
          options: [
            'Solo Mayores de 18', 'No Mascotas', 'No Alimentos Externos',
            'No Bebidas Alcohólicas', 'No Fotografías'
          ]
        },
        { name: 'status', label: 'Estado', type: 'select', required: true,
          options: ['Programado', 'Entradas Agotadas', 'Cancelado', 'Pospuesto'] },
      ]
    }
  };

  const config = moduleConfigs[moduleType] || {
    title: 'Elemento',
    icon: 'fa-plus',
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'description', label: 'Descripción', type: 'textarea', required: true },
    ]
  };

  return <ModuleForm config={config} moduleType={moduleType} />;
};

export default ModuleFormWrapper;