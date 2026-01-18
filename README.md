# Backend de Autenticación (Node.js/Express)

Servicio de autenticación basado en JSON Web Tokens (JWT). Permite registrar usuarios, iniciar sesión y obtener el perfil del usuario autenticado. Los usuarios se persisten en un archivo local para facilitar el desarrollo.

## 🎯 Características

- ✅ Registro de usuarios con validación de email y contraseña fuerte
- ✅ Inicio de sesión con emisión de JWT (expira en 1 hora)
- ✅ Endpoint privado protegido con `Bearer <token>`
- ✅ Persistencia en archivo: `data/users.json`
- ✅ Middleware de verificación de token JWT
- ✅ Manejo robusto de errores con códigos HTTP apropiados
- ✅ Logging de solicitudes con Morgan

## 📋 Requisitos

- Node.js 18+
- npm

## 🔧 Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3001
JWT_SECRET=tu_clave_secreta_muy_segura_minimo_32_caracteres_cambiar
```

**Variables de entorno:**
- `JWT_SECRET` (obligatorio): Clave secreta para firmar tokens JWT. Debe ser una cadena larga y segura.
- `PORT` (opcional): Puerto en el que se ejecutará el servidor. Por defecto es `3001`.

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias

```bash
npm install
```

### 2. Ejecutar en desarrollo

Con recarga automática usando nodemon:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

### 3. Ejecutar en producción

```bash
npm start
```

## 📁 Estructura del Proyecto

```
.
├── app.js                              # Punto de entrada y configuración de Express
├── package.json                        # Dependencias del proyecto
├── .env                                # Variables de entorno (no versionado)
├── controllers/
│   └── authentication-controller.js    # Lógica de controladores HTTP
├── routes/
│   └── authentication-routes.js        # Definición de rutas de API
├── services/
│   └── authentication-service.js       # Lógica de negocio (JWT, bcrypt)
├── middlewares/
│   └── authentication-middleware.js    # Validación y verificación de tokens
├── utils/
│   ├── validation.js                   # Validaciones de email y contraseña
│   └── file-storage.js                 # Lectura/escritura de datos en archivo
├── data/
│   └── users.json                      # Almacenamiento de usuarios (desarrollo)
└── README.md                           # Este archivo
```

### Descripción de componentes clave

- **app.js**: Configura Express, middlewares (CORS, helmet, morgan) y define el puerto
- **authentication-routes.js**: Expone los endpoints `/api/register`, `/api/login` y `/api/me`
- **authentication-controller.js**: Maneja solicitudes HTTP y respuestas
- **authentication-service.js**: Lógica de autenticación (registro, login, generación de JWT)
- **authentication-middleware.js**: Verifica la validez del token JWT en solicitudes
- **validation.js**: Valida formato de email y requisitos de contraseña
- **file-storage.js**: Persiste usuarios en `data/users.json`
- **users.json**: Almacén de datos de usuarios (solo para desarrollo)

## 🔌 Endpoints

**Base URL:** `http://localhost:3001`

### Health Check
- **GET** `/`
  - **Descripción**: Verifica que el servidor está activo
  - **Respuesta 200 OK**:
    ```json
    { "message": "Backend funcionando" }
    ```

