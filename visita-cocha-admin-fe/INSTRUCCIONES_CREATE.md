# ✅ INSTRUCCIONES PARA CREAR UN ATRACTIVO

## 🎯 CAMBIOS REALIZADOS

He configurado el formulario de creación de atractivos para que funcione correctamente con tu backend.

### Archivos Modificados:
1. **`src/components/Modules/ModuleForm.jsx`**
   - Agregada integración con la API del backend
   - Mapeo correcto de campos del formulario al formato del backend
   - Manejo de errores y estados de carga

2. **`src/components/UI/LocationField.jsx`**
   - Actualizado para usar la estructura correcta: `{ coords: { lat, lng }, address }`
   - Compatible con el schema del backend

---

## 🚀 CÓMO PROBAR EL CREATE

### 1. Verificar que todo esté corriendo:

**Backend:**
```powershell
# El backend debe estar corriendo en http://localhost:3000
```

**Frontend:**
```powershell
# Ya está corriendo en http://localhost:5174
```

### 2. Abrir el navegador:

Ve a: **http://localhost:5173**

### 3. Hacer Login:

Usa las credenciales que te proporcionaron:
```
Email: admin@visitacocha.com
Password: admin123
```

### 4. Ir a Atractivos:

1. En el menú lateral, haz clic en **"Atractivos"** o **"Attractions"**
2. Deberías ver la lista de atractivos existentes
3. Haz clic en el botón **"+ Crear Nuevo"** o **"Nuevo Atractivo"**

### 5. Llenar el formulario:

**Campos obligatorios (*):**
- **Nombre**: `Mi Primer Atractivo`
- **Slug**: `mi-primer-atractivo` (debe ser único, sin espacios, minúsculas)
- **Descripción**: `Esta es una descripción de prueba para el primer atractivo creado desde el admin.`

**Ubicación:**
- **Latitud**: `-17.3895`
- **Longitud**: `-66.1568`
- **Dirección**: `Plaza 14 de Septiembre, Cochabamba`

**Campos opcionales:**
- **URL de imagen**: `https://via.placeholder.com/600x400`
- **Categorías**: Selecciona `popular`, `entretenimiento`
- **Categorías Principales**: Selecciona `populares`
- **Calificación**: `5`
- **Orden**: `10`
- **Teléfono**: `4-4123456`
- **Email**: `contacto@atractivo.com`
- **Sitio Web**: `https://ejemplo.com`

**Checkboxes:**
- ✅ **Destacado** (isFeatured)
- ✅ **Disponible** (available)
- ✅ **Activo** (active)

### 6. Guardar:

1. Haz clic en el botón **"Crear"**
2. Deberías ver un mensaje en la consola del navegador: `✅ Creado exitosamente`
3. Serás redirigido a la lista de atractivos
4. Deberías ver tu nuevo atractivo en la lista

---

## 🔍 VERIFICAR EN LA CONSOLA

Abre la consola del navegador (F12) y verás logs como:

```javascript
📤 Enviando datos al backend: {
  name: "Mi Primer Atractivo",
  slug: "mi-primer-atractivo",
  description: "Esta es una descripción...",
  location: {
    coords: { lat: "-17.3895", lng: "-66.1568" },
    address: "Plaza 14 de Septiembre, Cochabamba"
  },
  // ... más campos
}

✅ Creado exitosamente: { data: { ... } }
```

---

## 🧪 VERIFICAR EN EL BACKEND

Puedes verificar que se creó correctamente con:

```powershell
# Ver todos los atractivos
Invoke-WebRequest -Uri "http://localhost:3000/attractions" -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | Select-Object -Last 1

# Buscar por slug
Invoke-WebRequest -Uri "http://localhost:3000/attractions/mi-primer-atractivo" -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

---

## ❌ POSIBLES ERRORES Y SOLUCIONES

### Error: "slug already exists"
**Solución**: Cambia el slug a algo único, por ejemplo: `mi-atractivo-2024`

### Error: "location.coords is required"
**Solución**: Asegúrate de llenar latitud y longitud

### Error: 401 Unauthorized
**Solución**: Vuelve a hacer login

### Error: Network Error
**Solución**: Verifica que el backend esté corriendo en http://localhost:3000

---

## 📊 ESTRUCTURA DE DATOS QUE SE ENVÍA

El formulario envía este formato al backend:

```json
{
  "name": "Nombre del atractivo",
  "slug": "nombre-del-atractivo",
  "description": "Descripción completa",
  "location": {
    "coords": {
      "lat": "-17.3895",
      "lng": "-66.1568"
    },
    "address": "Dirección completa"
  },
  "coverUrl": "https://url-de-imagen.com/imagen.jpg",
  "categories": ["popular", "entretenimiento"],
  "mainCategories": ["populares"],
  "accessibility": "",
  "rating": 5,
  "order": 10,
  "contact": {
    "phone": "4-4123456",
    "mail": "contacto@ejemplo.com",
    "link": "https://sitio.com"
  },
  "isFeatured": true,
  "available": true,
  "active": true,
  "metadata": {
    "likes": 0,
    "views": 0
  },
  "faq": [],
  "foods": []
}
```

---

## 🎯 PRÓXIMOS PASOS

Una vez que funcione el CREATE:

1. ✅ **CREATE** - Ya está listo
2. 🔄 **READ** (Ver detalles) - Ya funciona con slug
3. ✏️ **UPDATE** (Editar) - Ya está implementado
4. 🗑️ **DELETE** (Eliminar) - Ya está implementado

---

## 💡 NOTAS IMPORTANTES

1. **Slug debe ser único**: El backend validará que no exista otro atractivo con el mismo slug
2. **Las categorías son arrays**: Puedes seleccionar múltiples categorías
3. **Los checkboxes tienen valores por defecto**: `available=true`, `active=true`, `isFeatured=false`
4. **La ubicación es obligatoria**: Debes proporcionar al menos latitud y longitud

---

## 🐛 DEBUG

Si algo no funciona, revisa:

1. **Consola del navegador** (F12) - Verás los logs de `📤 Enviando datos` y posibles errores
2. **Network tab** - Verás la petición POST a `/attractions`
3. **Backend logs** - Verás si hay errores de validación

---

¡Listo! Ahora puedes crear atractivos turísticos desde el admin frontend. 🎉
