// src/components/Dashboard/UserTable.jsx
import React from "react";

export default function UserTable({ users }) {
  const handleEdit = (id) => alert(`Editar usuario ${id}`);
  const handleDelete = (id) => alert(`Eliminar usuario ${id}`);

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
            <th style={{ padding: "12px" }}>Email</th>
            <th style={{ padding: "12px" }}>Rol</th>
            <th style={{ padding: "12px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "10px" }}>{u.id}</td>
              <td style={{ padding: "10px" }}>{u.name}</td>
              <td style={{ padding: "10px" }}>{u.email}</td>
              <td
                style={{
                  padding: "10px",
                  fontWeight: "500",
                  color:
                    u.role === "SuperAdmin"
                      ? "#4F46E5"
                      : u.role === "Administrador"
                      ? "#059669"
                      : "#F59E0B",
                }}
              >
                {u.role}
              </td>
              <td style={{ padding: "10px" }}>
                <button
                  onClick={() => handleEdit(u.id)}
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
                  onClick={() => handleDelete(u.id)}
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
