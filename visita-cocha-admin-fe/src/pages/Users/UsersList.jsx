// src/pages/Users/UsersList.jsx
import React, { useEffect, useState } from 'react'
import BaseList from '../../components/UI/BaseList'
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
		// Mapear _id a id para compatibilidad con BaseList
		const mappedData = (data || []).map(u => ({
			...u,
			id: u._id || u.id
		}))
		setUsers(mappedData)
		setLoading(false)
	}

	useEffect(()=>{ load() }, [])

	const handleCreate = ()=>{ setEditing(null); setShowForm(true) }
	
	const handleEdit = (id)=>{ 
		const user = users.find(u => u.id === id)
		setEditing(user)
		setShowForm(true) 
	}

	const handleDelete = async (id)=>{
		const user = users.find(u => u.id === id)
		if (!confirm(`Eliminar usuario ${user?.email}?`)) return;
		try {
			await api.deleteUser(id);
			await load();
		} catch (err) {
			alert(err?.response?.data?.message || err.message || 'Error al eliminar usuario');
		}
	}

	const getColumns = () => [
		{
			key: 'email',
			label: 'Correo',
			render: (val) => val || '-'
		},
		{
			key: 'name',
			label: 'Nombre',
			render: (val, item) => val || item.nombre || '-'
		},
		{
			key: 'roles',
			label: 'Roles',
			render: (val, item) => {
				const roles = item.rol ? [item.rol] : (val || [])
				return (
					<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
						{roles.map(r => (
							<span 
								key={r} 
								className={`role-badge ${r === 'SuperAdmin' ? 'role-super' : r === 'Admin' ? 'role-admin' : 'role-mantenedor'}`}
							>
								{r}
							</span>
						))}
					</div>
				)
			}
		}
	]

	if (loading) {
		return (
			<div className="module-container">
				<div className="loading">Cargando usuarios...</div>
			</div>
		)
	}

	return (
		<div className="module-container">
			<BaseList
				title="Usuarios"
				items={users}
				columns={getColumns()}
				onEdit={handleEdit}
				onDelete={handleDelete}
				canEdit={true}
				canDelete={true}
				canAdd={true}
			/>

			{showForm && <UserForm onClose={async()=>{ setShowForm(false); await load() }} editing={editing} />}
		</div>
	)
}