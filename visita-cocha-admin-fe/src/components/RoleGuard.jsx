import React, { useContext } from 'react'
import { AuthContext } from '../auth/AuthContext'
import { usePermissions } from '../auth/permissions'

// Usage: <RoleGuard module="attractions" action="update">...children...</RoleGuard>
export default function RoleGuard({ module: moduleId, action = 'read', children }){
  const { user } = useContext(AuthContext)
  if (!user) return null
  const roleRaw = user.role || (user.roles && user.roles[0]) || ''
  const roleKey = String(roleRaw).toUpperCase()
  const allowed = usePermissions(roleKey, moduleId, action)
  if (!allowed) return null
  return children
}
