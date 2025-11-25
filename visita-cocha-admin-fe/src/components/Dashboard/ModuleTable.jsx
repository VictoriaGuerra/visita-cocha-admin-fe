// src/components/Dashboard/ModuleTable.jsx
import React from "react";

export default function ModuleTable() {
  // 🔹 Datos simulados
  const modules = [
    { id: 1, name: "Atractivos Turísticos", status: "Activo" },
    { id: 2, name: "Eventos", status: "Activo" },
    { id: 3, name: "Usuarios", status: "En mantenimiento" },
    { id: 4, name: "Reportes", status: "Activo" },
  ];

  const handleEdit = (id) => alert(`Editar módulo ${id}`);
  const handleDelete = (id) => alert(`Eliminar módulo ${id}`);

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginTop: "10px",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
            <th style={{ padding: "12px" }}>ID</th>
            <th style={{ padding: "12px" }}>Nombre</th>
            <th style={{ padding: "12px" }}>Estado</th>
            <th style={{ padding: "12px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((m) => (
            <tr
              key={m.id}
              style={{
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <td style={{ padding: "10px" }}>{m.id}</td>
              <td style={{ padding: "10px" }}>{m.name}</td>
              <td
                style={{
                  padding: "10px",
                  color: m.status === "Activo" ? "green" : "#eab308",
                  fontWeight: "500",
                }}
              >
                {m.status}
              </td>
              <td style={{ padding: "10px" }}>
                <button
                  onClick={() => handleEdit(m.id)}
                  style={{
                    marginRight: "8px",
                    background: "#4F46E5",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  style={{
                    background: "#EF4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
