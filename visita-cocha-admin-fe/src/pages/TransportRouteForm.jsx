import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTransportRoute } from "../api/transportRoutes.api.js";

export default function TransportRouteForm({ onSaved, onCancel }) {
  const [nombre, setNombre] = useState("");
  const [tipoArchivo, setTipoArchivo] = useState("kml");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("tipoArchivo", tipoArchivo);
    if (file) formData.append("file", file);

    setLoading(true);
    try {
      await createTransportRoute(formData);
      if (typeof onSaved === "function") {
        onSaved();
      } else {
        navigate("/transport-routes");
      }
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Nueva Ruta de Transporte</h2>

      {error && (
        <div style={{ color: "#b00020", marginBottom: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Tipo de Archivo</label>
          <select
            value={tipoArchivo}
            onChange={(e) => setTipoArchivo(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="kml">kml</option>
            <option value="geojson">geojson</option>
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Archivo</label>
          <input type="file" onChange={handleFileChange} accept=".kml,application/geo+json,application/json,.geojson" />
        </div>

        <div>
          <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof onCancel === "function") onCancel();
              else navigate("/transport-routes");
            }}
            style={{ marginLeft: 8, padding: "8px 12px" }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
