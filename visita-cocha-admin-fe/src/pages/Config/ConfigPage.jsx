import React, { useState } from 'react'
import HotelCategories from '../../components/HotelCategories/HotelCategories'
import '../../styles/common.css'
import '../../components/Modules/ModuleForm.css'
import '../../styles/forms.css'

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState('settings') // 'settings' | 'hotelCategories'
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    appName: 'Visita Cocha Admin',
    appVersion: '2.0.0',
    appDescription: 'Panel administrativo para gestión de contenido turístico',
    contactEmail: 'admin@visitacocha.com',
    supportPhone: '+591 4 4123456',
    address: 'Cochabamba, Bolivia',
    timezone: 'America/La_Paz',
    language: 'es',
    itemsPerPage: 10,
    maxFileSize: 10,
    allowedFileTypes: '.jpg, .png, .pdf, .geojson, .kml',
    enableNotifications: true,
    enableEmailAlerts: true,
    maintenanceMode: false,
    googleMapsApiKey: '',
    analyticsEnabled: true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    
    setTimeout(() => {
      localStorage.setItem('app-settings', JSON.stringify(formData))
      setSuccess('Configuraciones guardadas exitosamente')
      setSaving(false)
    }, 500)
  }

  const handleReset = () => {
    if (!window.confirm('¿Restablecer configuraciones a valores por defecto?')) return
    setFormData({
      appName: 'Visita Cocha Admin',
      appVersion: '2.0.0',
      appDescription: 'Panel administrativo para gestión de contenido turístico',
      contactEmail: 'admin@visitacocha.com',
      supportPhone: '+591 4 4123456',
      address: 'Cochabamba, Bolivia',
      timezone: 'America/La_Paz',
      language: 'es',
      itemsPerPage: 10,
      maxFileSize: 10,
      allowedFileTypes: '.jpg, .png, .pdf, .geojson, .kml',
      enableNotifications: true,
      enableEmailAlerts: true,
      maintenanceMode: false,
      googleMapsApiKey: '',
      analyticsEnabled: true,
    })
    setSuccess('Valores restablecidos a configuración por defecto')
  }

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>⚙️ Configuración del Sistema</h2>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '10px'
      }}>
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'settings' ? 'linear-gradient(135deg, #3f908e 0%, #2d6a69 100%)' : '#f3f4f6',
            color: activeTab === 'settings' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          ⚙️ Configuración General
        </button>
        <button
          onClick={() => setActiveTab('hotelCategories')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'hotelCategories' ? 'linear-gradient(135deg, #3f908e 0%, #2d6a69 100%)' : '#f3f4f6',
            color: activeTab === 'hotelCategories' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          🏨 Categorías de Hoteles
        </button>
      </div>

      {/* Tab: Configuración General */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSave} className="module-form">
        {error && (
          <div className="alert alert-danger" style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#991b1b',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success" style={{
            background: '#d1fae5',
            border: '1px solid #a7f3d0',
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#065f46',
            marginBottom: '16px'
          }}>
            {success}
          </div>
        )}

        {/* Información General */}
        <div className="form-section">
          <h3 className="section-title" style={{
            background: 'linear-gradient(135deg, #3f908e 0%, #2d6a69 100%)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            📋 Información General
          </h3>
          
          <div className="form-group">
            <label>Nombre de la Aplicación *</label>
            <input
              type="text"
              name="appName"
              value={formData.appName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Versión</label>
              <input
                type="text"
                name="appVersion"
                value={formData.appVersion}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Idioma</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="form-input"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="qu">Quechua</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="appDescription"
              value={formData.appDescription}
              onChange={handleChange}
              className="form-input"
              rows={3}
            />
          </div>
        </div>

        {/* Datos de Contacto */}
        <div className="form-section">
          <h3 className="section-title" style={{
            background: 'linear-gradient(135deg, #3f908e 0%, #2d6a69 100%)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            📞 Datos de Contacto
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Email de Contacto</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Teléfono de Soporte</label>
              <input
                type="text"
                name="supportPhone"
                value={formData.supportPhone}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Zona Horaria</label>
            <input
              type="text"
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Configuración del Sistema */}
        <div className="form-section">
          <h3 className="section-title" style={{
            background: 'linear-gradient(135deg, #3f908e 0%, #2d6a69 100%)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            ⚙️ Configuración del Sistema
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Ítems por Página</label>
              <input
                type="number"
                name="itemsPerPage"
                value={formData.itemsPerPage}
                onChange={handleChange}
                className="form-input"
                min="5"
                max="100"
              />
            </div>
            <div className="form-group">
              <label>Tamaño Máximo de Archivo (MB)</label>
              <input
                type="number"
                name="maxFileSize"
                value={formData.maxFileSize}
                onChange={handleChange}
                className="form-input"
                min="1"
                max="100"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tipos de Archivo Permitidos</label>
            <input
              type="text"
              name="allowedFileTypes"
              value={formData.allowedFileTypes}
              onChange={handleChange}
              className="form-input"
              placeholder=".jpg, .png, .pdf"
            />
          </div>

          <div className="form-group">
            <label>Google Maps API Key</label>
            <input
              type="text"
              name="googleMapsApiKey"
              value={formData.googleMapsApiKey}
              onChange={handleChange}
              className="form-input"
              placeholder="AIzaSy..."
            />
          </div>
        </div>

        {/* Notificaciones y Alertas */}
        <div className="form-section">
          <h3 className="section-title" style={{
            background: 'linear-gradient(135deg, #3f908e 0%, #2d6a69 100%)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            🔔 Notificaciones y Alertas
          </h3>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="enableNotifications"
                checked={formData.enableNotifications}
                onChange={handleChange}
              />
              <span>Habilitar notificaciones del sistema</span>
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="enableEmailAlerts"
                checked={formData.enableEmailAlerts}
                onChange={handleChange}
              />
              <span>Habilitar alertas por email</span>
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="analyticsEnabled"
                checked={formData.analyticsEnabled}
                onChange={handleChange}
              />
              <span>Habilitar análisis y estadísticas</span>
            </label>
          </div>
        </div>

        {/* Mantenimiento */}
        <div className="form-section">
          <h3 className="section-title" style={{
            background: 'linear-gradient(135deg, #3f908e 0%, #2d6a69 100%)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            🔧 Modo Mantenimiento
          </h3>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={formData.maintenanceMode}
                onChange={handleChange}
              />
              <span>Activar modo mantenimiento (bloquea acceso a usuarios)</span>
            </label>
            {formData.maintenanceMode && (
              <p style={{ 
                marginTop: 8, 
                padding: '8px 12px', 
                background: '#fef3c7', 
                borderRadius: 6,
                fontSize: 14,
                color: '#92400e'
              }}>
                ⚠️ El modo mantenimiento está activo. Los usuarios no podrán acceder al sistema.
              </p>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleReset}
            className="btn-secondary"
          >
            🔄 Restablecer
          </button>
          <button 
            type="submit" 
            disabled={saving}
            className="btn-primary"
          >
            {saving ? '💾 Guardando...' : '💾 Guardar Configuración'}
          </button>
        </div>
      </form>
      )}

      {/* Tab: Categorías de Hoteles */}
      {activeTab === 'hotelCategories' && (
        <HotelCategories />
      )}
    </div>
  )
}
