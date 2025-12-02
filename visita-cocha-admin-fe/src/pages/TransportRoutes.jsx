import React, { useEffect, useState } from "react";
import { getTransportRoutes, deleteTransportRoute } from "../api/transportRoutes.api.js";
import TransportRouteForm from "./TransportRouteForm.jsx";

export default function TransportRoutes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTransportRoutes();
      setRoutes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Eliminar esta ruta de transporte?");
    if (!ok) return;
    setDeletingId(id);
    try {
      await deleteTransportRoute(id);
      await fetchRoutes();
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Rutas de Transporte</h2>
        <button onClick={() => setShowForm(true)}>Nueva Ruta</button>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: 16, width: "90%", maxWidth: 640, borderRadius: 6 }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ marginBottom: 8 }}>Cerrar</button>
            </div>
            <TransportRouteForm
              onSaved={() => {
                setShowForm(false);
                fetchRoutes();
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {loading && <p>Cargando...</p>}
      {error && (
        <div style={{ color: "#b00020", marginBottom: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && routes.length === 0 && <p>No se encontraron rutas.</p>}

      {!loading && routes.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Nombre</th>
              <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Tipo Archivo</th>
              <th style={{ textAlign: "center", padding: "8px", borderBottom: "1px solid #ddd" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => {
              const id = r.id ?? r._id ?? r.uuid;
              const nombre = r.nombre ?? r.name ?? "-";
              const tipoArchivo = r.tipoArchivo ?? r.type ?? r.fileType ?? "-";
              return (
                <tr key={id}>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{nombre}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{tipoArchivo}</td>
                  <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #eee" }}>
                    <button
                      onClick={() => handleDelete(id)}
                      disabled={deletingId === id}
                      style={{ background: "#d9534f", color: "white", border: "none", padding: "6px 10px", cursor: "pointer" }}
                    >
                      {deletingId === id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
