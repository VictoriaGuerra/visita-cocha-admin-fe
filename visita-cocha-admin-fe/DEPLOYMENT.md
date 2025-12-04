# Deployment - Admin Panel Visita Cochabamba

Para las autoridades de la alcaldía.

## Requisitos

- Docker 20.10+
- Docker Compose 2.0+
- 2GB RAM mínimo

## Instalación (Paso a Paso)

### 1. Descargar repositorio

```bash
git clone https://github.com/tu-repo/visita-cocha-admin-fe.git
cd visita-cocha-admin-fe
```

### 2. Configurar variables

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env` y cambia solo si es necesario:

```env
# ✅ CAMBIAR ESTOS VALORES
VITE_API_BASE_URL=http://tu-backend.com:3000
JWT_SECRET=tu-contraseña-super-segura-123456
MONGO_PASSWORD=tu-password-mongodb-123456

# ℹ️ Mantener por defecto (no cambiar si no sabes)
VITE_USE_BACKEND=true
NODE_ENV=production
FE_PORT=5173
BE_PORT=3000
```

### 3. Construir imagen Docker

```bash
docker-compose build
```

### 4. Iniciar servicios

```bash
docker-compose up -d
```

Espera 30 segundos. Abre el navegador:

```
http://localhost:5173
```

## Parar servicios

```bash
docker-compose down
```

## Ver logs

```bash
docker-compose logs -f
```

## Troubleshooting

**Puerto 5173 en uso:**
```bash
docker-compose down
docker-compose up -d
```

**MongoDB no inicia:**
```bash
docker volume ls
docker volume rm visita-cocha-admin-fe_mongo-data
docker-compose up -d
```

**Cambiar puerto Frontend:**
En `.env`, cambia:
```env
FE_PORT=8080
```

Abre `http://localhost:8080`

## Backup de base de datos

```bash
docker exec visita-cocha-mongo mongodump --out /dump
docker cp visita-cocha-mongo:/dump ./backup-$(date +%Y%m%d)
```

## Restaurar backup

```bash
docker cp ./backup-20250101/ visita-cocha-mongo:/restore
docker exec visita-cocha-mongo mongorestore /restore
```

## Actualizar

```bash
git pull
docker-compose build
docker-compose up -d
```

## Contacto

Para soporte técnico, contacta al equipo de desarrollo.
