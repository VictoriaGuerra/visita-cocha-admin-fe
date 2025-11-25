// mockApi simula endpoints: /auth/login, /users (CRUD) y "envía" email (simulado)


const STORAGE_KEY = 'vc_users_v1'
const RESET_KEY = 'vc_password_resets'


// usuarios por defecto
const defaultUsers = [
	{ id: 'u-1', email: 'layef61997@wacold.com', firstName: 'Super', lastName: 'Admin', name: 'Super Admin', roles: ['SuperAdmin'], password: 'Admin123', mustChangePassword: true },
	{ id: 'u-2', email: 'admin@visita.cocha', firstName: 'Admin', lastName: 'General', name: 'Admin General', roles: ['Admin'], password: 'Admin123' },
	{ id: 'u-3', email: 'mantenedor@visita.cocha', firstName: 'User', lastName: 'Mantenedor', name: 'Mantenedor', roles: ['Mantenedor'], password: 'Admin123' },
	// Usuario pedido por el cliente para pruebas
	{ id: 'u-4', email: 'super@visita.cocha', firstName: 'Super', lastName: 'Cocha', name: 'Super Cocha', roles: ['SuperAdmin'], password: 'admin123' },
]

const MODULES_KEY = 'vc_modules_v1'

const defaultModules = [
	{ id: 'm-1', name: 'Atractivos Turísticos', status: 'Activo' },
	{ id: 'm-2', name: 'Restaurantes', status: 'Activo' },
	{ id: 'm-3', name: 'Hoteles', status: 'Activo' },
]


function read() {
const raw = localStorage.getItem(STORAGE_KEY)
if (!raw) {
localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
return defaultUsers.slice()
}
return JSON.parse(raw)
}


