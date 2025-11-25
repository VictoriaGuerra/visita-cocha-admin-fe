// src/pages/Users/UsersList.jsx
import React, { useEffect, useState } from 'react'
import * as api from '../../api'
import UserForm from './UserForm'


export default function UsersList(){
	const [users, setUsers] = useState([])
	const [loading, setLoading] = useState(true)
	const [editing, setEditing] = useState(null)
	const [showForm, setShowForm] = useState(false)

	const load = async ()=>{
		setLoading(true)
		const data = await api.getUsers()
		setUsers(data)
		setLoading(false)
	}

	useEffect(()=>{ load() }, [])

	const handleCreate = ()=>{ setEditing(null); setShowForm(true) }
	const handleEdit = (u)=>{ setEditing(u); setShowForm(true) }

	const handleDelete = async (id)=>{
		if (!confirm('Eliminar usuario?')) return
		await api.deleteUser(id)
		await load()
	}

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
				<h3 style={{ fontSize: 20, fontWeight: 700 }}>Usuarios</h3>
				<div>
					<button onClick={handleCreate} className="btn-primary" style={{ borderRadius: 8 }}>Crear usuario</button>
				</div>
			</div>

			{loading ? <div>Cargando...</div> : (
				<div className="form-card">
					<table className="vc-table">
						<thead>
							<tr>
								<th>Correo</th>
								<th>Nombre</th>
								<th>Roles</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{users.map(u=> (
								<tr key={u.id}>
									<td>{u.email}</td>
									<td>{u.name}</td>
									<td>
										{(u.roles||[]).map(r => (
											<span key={r} className={`role-badge ${r === 'SuperAdmin' ? 'role-super' : r === 'Admin' ? 'role-admin' : 'role-mantenedor'}`} style={{ marginRight: 8 }}>{r}</span>
										))}
									</td>
									<td>
										<button onClick={()=>handleEdit(u)} className="btn" style={{ marginRight: 8 }}>Editar</button>
										<button onClick={()=>handleDelete(u.id)} className="btn-secondary" style={{ background: '#ef4444', border: 'none' }}>Eliminar</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{showForm && <UserForm onClose={async()=>{ setShowForm(false); await load() }} editing={editing} />}
		</div>
	)
}