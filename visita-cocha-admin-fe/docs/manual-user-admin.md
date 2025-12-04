# Manual de Usuario - Panel Admin

## Acceso

Abre `http://localhost:5173` (o tu URL configurada)

Ingresa:
- Email: tu cuenta
- Contraseña: tu contraseña

## Panel Principal

Menú lateral con módulos:
- **Atractivos** - Lugares turísticos
- **Restaurantes** - Restaurantes
- **Eventos** - Eventos
- **Hoteles** - Hoteles
- **Comidas** - Comidas típicas
- **Anuncios** - Anuncios
- **Puntos** - Puntos de interés
- **Usuarios** - Gestión de usuarios

## Operaciones CRUD

### Listar
1. Abre un módulo (ej: Atractivos)
2. Ves tabla con elementos

### Crear
1. Haz clic en "Crear [elemento]"
2. Completa formulario
3. Haz clic en "Guardar"

### Editar
1. Haz clic en "Editar" en la fila
2. Modifica campos
3. Haz clic en "Actualizar"

### Eliminar
1. Haz clic en "Eliminar" en la fila
2. Confirma en el diálogo
3. Elemento se elimina

## Formularios

Cada formulario tiene:
- **Información básica** (nombre, descripción, imagen)
- **Ubicación** (dirección, coordenadas)
- **Contacto** (teléfono, email, web)
- **Categorías** (selecciona con pills)
- **Disponibilidad** (activo/inactivo)

## Gestión de Usuarios

### Crear Usuario
1. Ve a **Usuarios**
2. Haz clic en "Crear usuario"
3. Ingresa email, nombre, rol
4. Se envía correo con contraseña temporal

### Cambiar Rol
1. Edita usuario
2. Cambiar rol en dropdown
3. Guardar

### Eliminar Usuario
1. Haz clic en "Eliminar"
2. Confirmar

## Categorías

Administra categorías desde cada módulo.

### Agregar Categoría
1. En formulario, ve a sección "Categorías"
2. Haz clic en "+" para nueva categoría
3. Ingresa nombre
4. Guardar

## Errores Comunes

**"No autorizado"**
- Tu sesión expiró, vuelve a loguear

**"No se pudo guardar"**
- Completa todos los campos obligatorios
- Verifica que la imagen URL sea válida

**"Elemento no encontrado"**
- El elemento fue eliminado, recarga la página

## Soporte

Si algo no funciona:
1. Abre consola (F12)
2. Ve a pestaña Console
3. Reporta errores rojos
