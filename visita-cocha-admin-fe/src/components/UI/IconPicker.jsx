import React, { useState } from 'react';

const IconPicker = ({ value, onChange, type = 'hotel' }) => {
  const [showPicker, setShowPicker] = useState(false);

  // Iconos predefinidos para hoteles
  const hotelIcons = [
    { code: 'fa-gem', label: 'Lujo' },
    { code: 'fa-star', label: 'Estrella' },
    { code: 'fa-hotel', label: 'Hotel' },
    { code: 'fa-bed', label: 'Hostal' },
    { code: 'fa-umbrella-beach', label: 'Resort' },
    { code: 'fa-building', label: 'Edificio' },
    { code: 'fa-store', label: 'Boutique' },
    { code: 'fa-leaf', label: 'Eco' },
    { code: 'fa-home', label: 'Casa' },
    { code: 'fa-campground', label: 'Camping' },
    { code: 'fa-mountain', label: 'Montaña' },
    { code: 'fa-tree', label: 'Cabaña' },
    { code: 'fa-crown', label: 'Premium' },
    { code: 'fa-coins', label: 'Económico' },
    { code: 'fa-spa', label: 'Spa' },
    { code: 'fa-swimming-pool', label: 'Piscina' },
  ];

  const selectIcon = (iconCode) => {
    onChange({ target: { name: 'icon', value: iconCode } });
    setShowPicker(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 14px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          background: 'white',
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontSize: '14px',
          color: '#374151'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#3f908e';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(63, 144, 142, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: value ? '#f0fdfa' : '#f9fafb',
          borderRadius: '6px',
          border: '1px solid',
          borderColor: value ? '#99f6e4' : '#e5e7eb'
        }}>
          {value ? (
            value.startsWith('bi-') ? 
              <i className={`bi ${value}`} style={{ fontSize: '24px', color: '#0d9488' }}></i> :
            value.startsWith('fa-') ? 
              <i className={`fas ${value}`} style={{ fontSize: '24px', color: '#0d9488' }}></i> :
            <span style={{ fontSize: '24px' }}>{value}</span>
          ) : (
            <i className="fas fa-icons" style={{ fontSize: '20px', color: '#9ca3af' }}></i>
          )}
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>
            {value || 'Seleccionar icono'}
          </div>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
            {value ? 'Click para cambiar' : 'Click para elegir un icono'}
          </div>
        </div>
        <i className="fas fa-chevron-down" style={{ fontSize: '12px', color: '#9ca3af' }}></i>
      </button>

      {showPicker && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setShowPicker(false)}
          />
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            padding: '12px',
            zIndex: 1000,
            maxHeight: '320px',
            overflowY: 'auto'
          }}>
            <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                Selecciona un icono
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px'
            }}>
              {hotelIcons.map(icon => (
                <button
                  key={icon.code}
                  type="button"
                  onClick={() => selectIcon(icon.code)}
                  title={icon.code}
                  style={{
                    padding: '12px 8px',
                    background: value === icon.code ? '#d1fae5' : 'white',
                    border: '2px solid',
                    borderColor: value === icon.code ? '#10b981' : '#e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s',
                    minHeight: '70px'
                  }}
                  onMouseEnter={(e) => {
                    if (value !== icon.code) {
                      e.currentTarget.style.background = '#f0fdfa';
                      e.currentTarget.style.borderColor = '#5eead4';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== icon.code) {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <i className={`fas ${icon.code}`} style={{ 
                    fontSize: '26px', 
                    color: value === icon.code ? '#059669' : '#374151' 
                  }}></i>
                  <span style={{ 
                    fontSize: '10px', 
                    textAlign: 'center', 
                    color: value === icon.code ? '#065f46' : '#6b7280',
                    fontWeight: value === icon.code ? 600 : 500,
                    lineHeight: '1.2'
                  }}>
                    {icon.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IconPicker;
