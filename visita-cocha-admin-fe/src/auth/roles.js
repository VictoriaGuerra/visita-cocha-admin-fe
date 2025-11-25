// src/auth/roles.js
export const roles = {
  SUPERADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  MANTENEDOR: 'Mantenedor',
};

export const permisosPorRol = {
  SuperAdmin: {
    modules: ['Atractivos', 'Restaurantes', 'Comidas', 'Eventos', 'Hoteles', 'Categorías', 'Rutas', 'Puntos', 'Anuncios', 'Multilenguaje', 'Estadísticas'],
    canCreateUsers: true,
    canAssignRoles: true,
  },
  Admin: {
    modules: ['Atractivos', 'Restaurantes', 'Comidas', 'Eventos', 'Hoteles', 'Categorías'],
    canCreateUsers: false,
    canAssignRoles: false,
  },
  Mantenedor: {
    modules: ['Atractivos', 'Restaurantes', 'Comidas'], // solo autorizados
    canCreateUsers: false,
    canAssignRoles: false,
    noDelete: true,
  },
};
