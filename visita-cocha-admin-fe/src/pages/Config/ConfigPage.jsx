import React, { useState, useEffect } from 'react'
import '../../styles/profile.css'
import { settingsApi } from '../../api/settingsApi'

export default function ConfigPage() {
  const [settings, setSettings] = useState(settingsApi.get())
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Local draft state to allow editing without mutating until save
  const [draft, setDraft] = useState(settings)

  useEffect(() => { setDraft(settings) }, [])

  const updateDraft = (section, field, value) => {
    setDraft(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSaving(true)
    setError(''); setSuccess('')
    try {
      const stored = settingsApi.save(draft)
      setSettings(stored)
      setSuccess('Configuraciones guardadas')
    } catch(err) {
      console.error(err)
      setError('Error al guardar configuraciones')
    }
    setSaving(false)
  }

  const handleReset = () => {
    if (!window.confirm('¿Restablecer configuraciones a valores por defecto?')) return
    const res = settingsApi.reset()
    setSettings(res); setDraft(res)
    setSuccess('Valores restablecidos')
  }

  return (
    <div className="settings-page">
      <div className="profile-header">
        <i className="fas fa-cog"></i>
        <h2 className="profile-title">Configuraciones</h2>
      </div>

      <form onSubmit={handleSave} className="settings-form">
        {/* General */}
        <section className="settings-section">
          <h3><i className="fas fa-wrench"></i> General</h3>
          <div className="form-row-two">
            <div className="form-group">
              <label>Nombre del sitio</label>
              <input type="text" value={draft.general.siteName} onChange={e => updateDraft('general','siteName',e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label>Organización</label>
              <input type="text" value={draft.general.organization} onChange={e => updateDraft('general','organization',e.target.value)} className="form-input" />
            </div>
          </div>
          <div className="form-row-two">
            <div className="form-group">
              <label>Correo de contacto</label>
              <input type="email" value={draft.general.contactEmail} onChange={e => updateDraft('general','contactEmail',e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label>Ítems por página</label>
              <input type="number" min={1} value={draft.general.itemsPerPage} onChange={e => updateDraft('general','itemsPerPage',Number(e.target.value))} className="form-input" />
            </div>
          </div>
          <label className="form-checkbox">
            <input type="checkbox" checked={draft.general.maintenanceMode} onChange={e => updateDraft('general','maintenanceMode',e.target.checked)} /> Modo mantenimiento
          </label>
        </section>

        {/* Apariencia */}
        <section className="settings-section">
          <h3><i className="fas fa-palette"></i> Apariencia</h3>
          <div className="form-row-two">
            <div className="form-group">
              <label>Color primario</label>
              <input type="color" value={draft.appearance.primaryColor} onChange={e => updateDraft('appearance','primaryColor',e.target.value)} />
            </div>
            <div className="form-group">
              <label>Color secundario</label>
              <input type="color" value={draft.appearance.secondaryColor} onChange={e => updateDraft('appearance','secondaryColor',e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Logo URL</label>
            <input type="url" value={draft.appearance.logoUrl} onChange={e => updateDraft('appearance','logoUrl',e.target.value)} className="form-input" placeholder="https://..." />
          </div>
          <label className="form-checkbox">
            <input type="checkbox" checked={draft.appearance.darkMode} onChange={e => updateDraft('appearance','darkMode',e.target.checked)} /> Modo oscuro
          </label>
        </section>

        {/* Localización */}
        <section className="settings-section">
          <h3><i className="fas fa-globe"></i> Localización</h3>
          <div className="form-row-two">
            <div className="form-group">
              <label>Idioma</label>
              <select value={draft.localization.language} onChange={e => updateDraft('localization','language',e.target.value)} className="form-input">
                <option value="es">Español</option>
                <option value="en">Inglés</option>
              </select>
            </div>
            <div className="form-group">
              <label>Zona horaria</label>
              <input type="text" value={draft.localization.timezone} onChange={e => updateDraft('localization','timezone',e.target.value)} className="form-input" />
            </div>
          </div>
          <div className="form-row-two">
            <div className="form-group">
              <label>Formato de fecha</label>
              <input type="text" value={draft.localization.dateFormat} onChange={e => updateDraft('localization','dateFormat',e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label>Moneda</label>
              <input type="text" value={draft.localization.currency} onChange={e => updateDraft('localization','currency',e.target.value)} className="form-input" />
            </div>
          </div>
        </section>

        {/* Notificaciones */}
        <section className="settings-section">
          <h3><i className="fas fa-bell"></i> Notificaciones</h3>
          <label className="form-checkbox"><input type="checkbox" checked={draft.notifications.emailEnabled} onChange={e => updateDraft('notifications','emailEnabled',e.target.checked)} /> Email habilitado</label>
          <label className="form-checkbox"><input type="checkbox" checked={draft.notifications.pushEnabled} onChange={e => updateDraft('notifications','pushEnabled',e.target.checked)} /> Push habilitado</label>
          <label className="form-checkbox"><input type="checkbox" checked={draft.notifications.weeklySummary} onChange={e => updateDraft('notifications','weeklySummary',e.target.checked)} /> Resumen semanal</label>
        </section>

        {/* Seguridad */}
        <section className="settings-section">
          <h3><i className="fas fa-shield-alt"></i> Seguridad</h3>
          <label className="form-checkbox"><input type="checkbox" checked={draft.security.require2FA} onChange={e => updateDraft('security','require2FA',e.target.checked)} /> Requerir 2FA</label>
          <div className="form-group">
            <label>Timeout de sesión (min)</label>
            <input type="number" min={5} value={draft.security.sessionTimeoutMinutes} onChange={e => updateDraft('security','sessionTimeoutMinutes',Number(e.target.value))} className="form-input" />
          </div>
          <label className="form-checkbox"><input type="checkbox" checked={draft.security.allowPublicRegistration} onChange={e => updateDraft('security','allowPublicRegistration',e.target.checked)} /> Permitir registro público</label>
        </section>

        {/* Avanzado */}
        <section className="settings-section">
          <h3><i className="fas fa-tools"></i> Avanzado</h3>
          <div className="form-group">
            <label>Analytics ID</label>
            <input type="text" value={draft.advanced.analyticsId} onChange={e => updateDraft('advanced','analyticsId',e.target.value)} className="form-input" />
          </div>
          <div className="form-group">
            <label>Maps API Key</label>
            <input type="text" value={draft.advanced.mapsApiKey} onChange={e => updateDraft('advanced','mapsApiKey',e.target.value)} className="form-input" />
          </div>
          <label className="form-checkbox"><input type="checkbox" checked={draft.advanced.dataExportEnabled} onChange={e => updateDraft('advanced','dataExportEnabled',e.target.checked)} /> Exportar datos habilitado</label>
        </section>

        {error && <div className="error-message"><i className="fas fa-exclamation-circle"></i> {error}</div>}
        {success && <div className="success-message"><i className="fas fa-check-circle"></i> {success}</div>}

        <div className="form-actions" style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" className="btn btn-danger" onClick={handleReset}><i className="fas fa-undo"></i> Restablecer</button>
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? <><i className="fas fa-spinner fa-spin"></i> Guardando...</> : <><i className="fas fa-save"></i> Guardar</>}
          </button>
        </div>
      </form>
    </div>
  )
}
