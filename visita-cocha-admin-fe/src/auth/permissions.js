// Definición de permisos por módulo y rol
export const PERMISSIONS = {
  SUPERADMIN: {
    users: ['create', 'read', 'update', 'delete', 'assign-roles', 'assign-modules'],
    modules: ['create', 'read', 'update', 'delete', 'configure'],
    attractions: ['create', 'read', 'update', 'delete', 'approve'],
    restaurants: ['create', 'read', 'update', 'delete', 'approve'],
    foods: ['create', 'read', 'update', 'delete', 'approve'],
    events: ['create', 'read', 'update', 'delete', 'approve'],
    hotels: ['create', 'read', 'update', 'delete', 'approve'],
    categories: ['create', 'read', 'update', 'delete', 'reorder'],
    routes: ['create', 'read', 'update', 'delete', 'approve'],
    points: ['create', 'read', 'update', 'delete', 'approve'],
    announcements: ['create', 'read', 'update', 'delete', 'schedule'],
    analytics: ['read', 'export', 'configure'],
    settings: ['read', 'update', 'configure']
  },
  ADMIN: {
    users: ['read', 'create', 'update'],
    modules: ['read', 'configure'],
    attractions: ['create', 'read', 'update', 'approve'],
    restaurants: ['create', 'read', 'update', 'approve'],
    foods: ['create', 'read', 'update', 'approve'],
    events: ['create', 'read', 'update', 'approve'],
    hotels: ['create', 'read', 'update', 'approve'],
    categories: ['read', 'create', 'update'],
    routes: ['create', 'read', 'update', 'approve'],
    points: ['create', 'read', 'update', 'approve'],
    announcements: ['create', 'read', 'update'],
    analytics: ['read', 'export'],
    settings: ['read']
  },
  MANTENEDOR: {
    attractions: ['read', 'update'],
    restaurants: ['read', 'update'],
    foods: ['read', 'update'],
    events: ['read', 'update'],
    hotels: ['read', 'update'],
    categories: ['read'],
    routes: ['read', 'update'],
    points: ['read', 'update'],
    announcements: ['read'],
    analytics: ['read'],
    settings: ['read']
  }
};

// Hook personalizado para verificar permisos
export const usePermissions = (role, module, action) => {
  if (!role || !module || !action) return false;
  
  // SuperAdmin siempre tiene acceso total
  if (role === 'SUPERADMIN') return true;
  
  return PERMISSIONS[role]?.[module]?.includes(action) || false;
};

// Función para verificar acceso a elementos específicos
export const hasElementAccess = (user, moduleId, elementId) => {
  if (!user || !moduleId) return false;
  
  // SuperAdmin siempre tiene acceso total
  if (user.role === 'SUPERADMIN') return true;
  
  // Verificar primero si tiene permiso para el módulo
  if (!PERMISSIONS[user.role]?.[moduleId]) return false;
  
  // Verificar accesos específicos asignados al usuario
  return user.moduleAccess?.[moduleId]?.elements?.includes(elementId) || false;
};

// Función para verificar si un usuario puede gestionar otros usuarios
export const canManageUsers = (userRole) => {
  if (!userRole) return false;
  return PERMISSIONS[userRole]?.users?.includes('create') || false;
};

// Función para verificar si un usuario puede asignar módulos
export const canAssignModules = (userRole) => {
  if (!userRole) return false;
  return PERMISSIONS[userRole]?.users?.includes('assign-modules') || false;
};

// Función para obtener todos los módulos permitidos para un rol
export const getPermittedModules = (role) => {
  if (!role || !PERMISSIONS[role]) return [];
  return Object.keys(PERMISSIONS[role]).filter(module => module !== 'users' && module !== 'settings');
};

// Función para verificar si un usuario necesita cambiar su contraseña
export const needsPasswordChange = (user) => {
  return user?.firstLogin || false;
};

// Constantes de módulos
export const MODULES = {
  USERS: 'users',
  ATTRACTIONS: 'attractions',
  RESTAURANTS: 'restaurants',
  FOODS: 'foods',
  EVENTS: 'events',
  HOTELS: 'hotels',
  CATEGORIES: 'categories',
  ROUTES: 'routes',
  POINTS: 'points',
  ANNOUNCEMENTS: 'announcements',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings'
};

// Constantes de acciones
export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  CONFIGURE: 'configure',
  EXPORT: 'export',
  SCHEDULE: 'schedule',
  REORDER: 'reorder',
  ASSIGN_ROLES: 'assign-roles',
  ASSIGN_MODULES: 'assign-modules'
};

// Metadata de módulos para UI
export const MODULE_METADATA = {
  attractions: {
    name: 'Atractivos Turísticos',
    icon: 'fa-landmark',
    description: 'Gestión de lugares turísticos',
    requiredFields: ['name', 'description', 'location']
  },
  restaurants: {
    name: 'Restaurantes',
    icon: 'fa-utensils',
    description: 'Gestión de restaurantes',
    requiredFields: ['name', 'cuisine', 'location']
  },
  foods: {
    name: 'Comidas',
    icon: 'fa-burger',
    description: 'Catálogo de platos típicos',
    requiredFields: ['name', 'description', 'price']
  },
  events: {
    name: 'Eventos',
    icon: 'fa-calendar',
    description: 'Gestión de eventos',
    requiredFields: ['name', 'date', 'location']
  },
  hotels: {
    name: 'Hoteles',
    icon: 'fa-hotel',
    description: 'Gestión de alojamientos',
    requiredFields: ['name', 'category', 'location']
  },
  categories: {
    name: 'Categorías',
    icon: 'fa-tags',
    description: 'Gestión de categorías',
    requiredFields: ['name']
  },
  routes: {
    name: 'Rutas Turísticas',
    icon: 'fa-route',
    description: 'Gestión de rutas',
    requiredFields: ['name', 'points', 'duration']
  },
  points: {
    name: 'Puntos de Interés',
    icon: 'fa-map-pin',
    description: 'Gestión de POIs',
    requiredFields: ['name', 'location', 'type']
  },
  announcements: {
    name: 'Anuncios',
    icon: 'fa-bullhorn',
    description: 'Gestión de anuncios',
    requiredFields: ['title', 'content', 'startDate']
  }
};