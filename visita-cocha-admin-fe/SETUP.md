# SETUP

## 1. Backend en 3000
```bash
cd c:\Users\ASUS\Documents\GitHub\visita-cocha-be
npm run start:dev
```

## 2. Verifica rutas en Swagger
`http://localhost:3000/api/docs`
- `/attractions` = OK ✅
- `/atractivos` = Actualiza `src/config/backendEndpoints.js`

## 3. Frontend en 5173
```bash
cd c:\Users\ASUS\Documents\GitHub\visita-cocha-admin-fe\visita-cocha-admin-fe
npm run dev
```

## 4. Prueba
- `http://localhost:5173` → Login
- `/modules/attractions` → CRUD

✅ Todo listo. CRUD funcional con API real.
- Password: (configurado en backend)
