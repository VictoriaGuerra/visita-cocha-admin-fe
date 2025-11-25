// src/pages/Dashboard.jsx
import React, { useContext } from 'react'
import { AuthContext } from '../auth/AuthContext'


export default function Dashboard(){
const { user, logout } = useContext(AuthContext)
return (
<div>
<div className="flex justify-between items-center mb-6">
<h1 className="text-2xl font-bold">Panel — Bienvenido {user?.email}</h1>
<div>
<button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">Cerrar sesión</button>
</div>
</div>

<div className="logo-container">
  <img src="/logo192.png" alt="Logo" className="logo" />
</div>

<section className="bg-white p-4 shadow rounded">
<h2 className="font-semibold mb-2">Resumen</h2>
<p className="text-sm text-slate-600">Aquí irán estadísticas y accesos por módulo.</p>
</section>
</div>
)
}