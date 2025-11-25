import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as api from '../../api'

export default function ModulePage(){
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const [mod, setMod] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    const load = async ()=>{
      setLoading(true)
  const list = await api.getModules()
      const found = list.find(m=>m.id === moduleId)
      if (mounted) setMod(found)
      setLoading(false)
    }
    load()
    return ()=> mounted = false
  },[moduleId])

  if (loading) return <div>Cargando módulo...</div>
  if (!mod) return <div>No se encontró el módulo.</div>

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ marginBottom: 8 }}>{mod.name}</h2>
        <div>
          <button className="btn" onClick={()=>navigate('/modules')} style={{ marginRight: 8 }}>Volver</button>
          <button className="btn btn-primary">Editar módulo</button>
        </div>
      </div>

      <div style={{ background: '#fff', padding: 18, borderRadius: 12, marginTop: 10 }}>
        <p style={{ color: '#6b7280' }}>ID: {mod.id}</p>
        <p style={{ color: '#6b7280' }}>Estado: {mod.status}</p>
        <p style={{ color: '#6b7280' }}>Roles permitidos: {(mod.allowedRoles||[]).join(', ')}</p>
        <div style={{ height: 10 }} />
  {/* descripción removida por petición del cliente */}
      </div>
    </div>
  )
}
