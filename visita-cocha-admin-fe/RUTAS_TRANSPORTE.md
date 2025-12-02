# 🚍 Módulo de Rutas de Transporte

## Descripción
Módulo para gestionar archivos KML/GeoJSON de rutas de transporte público (micros, buses, trolebuses, etc.).

## Características

✅ **Subir archivos KML/GeoJSON** (máx. 5MB)
✅ **Metadata**: ID único (slug), nombre, tipo, color, descripción
✅ **Validaciones**: Formato de archivo, tamaño, ID único
✅ **Storage**: Archivos guardados en servidor
✅ **CRUD completo**: Crear, Listar, Ver, Editar metadata, Eliminar
✅ **Diseño consistente**: BaseList con estilo unificado

## Endpoints Backend

### POST /transport-routes
Subir archivo con metadata
```javascript
FormData {
  file: File,              // Archivo KML o GeoJSON
  id: 'linea-a',          // ID único (slug format)
  name: 'Línea A',        // Nombre display
  description: 'string',  // Opcional
  routeType: 'micro',     // bus|micro|trolebus|taxi|otro
  color: '#FF5733',       // Hex color para el mapa
  active: true,           // Boolean
  order: 1                // Number
}
```

### GET /transport-routes
Listar todas las rutas (sin geoData completo)

### GET /transport-routes/:id
Obtener ruta específica con geoData completo

### PATCH /transport-routes/:id
Actualizar metadata (NO el archivo)

### DELETE /transport-routes/:id
Eliminar ruta y archivo del storage

## Flujo de Uso

### 1. Crear nueva ruta
1. Click en "Agregar nuevo" en `/transport-routes`
2. Completar formulario:
   - **ID**: Se genera automáticamente desde el nombre (slug format)
   - **Nombre**: Ej: "Línea A", "Micro 12"
   - **Tipo**: Seleccionar tipo de transporte
   - **Archivo**: Seleccionar .kml o .geojson (máx 5MB)
   - **Color**: Elegir color para visualizar en el mapa
3. Click en "Crear"

### 2. Ver ruta
- Click en ícono de ojo 👁️
- Muestra toda la información y link para descargar archivo

### 3. Editar ruta
- Click en ícono de lápiz ✏️
- Solo se puede editar metadata, NO el archivo
- Para cambiar archivo, hay que eliminar y crear nueva ruta

### 4. Eliminar ruta
- Click en ícono de basura 🗑️
- Confirmar eliminación
- Se elimina el registro BD Y el archivo del storage

## Validaciones

### Frontend
- ✅ Tamaño máximo: 5MB
- ✅ Extensiones permitidas: .kml, .geojson, .json
- ✅ Nombre requerido
- ✅ ID slug format (auto-generado si vacío)

### Backend
- ✅ ID único (no duplicados)
- ✅ Archivo KML/GeoJSON válido
- ✅ Conversión KML → GeoJSON
- ✅ Storage en `uploads/transport-routes/`

## Archivos Creados

### Frontend
- `src/pages/TransportRoutes/TransportRoutesList.jsx` - Lista con BaseList
- `src/pages/TransportRoutes/TransportRouteForm.jsx` - Formulario upload
- `src/api/visitaCochaApi.js` - API methods con multipart/form-data
- `src/config/backendEndpoints.js` - Endpoint configuration

### Rutas
- `/transport-routes` - Lista
- `/transport-routes/new` - Crear
- `/transport-routes/edit/:id` - Editar metadata
- `/transport-routes/view/:id` - Ver (readonly)

### Sidebar
- Opción "Rutas de Transporte" 🚌

## Schema de Datos

```typescript
{
  id: "linea-a",                    // String (PK, slug format)
  name: "Línea A",                  // String (display name)
  description: "Ruta que...",       // String (opcional)
  routeType: "micro",               // Enum: bus|micro|trolebus|taxi|otro
  color: "#FF5733",                 // String (hex color)
  fileName: "linea-a.kml",          // String (nombre archivo)
  fileType: "kml",                  // Enum: kml|geojson
  fileUrl: "https://.../file.kml",  // String (URL pública)
  fileSize: 15234,                  // Number (bytes)
  geoData: {...},                   // Object (GeoJSON parseado)
  active: true,                     // Boolean
  order: 1,                         // Number
  createdAt: "2025-12-02T...",     // Timestamp
  updatedAt: "2025-12-02T..."      // Timestamp
}
```

## Integración con FE Móvil

El frontend móvil debe:
1. Llamar a `GET /transport-routes` para obtener lista
2. Filtrar por `active: true`
3. Usar `geoData` para dibujar rutas en el mapa
4. Usar `color` para estilizar cada ruta
5. Usar `routeType` para mostrar ícono correcto

## Notas Técnicas

- **Upload**: Usa `FormData` con `Content-Type: multipart/form-data`
- **Update**: PATCH solo actualiza metadata, NO acepta nuevo archivo
- **Delete**: Elimina archivo físico del storage y registro de BD
- **GeoData**: Backend parsea y almacena en formato GeoJSON estándar
- **ID**: Slug format (minúsculas, guiones, sin espacios ni caracteres especiales)

## Ejemplo de Uso API

```javascript
// Crear ruta
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('id', 'linea-a');
formData.append('name', 'Línea A');
formData.append('routeType', 'micro');
formData.append('color', '#FF5733');
formData.append('active', 'true');

await createContent('transport-routes', formData);

// Listar rutas
const routes = await getContentList('transport-routes');

// Obtener ruta específica
const route = await getContentById('transport-routes', 'linea-a');

// Actualizar metadata
const updateData = new FormData();
updateData.append('name', 'Línea A - Actualizado');
updateData.append('active', 'false');
await updateContent('transport-routes', 'linea-a', updateData);

// Eliminar ruta
await deleteContent('transport-routes', 'linea-a');
```

---

✅ **Módulo completamente funcional e integrado**
