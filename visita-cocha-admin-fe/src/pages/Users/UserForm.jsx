// src/pages/Users/UserForm.jsx
import React, { useState, useEffect, useContext } from 'react'
import * as api from '../../api'
import { roles as ROLE_CONST } from '../../auth/roles'
import { MODULE_TYPES } from '../../config/moduleTypes'
import { AuthContext } from '../../auth/AuthContext'

export default function UserForm({ editing, onClose }){
	const { user: currentUser } = useContext(AuthContext)
	const [email, setEmail] = useState(editing?.email || '')
	const [firstName, setFirstName] = useState(editing?.firstName || (editing?.name ? editing.name.split(' ').slice(0, -1).join(' ') : ''))
	const [lastName, setLastName] = useState(editing?.lastName || (editing?.name ? editing.name.split(' ').slice(-1).join(' ') : ''))
	const [roles, setRoles] = useState(editing?.roles || ['Mantenedor'])
	const [moduleAccess, setModuleAccess] = useState(editing?.moduleAccess || {})
	const [availableModules, setAvailableModules] = useState([])
	const [error, setError] = useState(null)
	const [saving, setSaving] = useState(false)
	const [created, setCreated] = useState(false)

	useEffect(()=>{
		let mounted = true
		// Cargar módulos desde la configuración central (ids coinciden con rutas)
		const mods = Object.values(MODULE_TYPES).map(m => ({ id: m.id, name: m.name }))
		if (mounted) setAvailableModules(mods)
		return ()=> { mounted = false }
	},[])

	const toggleRole = (r) => setRoles(prev => prev.includes(r) ? prev.filter(x=>x!==r) : [...prev, r])

	const toggleModule = (modId) => {
		setModuleAccess(prev => {
			const has = !!prev[modId]
			if (has){
				const copy = { ...prev }
				delete copy[modId]
				return copy
			}
			return { ...prev, [modId]: { elements: [] } }
		})
	}

	const handleElementsChange = (modId, text) => {
		const elements = text.split(',').map(s=>s.trim()).filter(Boolean)
		setModuleAccess(prev => ({ ...prev, [modId]: { elements } }))
	}

	const handleSubmit = async (e)=>{
		e.preventDefault(); setError(null); setSaving(true)
		try{
			const name = `${firstName} ${lastName}`.trim()
			const payload = { name, roles, moduleAccess, firstName, lastName }
			if (editing) {
				await api.updateUser(editing.id, payload)
				onClose()
			} else {
				const res = await api.createUser({ email, name, roles, moduleAccess, firstName, lastName })
				setCreated(res?.tempPassword || true)
			}
		}catch(err){ setError(err.message || 'Error'); }
		setSaving(false)
	}

	return (
		<div className="vc-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80 }}>
			<div className="form-card" style={{ width: '100%', maxWidth: 900 }}>
				<h4 style={{ marginBottom: 12, fontSize: 18 }}>{editing ? 'Editar' : 'Crear'} usuario</h4>
				<form onSubmit={handleSubmit}>
					{(!editing && (
						<>
							<label style={{ display: 'block', marginBottom: 6 }}>Correo</label>
							<input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
						</>
					))}

					<div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
						<div>
							<label style={{ display: 'block', marginTop: 12, marginBottom: 6 }}>Nombres</label>
							<input className="input" value={firstName} onChange={(e)=>setFirstName(e.target.value)} required />
						</div>
						<div>
							<label style={{ display: 'block', marginTop: 12, marginBottom: 6 }}>Apellidos</label>
							<input className="input" value={lastName} onChange={(e)=>setLastName(e.target.value)} required />
						</div>
					</div>

					<label style={{ display: 'block', marginTop: 12, marginBottom: 6 }}>Roles</label>
					<div style={{ marginBottom: 12 }}>
						{(ROLE_CONST ? Object.values(ROLE_CONST) : ['Admin','Mantenedor','SuperAdmin']).map(r => (
							<label key={r} style={{ marginRight: 12 }}>
								<input checked={roles.includes(r)} onChange={()=>toggleRole(r)} type="checkbox" /> <span style={{ marginLeft: 6 }}>{r}</span>
							</label>
						))}
					</div>

					{(currentUser?.roles?.includes('SuperAdmin')) && (
						<label style={{ display: 'block', marginTop: 12, marginBottom: 6 }}>Acceso a módulos (solo SuperAdmin puede dar acceso granular)</label>
					)}
					{(currentUser?.roles?.includes('SuperAdmin')) && (
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 12 }}>
						<div>
							{availableModules.map(m => (
								<div key={m.id} style={{ marginBottom: 8 }}>
									<label>
										<input type="checkbox" checked={!!moduleAccess[m.id]} onChange={()=>toggleModule(m.id)} /> <span style={{ marginLeft: 8 }}>{m.name}</span>
									</label>
								</div>
							))}
						</div>
						<div>
							<small style={{ display: 'block', marginBottom: 8, color: '#6b7280' }}>Si quieres dar acceso a elementos específicos dentro del módulo, escribe los IDs separados por comas (ej: id1, id2). De lo contrario deja vacío para acceso total al módulo.</small>
							{availableModules.map(m => (
								!!moduleAccess[m.id] && (
									<div key={`el-${m.id}`} style={{ marginBottom: 10 }}>
										<label style={{ display: 'block', fontWeight: 600 }}>{m.name} — Elementos permitidos</label>
										<input
											className="input"
											placeholder="id1, id2, ..."
											value={(moduleAccess[m.id]?.elements || []).join(', ')}
											onChange={(e)=>handleElementsChange(m.id, e.target.value)}
										/>
									</div>
								)
							))}
						</div>
					</div>
					)}

					{error && <div style={{ color: '#dc2626', marginBottom: 8 }}>{error}</div>}
										{created && (
											<div style={{ background:'#ecfdf5', color:'#065f46', padding:'8px 10px', borderRadius:8, marginBottom:8 }}>
												Usuario creado. Credenciales temporales:<br/>
												<strong>Usuario:</strong> {email}<br/>
												<strong>Contraseña temporal:</strong> {created === true ? '—' : created}
												<div style={{ marginTop:6, color:'#065f46' }}>Se pidió cambio obligatorio en el primer ingreso.</div>
											</div>
										)}

					<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
				<button type="button" onClick={onClose} className="btn">{created ? 'Cerrar' : 'Cancelar'}</button>
				{!created && <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Guardando...' : (editing ? 'Guardar' : 'Crear')}</button>}
					</div>
				</form>
			</div>
    
		</div>
	)
}