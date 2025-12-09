import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationPickerMap.css';

// Fijar icono de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Componente para manejar clicks en el mapa
function MapClickHandler({ onMapClick }) {
  const map = useMap();
  
  useEffect(() => {
    const handleClick = (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };
    
    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);
  
  return null;
}

const LocationPickerMap = ({ 
  latitude = -17.3895, 
  longitude = -66.1568, 
  onLocationChange,
  label = 'Ubicación (haz click en el mapa para cambiar)'
}) => {
  const [lat, setLat] = useState(latitude);
  const [lng, setLng] = useState(longitude);
  const [address, setAddress] = useState('');

  useEffect(() => {
    setLat(latitude);
    setLng(longitude);
  }, [latitude, longitude]);

  const handleMapClick = (newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);
    
    if (onLocationChange) {
      onLocationChange({
        lat: parseFloat(newLat.toFixed(6)),
        lng: parseFloat(newLng.toFixed(6)),
        address: address || `${newLat.toFixed(4)}, ${newLng.toFixed(4)}`
      });
    }
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    
    if (onLocationChange) {
      onLocationChange({
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
        address: newAddress
      });
    }
  };

  return (
    <div className="location-picker">
      <label>📍 {label}</label>
      
      <div className="location-inputs">
        <div className="input-group">
          <label>Latitud</label>
          <input 
            type="number" 
            step="0.0001"
            value={lat} 
            readOnly
            className="input-readonly"
          />
        </div>
        <div className="input-group">
          <label>Longitud</label>
          <input 
            type="number" 
            step="0.0001"
            value={lng} 
            readOnly
            className="input-readonly"
          />
        </div>
      </div>

      <div className="input-group">
        <label>Dirección (opcional)</label>
        <input 
          type="text" 
          value={address}
          onChange={handleAddressChange}
          placeholder="Ej: Calle Principal 123, Cochabamba"
        />
      </div>

      <div className="map-container">
        <MapContainer 
          center={[lat, lng]} 
          zoom={13} 
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={[lat, lng]}>
            <Popup>
              Lat: {lat.toFixed(4)}<br />
              Lng: {lng.toFixed(4)}
            </Popup>
          </Marker>
          <MapClickHandler onMapClick={handleMapClick} />
        </MapContainer>
      </div>
      
      <div className="map-hint">
        💡 Haz click en el mapa para cambiar la ubicación
      </div>
    </div>
  );
};

export default LocationPickerMap;