### Registrar Usuario
- **POST** `/api/register`
  - **Descripción**: Crea una nueva cuenta de usuario
  - **Body JSON**:
    ```json
    {
      "email": "user@example.com",
      "password": "P4ssw0rd!"
    }
    ```
  - **Validaciones de contraseña**:
    - Mínimo 8 caracteres
    - Al menos una mayúscula
    - Al menos una minúscula
    - Al menos un número
    - Al menos un carácter especial (!@#$%^&*)
  - **Respuestas**:
    - **200 OK** - Usuario registrado exitosamente:
      ```json
      {
        "success": true,
        "message": "Usuario registrado exitosamente",
        "time": "2026-01-18T12:30:00.000Z",
        "data": {
          "user": {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "email": "user@example.com",
            "createdAt": "2026-01-18T12:30:00.000Z"
          }
        }
      }
      ```
    - **400 Bad Request** - Validación fallida (email/contraseña inválida)
    - **409 Conflict** - El email ya está registrado

### Iniciar Sesión
- **POST** `/api/login`
  - **Descripción**: Autentica un usuario y devuelve un token JWT
  - **Body JSON**:
    ```json
    {
      "email": "user@example.com",
      "password": "P4ssw0rd!"
    }
    ```
  - **Respuestas**:
    - **200 OK** - Login exitoso:
      ```json
      {
        "success": true,
        "message": "Inicio de sesión exitoso",
        "time": "2026-01-18T12:30:00.000Z",
        "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          "user": {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "email": "user@example.com"
          }
        }
      }
      ```
    - **401 Unauthorized** - Credenciales inválidas o usuario no existe

### Obtener Perfil del Usuario (Protegido)
- **GET** `/api/me`
  - **Descripción**: Obtiene la información del usuario autenticado
  - **Headers requeridos**:
    ```
    Authorization: Bearer <JWT_TOKEN>
    ```
  - **Respuestas**:
    - **200 OK** - Usuario obtenido:
      ```json
      {
        "success": true,
        "message": "Usuario obtenido exitosamente",
        "time": "2026-01-18T12:30:00.000Z",
        "data": {
          "user": {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "email": "user@example.com"
          }
        }
      }
      ```
    - **401 Unauthorized** - Token ausente, inválido o expirado
    - **404 Not Found** - Usuario no encontrado

---

## 📝 Ejemplos de Uso

### 1. Registrar un usuario

```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "MiPassword123!"
  }'
```

### 2. Iniciar sesión

```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "MiPassword123!"
  }'
```

Guarda el token de la respuesta para usarlo en siguientes solicitudes.

### 3. Obtener perfil del usuario (requiere token)

```bash
curl -X GET http://localhost:3001/api/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📋 Formato de Respuestas

### Respuesta de Éxito

```json
{
  "success": true,
  "message": "Descripción de la acción realizada",
  "time": "2026-01-18T12:30:00.000Z",
  "data": {
    // Información específica de la respuesta
  }
}
```

### Respuesta de Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "time": "2026-01-18T12:30:00.000Z"
}
```

---

## 📦 Scripts Disponibles

```bash
npm run dev      # Inicia el servidor con nodemon (reloads automáticos)
npm start        # Inicia el servidor en modo producción
npm test         # Ejecuta tests (actualmente sin tests)
```

---

## 🔐 Seguridad

### Características de Seguridad

- ✅ Contraseñas hasheadas con bcryptjs
- ✅ Tokens JWT con expiración de 1 hora
- ✅ Validación de entrada robusta
- ✅ Middleware de CORS configurado
- ✅ Helmet para headers de seguridad HTTP
- ✅ Validación de email y contraseña fuerte

### ⚠️ Recomendaciones de Seguridad

1. **JWT_SECRET**: Usa una clave secreta robusta (mínimo 32 caracteres alphanumméricos) y mantenla fuera del control de versiones
2. **Validación**: Valida siempre en el backend, nunca confíes solo en validación del cliente

### 🔩 Consideraciones para producción

1. **HTTPS/TLS**: En producción, usa HTTPS para todas las comunicaciones
2. **Base de datos**: En producción, reemplaza `data/users.json` con una base de datos como MongoDB o PostgreSQL
3. **Rate Limiting**: Considera implementar rate limiting para endpoints de login y registro
4. **CORS**: Configura CORS adecuadamente para permitir solo dominios confiables

### ⚡ Notas Importantes

- Este proyecto es **educativo** y **no debe usarse en producción sin mejoras significativas**
- Los usuarios se almacenan en `data/users.json` (solo para desarrollo)
- Las contraseñas se hashean con bcryptjs antes de ser almacenadas
- Los tokens JWT expiran en 1 hora; para logout, el cliente debe eliminar el token localmente
- Para invalidar un token antes de su expiración, cambia el `JWT_SECRET` (esto invalidará todos los tokens existentes)

---

## 🔗 Frontend Relacionado

- [Frontend - dfe3_exp1_s2](https://github.com/nisiara/dfe3_exp1_s2)

---

## 📚 Dependencias Principales

| Paquete | Versión | Propósito |
|---------|---------|----------|
| express | ^5.2.1 | Framework web |
| jsonwebtoken | ^9.0.3 | Generación y validación de JWT |
| bcryptjs | ^3.0.3 | Hashing de contraseñas |
| cors | ^2.8.5 | Control de CORS |
| dotenv | ^17.2.3 | Variables de entorno |
| helmet | ^8.1.0 | Seguridad HTTP headers |
| morgan | ^1.10.1 | Logging de solicitudes |



