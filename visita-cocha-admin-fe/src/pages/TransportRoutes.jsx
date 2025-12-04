import React, { useEffect, useState } from "react";
import { getTransportRoutes, deleteTransportRoute, importAllRoutesFromFolder } from "../api/transportRoutes.api.js";
import TransportRouteForm from "./TransportRouteForm.jsx";
import "../styles/modules.css";

export default function TransportRoutes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(null);

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

  // Limpiar mensaje de éxito después de 5 segundos
  useEffect(() => {
    if (importSuccess) {
      const timer = setTimeout(() => {
        setImportSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [importSuccess]);

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

  const handleImportAll = async () => {
    const ok = window.confirm(
      "¿Importar todas las rutas desde el directorio individual-rutes?\n\n" +
      "Esto importará todos los archivos .geojson encontrados en el servidor."
    );
    if (!ok) return;
    
    setImporting(true);
    setError(null);
    setImportSuccess(null);
    
    try {
      const result = await importAllRoutesFromFolder();
      const count = result.inserted || 0;
      setImportSuccess(`¡Importación exitosa! Se importaron ${count} rutas.`);
      // Refrescar la lista después de importar
      await fetchRoutes();
    } catch (err) {
      setError(`Error al importar rutas: ${err.message || String(err)}`);
      setImportSuccess(null);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="module-container" style={{ padding: 24 }}>
      <div className="module-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>Rutas</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <button 
            onClick={handleImportAll}
            disabled={importing}
            className="btn"
            style={{ 
              padding: "10px 20px", 
              borderRadius: "6px", 
              border: "1px solid #d1d5db",
              cursor: importing ? "not-allowed" : "pointer", 
              fontWeight: 500,
              backgroundColor: importing ? "#f3f4f6" : "white",
              color: importing ? "#9ca3af" : "#374151",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              if (!importing) {
                e.currentTarget.style.backgroundColor = "#f9fafb";
                e.currentTarget.style.borderColor = "#9ca3af";
              }
            }}
            onMouseLeave={(e) => {
              if (!importing) {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.borderColor = "#d1d5db";
              }
            }}
          >
            <i className={`fas ${importing ? "fa-spinner fa-spin" : "fa-download"}`} style={{ marginRight: 8 }}></i>
            {importing ? "Importando..." : "Importar Todas"}
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
            style={{ padding: "10px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 500 }}
          >
            <i className="fas fa-plus" style={{ marginRight: 8 }}></i>
            Nueva Ruta
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{ 
          position: "fixed", 
          inset: 0, 
          background: "rgba(0,0,0,0.5)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          zIndex: 1000,
          backdropFilter: "blur(4px)"
        }}>
          <div style={{ 
            background: "white", 
            padding: 0, 
            width: "90%", 
            maxWidth: 600, 
            borderRadius: "8px",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
            maxHeight: "90vh",
            overflow: "auto"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              padding: "20px 24px",
              borderBottom: "1px solid #e5e7eb"
            }}>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>Nueva Ruta</h3>
              <button 
                onClick={() => setShowForm(false)} 
                style={{ 
                  background: "transparent",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#6b7280",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f3f4f6";
                  e.currentTarget.style.color = "#111827";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#6b7280";
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div style={{ padding: "24px" }}>
              <TransportRouteForm
                onSaved={() => {
                  setShowForm(false);
                  fetchRoutes();
                }}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: "24px", marginRight: 8 }}></i>
          <span>Cargando rutas...</span>
        </div>
      )}
      
      {error && (
        <div className="error-message" style={{ 
          color: "#b00020", 
          backgroundColor: "#fee2e2",
          padding: "12px 16px", 
          borderRadius: "6px",
          marginBottom: 16,
          border: "1px solid #fecaca",
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <i className="fas fa-exclamation-circle"></i>
          <div>
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {importSuccess && (
        <div style={{ 
          color: "#065f46", 
          backgroundColor: "#ecfdf5",
          padding: "12px 16px", 
          borderRadius: "6px",
          marginBottom: 16,
          border: "1px solid #a7f3d0",
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <i className="fas fa-check-circle"></i>
          <div>{importSuccess}</div>
        </div>
      )}

      {!loading && routes.length === 0 && !error && (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px", 
          color: "#6b7280",
          backgroundColor: "#f9fafb",
          borderRadius: "8px"
        }}>
          <i className="fas fa-route" style={{ fontSize: "48px", marginBottom: 16, opacity: 0.5 }}></i>
          <p style={{ margin: 0, fontSize: "16px" }}>No se encontraron rutas.</p>
          <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>Haz clic en "Nueva Ruta" para agregar una.</p>
        </div>
      )}

      {!loading && routes.length > 0 && (
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "8px", 
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f9fafb" }}>
              <tr>
                <th style={{ 
                  textAlign: "left", 
                  padding: "12px 16px", 
                  borderBottom: "1px solid #e5e7eb",
                  fontWeight: 600,
                  color: "#374151",
                  fontSize: "14px"
                }}>Nombre</th>
                <th style={{ 
                  textAlign: "left", 
                  padding: "12px 16px", 
                  borderBottom: "1px solid #e5e7eb",
                  fontWeight: 600,
                  color: "#374151",
                  fontSize: "14px"
                }}>Tipo de Archivo</th>
                <th style={{ 
                  textAlign: "center", 
                  padding: "12px 16px", 
                  borderBottom: "1px solid #e5e7eb",
                  fontWeight: 600,
                  color: "#374151",
                  fontSize: "14px"
                }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r, index) => {
                const id = r.id ?? r._id ?? r.uuid;
                const nombre = r.nombre ?? r.name ?? "-";
                const tipoArchivo = r.tipoArchivo ?? r.type ?? r.fileType ?? "-";
                return (
                  <tr key={id} style={{ 
                    backgroundColor: index % 2 === 0 ? "white" : "#f9fafb",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "white" : "#f9fafb"}
                  >
                    <td style={{ 
                      padding: "12px 16px", 
                      borderBottom: "1px solid #e5e7eb",
                      color: "#111827",
                      fontSize: "14px"
                    }}>
                      <i className="fas fa-route" style={{ marginRight: 8, color: "#6b7280" }}></i>
                      {nombre}
                    </td>
                    <td style={{ 
                      padding: "12px 16px", 
                      borderBottom: "1px solid #e5e7eb",
                      color: "#6b7280",
                      fontSize: "14px"
                    }}>
                      <span style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: tipoArchivo === "geojson" ? "#dbeafe" : "#fef3c7",
                        color: tipoArchivo === "geojson" ? "#1e40af" : "#92400e",
                        fontSize: "12px",
                        fontWeight: 500,
                        textTransform: "uppercase"
                      }}>
                        {tipoArchivo}
                      </span>
                    </td>
                    <td style={{ 
                      padding: "12px 16px", 
                      textAlign: "center", 
                      borderBottom: "1px solid #e5e7eb"
                    }}>
                      <button
                        onClick={() => handleDelete(id)}
                        disabled={deletingId === id}
                        style={{ 
                          background: deletingId === id ? "#9ca3af" : "#dc2626", 
                          color: "white", 
                          border: "none", 
                          padding: "8px 16px", 
                          cursor: deletingId === id ? "not-allowed" : "pointer",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: 500,
                          transition: "background-color 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          if (deletingId !== id) e.currentTarget.style.background = "#b91c1c";
                        }}
                        onMouseLeave={(e) => {
                          if (deletingId !== id) e.currentTarget.style.background = "#dc2626";
                        }}
                      >
                        <i className="fas fa-trash-alt" style={{ marginRight: 6 }}></i>
                        {deletingId === id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