function write(users) {
localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

function readModules(){
	const raw = localStorage.getItem(MODULES_KEY)
	if (!raw){
		localStorage.setItem(MODULES_KEY, JSON.stringify(defaultModules))
		return defaultModules.slice()
	}
	return JSON.parse(raw)
}

function writeModules(mods){
	localStorage.setItem(MODULES_KEY, JSON.stringify(mods))
}


export const authLogin = async (email, password) => {
const users = read()
const u = users.find(x => x.email === email && x.password === password)
if (!u) throw { message: 'Credenciales inválidas' }
// simulamos JWT: payload con email y roles
const token = btoa(JSON.stringify({ email: u.email, roles: u.roles }))
return { token }
}


export const getUsers = async () => {
const users = read()
// omitimos password en respuesta
return users.map(({ password, ...rest }) => rest)
}


export const createUser = async ({ email, name, roles, firstName, lastName }) => {
	const users = read()
	if (users.find(u => u.email === email)) throw { message: 'Usuario ya existe' }
	// Nuevo flujo: generar contraseña temporal fuerte y exigir cambio en el primer ingreso
	const fullName = name || `${firstName || ''} ${lastName || ''}`.trim()
	const tempPass = generateTempPassword()
	const newUser = { id: `u-${Date.now()}`, email, firstName, lastName, name: fullName, roles, password: tempPass, mustChangePassword: true }
	users.push(newUser)
	write(users)
	// Enviar usuario y contraseña temporal por correo (simulado)
	const loginHint = `Usuario: ${email}\nContraseña temporal: ${tempPass}\n\nAl ingresar por primera vez, se te pedirá actualizarla.`
	simulateSendEmail(email, `Tu cuenta ha sido creada para ${fullName}.\n${loginHint}`)
	return { id: newUser.id, email, name: fullName, roles, tempPassword: tempPass }
}


export const updateUser = async (id, patch) => {
const users = read()
const idx = users.findIndex(u => u.id === id)
if (idx === -1) throw { message: 'Usuario no encontrado' }
users[idx] = { ...users[idx], ...patch }
write(users)
const { password, ...rest } = users[idx]
return rest
}


export const deleteUser = async (id) => {
let users = read()
users = users.filter(u => u.id !== id)
write(users)
return { ok: true }
}

// Password reset storage helpers
function readResets(){
	const raw = localStorage.getItem(RESET_KEY)
	return raw ? JSON.parse(raw) : []
}
function writeResets(list){
	localStorage.setItem(RESET_KEY, JSON.stringify(list))
}

// Request a password reset code (also used for invites)
export const requestPasswordReset = async (email, { reason = 'forgot' } = {}) => {
	const users = read()
	const u = users.find(x => x.email === email)
	if (!u) throw { message: 'No existe un usuario con ese correo' }
	const code = String(Math.floor(100000 + Math.random() * 900000)) // 6 dígitos
	const expiresAt = Date.now() + 1000 * 60 * 10 // 10 minutos
	let list = readResets()
	list = list.filter(x => x.email !== email) // invalidar previos
	list.push({ email, code, expiresAt })
	writeResets(list)
	const purpose = reason === 'invite' ? 'activar tu cuenta y crear tu contraseña' : 'restablecer tu contraseña'
	const link = `/reset?email=${encodeURIComponent(email)}&code=${code}`
	simulateSendEmail(email, `Código de verificación: ${code}. Tienes 10 minutos para ${purpose}.\nPuedes abrir directamente: ${link}`)
	return { ok: true }
}

export const verifyResetCode = async (email, code) => {
	const item = readResets().find(x => x.email === email && x.code === code)
	if (!item) throw { message: 'Código inválido' }
	if (Date.now() > item.expiresAt) throw { message: 'Código expirado' }
	return { ok: true }
}

export const resetPassword = async (email, code, newPassword) => {
	await verifyResetCode(email, code)
	const users = read()
	const idx = users.findIndex(x => x.email === email)
	if (idx === -1) throw { message: 'Usuario no encontrado' }
	if (!isStrongPassword(newPassword)) throw { message: 'La contraseña no cumple los requisitos' }
	users[idx] = { ...users[idx], password: newPassword, mustChangePassword: false }
	write(users)
	// clear code
	writeResets(readResets().filter(x => x.email !== email))
	simulateSendEmail(email, 'Tu contraseña ha sido actualizada correctamente.')
	return { ok: true }
}

// Validación básica de contraseñas: 8+ caracteres, mayúscula, minúscula, número
function isStrongPassword(p){
	if (!p || p.length < 8) return false
	if (!/[a-z]/.test(p)) return false
	if (!/[A-Z]/.test(p)) return false
	if (!/[0-9]/.test(p)) return false
	return true
}

// Genera una contraseña temporal que cumpla la política básica
function generateTempPassword(){
	// Formato: Temp + 6 dígitos + A (ej: Temp482931A)
	const num = String(Math.floor(100000 + Math.random() * 900000))
	return `Temp${num}A`
}

// Completar cambio de contraseña en primer inicio de sesión (sin código)
export const completeInitialPasswordSetup = async (email, newPassword) => {
	const users = read()
	const idx = users.findIndex(x => x.email === email)
	if (idx === -1) throw { message: 'Usuario no encontrado' }
	if (!isStrongPassword(newPassword)) throw { message: 'La contraseña no cumple los requisitos' }
	users[idx] = { ...users[idx], password: newPassword, mustChangePassword: false }
	write(users)
	simulateSendEmail(email, 'Tu contraseña inicial ha sido establecida con éxito.')
	const { password, ...rest } = users[idx]
	return rest
}

// Modules CRUD (localStorage)
export const getModules = async () => {
	const mods = readModules()
	return mods.slice()
}

export const createModule = async ({ name, status = 'Activo' }) => {
	const mods = readModules()
	if (mods.find(m => m.name === name)) throw { message: 'Módulo ya existe' }
	const newMod = { id: `m-${Date.now()}`, name, status, allowedRoles: ['Admin','Mantenedor'] }
	mods.push(newMod)
	writeModules(mods)
		// notify admin (simulado)
		try{ simulateSendEmail('layef61997@wacold.com', `Nuevo módulo creado: ${name}`) }catch(e){/* ignore */}
	return newMod
}

export const updateModule = async (id, patch) => {
	const mods = readModules()
	const idx = mods.findIndex(m => m.id === id)
	if (idx === -1) throw { message: 'Módulo no encontrado' }
	mods[idx] = { ...mods[idx], ...patch }
	writeModules(mods)
	return mods[idx]
}

export const deleteModule = async (id) => {
	let mods = readModules()
	mods = mods.filter(m => m.id !== id)
	writeModules(mods)
	return { ok: true }
}




// helper to persist simulated emails
function saveSimulatedEmail(to, body){
	const key = 'vc_sent_emails'
	const out = JSON.parse(localStorage.getItem(key) || '[]')
	out.push({ id: `e-${Date.now()}`, to, body, date: new Date().toISOString() })
	localStorage.setItem(key, JSON.stringify(out))
}

function simulateSendEmail(to, body) {
	console.info('Simulated email to', to, '', body)
	saveSimulatedEmail(to, body)
}

// Demo helpers to inspect simulated emails
export const getSentEmails = () => {
  try { return JSON.parse(localStorage.getItem('vc_sent_emails') || '[]').sort((a,b)=> b.date.localeCompare(a.date)) } catch { return [] }
}
export const clearSentEmails = () => { localStorage.removeItem('vc_sent_emails'); return { ok: true } }