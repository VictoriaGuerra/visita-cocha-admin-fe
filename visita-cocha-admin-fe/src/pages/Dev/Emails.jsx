// src/pages/Dev/Emails.jsx
import React, { useEffect, useState } from 'react'
import * as api from '../../api'

export default function Emails(){
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [copied, setCopied] = useState('')

  const load = ()=>{
    const list = api.getSentEmails()
    setItems(list)
  }
  useEffect(()=>{ load() }, [])

  const copy = async (text)=>{ try{ await navigator.clipboard.writeText(text); setCopied(text); setTimeout(()=>setCopied(''), 1500) }catch{} }

  const re = /(\d{6})(?!\d)/
  const filtered = items.filter(m => !q || (m.to || '').toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="modules-container">
      <h2>Correos simulados</h2>
      <div style={{ display:'flex', gap:12, marginBottom:12 }}>
        <input className="input" placeholder="Filtrar por destinatario" value={q} onChange={e=>setQ(e.target.value)} style={{ maxWidth:360 }} />
        <button className="btn" onClick={load}><i className="fas fa-rotate" /> Actualizar</button>
        <button className="btn btn-secondary" onClick={()=>{ api.clearSentEmails(); load(); }}>Vaciar</button>
      </div>
      <div className="form-card" style={{ padding: 0 }}>
        <table className="vc-table">
          <thead>
            <tr>
              <th style={{ width: 220 }}>Fecha</th>
              <th style={{ width: 260 }}>Para</th>
              <th>Contenido</th>
              <th style={{ width: 180 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => {
              const code = (m.body || '').match(re)?.[1]
              const linkMatch = (m.body || '').match(/(\/reset\?[^\s]+)/)
              const link = linkMatch?.[1]
              return (
                <tr key={m.id}>
                  <td>{new Date(m.date).toLocaleString()}</td>
                  <td>{m.to}</td>
                  <td style={{ whiteSpace:'pre-wrap' }}>
                    {m.body}
                    {link && (
                      <div style={{ marginTop:6 }}>
                        <a className="btn" href={link} style={{ textDecoration:'none' }}>Abrir página de cambio</a>
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:8 }}>
                      {code && <button className="btn" onClick={()=>copy(code)}>{copied===code ? 'Copiado' : 'Copiar código'}</button>}
                      <button className="btn" onClick={()=>copy(`Para: ${m.to}\n${m.body}`)}>{copied===`Para: ${m.to}\n${m.body}` ? 'Copiado' : 'Copiar texto'}</button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={4} style={{ padding:16, color:'#6b7280' }}>No hay correos simulados aún.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p style={{ color:'#6b7280', fontSize:13, marginTop:12 }}>Nota: estos correos se guardan localmente en el navegador para demo (clave: vc_sent_emails).</p>
    </div>
  )
}
