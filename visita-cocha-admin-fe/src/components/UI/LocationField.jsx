import React, { useState } from 'react';
import './LocationField.css';

const LocationField = ({ value = { lat: '', lng: '', address: '' }, onChange }) => {
  const [location, setLocation] = useState(value);

  const handleChange = (field, newValue) => {
    const updatedLocation = { ...location, [field]: newValue };
    setLocation(updatedLocation);
    onChange(updatedLocation);
  };

  const handleGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleChange('lat', position.coords.latitude.toString());
          handleChange('lng', position.coords.longitude.toString());
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="location-field">
      <div className="location-inputs">
        <div className="input-group">
          <label>Latitud:</label>
          <input
            type="text"
            value={location.lat}
            onChange={(e) => handleChange('lat', e.target.value)}
            placeholder="Latitud"
          />
        </div>
        <div className="input-group">
          <label>Longitud:</label>
          <input
            type="text"
            value={location.lng}
            onChange={(e) => handleChange('lng', e.target.value)}
            placeholder="Longitud"
          />
        </div>
      </div>
      <div className="input-group">
        <label>Dirección:</label>
        <input
          type="text"
          value={location.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Dirección"
          className="address-input"
        />
      </div>
      <button type="button" onClick={handleGeolocation} className="geolocation-button">
        Obtener Ubicación Actual
      </button>
    </div>
  );
};

export default LocationField;