# Backend III - Entrega N°1

**Alumno:** Carlos Gonzalez  
**Comisión:** 94535

## Descripción

Este proyecto implementa un sistema de mocking para generar datos de prueba (usuarios y mascotas) utilizando Express.js y MongoDB. Incluye endpoints para generar datos ficticios y almacenarlos en la base de datos.

## Estructura del Proyecto

```
coder - backend iii/
├── app.js
├── package.json
├── models/
│   ├── User.js
│   └── Pet.js
├── routes/
│   ├── mocks.router.js
│   ├── users.router.js
│   └── pets.router.js
└── utils/
    └── mocking.js
```

## Instalación

1. Clonar el repositorio o descargar los archivos del proyecto.

2. Instalar las dependencias:
```bash
npm install
```

3. Asegurarse de que MongoDB esté corriendo en `localhost:27017`.

4. Iniciar el servidor:
```bash
npm start
```

Para modo desarrollo con nodemon:
```bash
npm run dev
```

El servidor se iniciará en el puerto 8080 por defecto.

## Endpoints

### Router de Mocks (`/api/mocks`)

#### GET `/api/mocks/mockingpets`
Genera 50 mascotas ficticias sin insertarlas en la base de datos.

**Ejemplo de uso:**
```bash
GET http://localhost:8080/api/mocks/mockingpets
```

**Respuesta:**
```json
{
  "status": "success",
  "payload": [
    {
      "name": "Max",
      "species": "dog",
      "breed": "Labrador",
      "age": 5
    },
    ...
  ]
}
```

#### GET `/api/mocks/mockingusers`
Genera usuarios ficticios con formato de MongoDB. Por defecto genera 50 usuarios, pero se puede especificar una cantidad mediante query parameter.

**Características de los usuarios generados:**
- Password encriptada: "coder123"
- Role: alterna entre "user" y "admin"
- Pets: array vacío
- Formato compatible con MongoDB

**Ejemplo de uso:**
```bash
GET http://localhost:8080/api/mocks/mockingusers
GET http://localhost:8080/api/mocks/mockingusers?quantity=10
```

**Respuesta:**
```json
{
  "status": "success",
  "payload": [
    {
      "_id": "...",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "age": 25,
      "password": "$2b$10$...",
      "role": "user",
      "pets": [],
      "createdAt": "2025-11-13T...",
      "updatedAt": "2025-11-13T..."
    },
    ...
  ]
}
```

#### POST `/api/mocks/generateData`
Genera e inserta usuarios y mascotas en la base de datos según los parámetros proporcionados.

**Parámetros requeridos:**
- `users`: número de usuarios a generar e insertar
- `pets`: número de mascotas a generar e insertar

**Ejemplo de uso:**
```bash
POST http://localhost:8080/api/mocks/generateData
Content-Type: application/json

{
  "users": 10,
  "pets": 15
}
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Datos generados e insertados correctamente",
  "payload": {
    "users": 10,
    "pets": 15
  }
}
```

### Router de Usuarios (`/api/users`)

#### GET `/api/users`
Obtiene todos los usuarios almacenados en la base de datos.

**Ejemplo de uso:**
```bash
GET http://localhost:8080/api/users
```

#### GET `/api/users/:id`
Obtiene un usuario específico por su ID.

**Ejemplo de uso:**
```bash
GET http://localhost:8080/api/users/507f1f77bcf86cd799439011
```

### Router de Mascotas (`/api/pets`)

#### GET `/api/pets`
Obtiene todas las mascotas almacenadas en la base de datos.

**Ejemplo de uso:**
```bash
GET http://localhost:8080/api/pets
```

#### GET `/api/pets/:id`
Obtiene una mascota específica por su ID.

**Ejemplo de uso:**
```bash
GET http://localhost:8080/api/pets/507f1f77bcf86cd799439011
```

## Flujo de Trabajo Recomendado

1. **Generar datos de prueba:**
   ```bash
   POST http://localhost:8080/api/mocks/generateData
   Body: { "users": 5, "pets": 8 }
   ```

2. **Verificar usuarios insertados:**
   ```bash
   GET http://localhost:8080/api/users
   ```

3. **Verificar mascotas insertadas:**
   ```bash
   GET http://localhost:8080/api/pets
   ```

4. **Probar generación sin insertar:**
   ```bash
   GET http://localhost:8080/api/mocks/mockingusers?quantity=3
   GET http://localhost:8080/api/mocks/mockingpets
   ```

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución
- **Express.js**: Framework web
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **bcrypt**: Encriptación de contraseñas
- **faker**: Generación de datos ficticios

## Dependencias

- express: ^4.18.2
- mongoose: ^7.5.0
- bcrypt: ^5.1.1
- faker: ^5.5.3

## Notas

- La base de datos utilizada es `coder` en MongoDB.
- Todos los usuarios generados tienen la contraseña "coder123" encriptada.
- Los roles se asignan aleatoriamente entre "user" y "admin".
- Los arrays de pets en usuarios generados están vacíos por defecto.

