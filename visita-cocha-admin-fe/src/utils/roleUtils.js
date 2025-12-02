// Utility functions for role checking (case-insensitive)

/**
 * Check if user has a specific role (case-insensitive)
 * @param {Object} user - User object with roles array
 * @param {string} role - Role to check (e.g., 'SuperAdmin', 'Admin', 'Mantenedor')
 * @returns {boolean}
 */
export function hasRole(user, role) {
  if (!user?.roles || !Array.isArray(user.roles)) return false;
  const normalizedRole = role.toLowerCase();
  return user.roles.some(r => r.toLowerCase() === normalizedRole);
}

/**
 * Check if user has any of the specified roles
 * @param {Object} user - User object with roles array
 * @param {string[]} roles - Array of roles to check
 * @returns {boolean}
 */
export function hasAnyRole(user, roles) {
  return roles.some(role => hasRole(user, role));
}

/**
 * Normalize role name to match backend format
 * @param {string} role - Role name
 * @returns {string} - Normalized role name
 */
export function normalizeRole(role) {
  // Backend uses lowercase: 'superadmin', 'admin', 'mantenedor'
  return role.toLowerCase();
}

/**
 * Check if user is SuperAdmin
 */
export function isSuperAdmin(user) {
  return hasRole(user, 'SuperAdmin');
}

/**
 * Check if user is Admin
 */
export function isAdmin(user) {
  return hasRole(user, 'Admin');
}

/**
 * Check if user is Mantenedor
 */
export function isMantenedor(user) {
  return hasRole(user, 'Mantenedor');
}
