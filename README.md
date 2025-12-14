# Backend III - Entrega Final

**Alumno:** Carlos Gonzalez  
**Comisión:** 94535

## Descripción

Sistema de gestión de adopciones de mascotas desarrollado con Express.js y MongoDB. Incluye endpoints para usuarios, mascotas, mocking de datos y gestión de adopciones. Documentado con Swagger.

## Imagen Docker

La imagen del proyecto está disponible en DockerHub:

```
docker pull sorakogg/backend-iii:latest
```

## Ejecución con Docker

### Opción 1: Usando la imagen de DockerHub

```bash
docker pull sorakogg/backend-iii:latest
docker run -p 8080:8080 -e MONGO_URI=mongodb://host.docker.internal:27017/coder sorakogg/backend-iii:latest
```

### Opción 2: Construir la imagen localmente

```bash
docker build -t backend-iii .
docker run -p 8080:8080 -e MONGO_URI=mongodb://host.docker.internal:27017/coder backend-iii
```

### Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | 8080 |
| `MONGO_URI` | URI de conexión a MongoDB | mongodb://localhost:27017/coder |

## Instalación Local

1. Clonar el repositorio:
```bash
git clone https://github.com/Sorako-prog/backend-coder-iii.git
cd backend-iii
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar MongoDB (debe estar corriendo en localhost:27017).

4. Iniciar el servidor:
```bash
npm start
```

Para desarrollo con hot-reload:
```bash
npm run dev
```

## Documentación API (Swagger)

Una vez iniciado el servidor, acceder a:
```
http://localhost:8080/api-docs
```

## Endpoints

### Usuarios (`/api/users`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Lista todos los usuarios |
| GET | `/api/users/:id` | Obtiene un usuario por ID |

### Mascotas (`/api/pets`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/pets` | Lista todas las mascotas |
| GET | `/api/pets/:id` | Obtiene una mascota por ID |

### Adopciones (`/api/adoptions`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/adoptions` | Lista todas las adopciones |
| GET | `/api/adoptions/:aid` | Obtiene una adopción por ID |
| POST | `/api/adoptions/:uid/:pid` | Crea una adopción |
| DELETE | `/api/adoptions/:aid` | Elimina una adopción |

### Mocks (`/api/mocks`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/mocks/mockingpets` | Genera 50 mascotas ficticias |
| GET | `/api/mocks/mockingusers` | Genera usuarios ficticios |
| POST | `/api/mocks/generateData` | Genera e inserta datos en BD |

## Tests

Ejecutar los tests funcionales:
```bash
npm test
```

Los tests utilizan `mongodb-memory-server` para crear una base de datos en memoria, evitando dependencia de MongoDB externo durante la ejecución de tests.

## Estructura del Proyecto

```
backend-iii/
├── app.js
├── package.json
├── Dockerfile
├── .dockerignore
├── models/
│   ├── User.js
│   ├── Pet.js
│   └── Adoption.js
├── routes/
│   ├── mocks.router.js
│   ├── users.router.js
│   ├── pets.router.js
│   └── adoption.router.js
├── utils/
│   └── mocking.js
└── test/
    └── adoption.test.js
```

## Tecnologías

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM
- **Swagger** - Documentación de API
- **Mocha/Chai** - Testing
- **Docker** - Containerización
