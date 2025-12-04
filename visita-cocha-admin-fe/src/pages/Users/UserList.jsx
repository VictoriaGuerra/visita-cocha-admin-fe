import React, { useEffect, useState } from 'react';
import BaseList from '../../components/UI/BaseList';
import { getUsers, deleteUser } from '../../api/usersApi';

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'lastname', label: 'Apellido' },
  { key: 'email', label: 'Email' },
  { key: 'ci', label: 'CI' },
  { key: 'department', label: 'Departamento' },
  { key: 'rol', label: 'Rol' },
  { key: 'estado', label: 'Estado' },
  { key: 'phone', label: 'Teléfono' },
];

export default function UserList({ onEditUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (e) {
      alert('Error al cargar usuarios');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar usuario?')) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  return (
    <div>
      <h1>Usuarios</h1>
      <BaseList
        title="Usuarios"
        items={users}
        columns={columns}
        onEdit={onEditUser}
        onDelete={handleDelete}
        onView={onEditUser}
        canEdit
        canDelete
        canAdd
      />
    </div>
  );
}
