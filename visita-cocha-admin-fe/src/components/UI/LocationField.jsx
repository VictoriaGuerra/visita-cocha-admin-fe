import React, { useState, useEffect } from 'react';
import './LocationField.css';

const LocationField = ({ value = { coords: { lat: '', lng: '' }, address: '' }, onChange }) => {
  const [location, setLocation] = useState(value);

  useEffect(() => {
    setLocation(value);
  }, [value]);

  const handleChange = (field, newValue) => {
    let updatedLocation;
    
    if (field === 'lat' || field === 'lng') {
      updatedLocation = {
        ...location,
        coords: {
          ...location.coords,
          [field]: newValue
        }
      };
    } else {
      updatedLocation = { ...location, [field]: newValue };
    }
    
    setLocation(updatedLocation);
    onChange(updatedLocation);
  };

  const handleGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const updatedLocation = {
            ...location,
            coords: {
              lat: position.coords.latitude.toString(),
              lng: position.coords.longitude.toString()
            }
          };
          setLocation(updatedLocation);
          onChange(updatedLocation);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          alert('No se pudo obtener la ubicación. Verifica los permisos del navegador.');
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización');
    }
  };

  return (
    <div className="location-field">
      <div className="location-inputs">
        <div className="input-group">
          <label>Latitud:</label>
          <input
            type="text"
            value={location.coords?.lat || ''}
            onChange={(e) => handleChange('lat', e.target.value)}
            placeholder="-17.3895"
          />
        </div>
        <div className="input-group">
          <label>Longitud:</label>
          <input
            type="text"
            value={location.coords?.lng || ''}
            onChange={(e) => handleChange('lng', e.target.value)}
            placeholder="-66.1568"
          />
        </div>
      </div>
      <div className="input-group">
        <label>Dirección:</label>
        <input
          type="text"
          value={location.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Av. Heroínas 123, Cochabamba"
          className="address-input"
        />
      </div>
      <button type="button" onClick={handleGeolocation} className="geolocation-button">
        📍 Obtener Ubicación Actual
      </button>
    </div>
  );
};

export default LocationField;