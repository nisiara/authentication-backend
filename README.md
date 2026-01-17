# Backend de Autenticación (Node.js/Express)

Servicio sencillo de autenticación basado en JSON Web Tokens (JWT). Permite registrar usuarios, iniciar sesión y obtener el perfil del usuario autenticado. Los usuarios se persisten en un archivo local para facilitar el desarrollo.

**Características**
- Registro de usuarios con validación de email y contraseña fuerte.
- Inicio de sesión con emisión de JWT (expira en 1h).
- Endpoint privado protegido con `Bearer <token>`.
- Persistencia en archivo: `data/users.json`.
- Middleware de verificación de token.

---

## Requisitos
- Node.js 18+ y npm
- Archivo `.env` con:
	- `JWT_SECRET`: secreto para firmar tokens JWT (obligatorio)
	- `PORT` (opcional, por defecto `3001`)

Ejemplo de `.env`:
```
PORT=3001
JWT_SECRET=supersecreto-cambia-esto
```

---

## Instalación
```bash
npm install
```

## Ejecución
- Desarrollo (recarga con nodemon):
```bash
npm run dev
```

- Producción (Node directo):
```bash
node app.js
```

Nota: existe un script `staret` en `package.json` (con una errata). Puedes ejecutarlo con:
```bash
npm run staret
```
o renombrarlo a `start` para usar `npm start`.

---

## Estructura relevante
- `app.js`: arranque de Express y middlewares básicos.
- `routes/authentication-routes.js`: define rutas `/api`.
- `controllers/authentication-controller.js`: lógica HTTP (registro, login, me).
- `services/authentication-service.js`: negocio de auth (bcrypt + JWT).
- `middlewares/authentication-middleware.js`: validación de token JWT.
- `utils/validation.js`: validaciones de cuerpo `email/password`.
- `utils/file-storage.js`: lectura/escritura de `data/users.json`.
- `data/users.json`: almacenamiento de usuarios.

---

## Endpoints

Base URL por defecto: `http://localhost:3001`

### Salud
- GET `/` → 200 OK
	- Respuesta: `{ message: "Backend funcionando" }`

### Registrar usuario
- POST `/api/register`
	- Body JSON:
		```json
		{ "email": "user@example.com", "password": "P4ssw0rd!" }
		```
	- Validaciones de contraseña: mínimo 8 caracteres, incluye mayúscula, minúscula, número y carácter especial.
	- Respuestas:
		- 200 OK
			```json
			{
				"success": true,
				"message": "Usuario registrado exitosamente",
				"time": "2026-01-17T00:00:00.000Z",
				"data": { "user": { "id": "uuid", "email": "user@example.com", "createdAt": "..." } }
			}
			```
		- 400 Bad Request (validación)
		- 409 Conflict (usuario ya registrado)

### Iniciar sesión
- POST `/api/login`
	- Body JSON:
		```json
		{ "email": "user@example.com", "password": "P4ssw0rd!" }
		```
	- Respuestas:
		- 200 OK
			```json
			{
				"success": true,
				"message": "Inicio de sesión exitoso",
				"time": "2026-01-17T00:00:00.000Z",
				"data": {
					"token": "<JWT>",
					"user": { "id": "uuid", "email": "user@example.com" }
				}
			}
			```
		- 401 Unauthorized (credenciales inválidas)

### Endpoint privado (requiere token)
- GET `/api/me`
	- Headers: `Authorization: Bearer <JWT>`
	- Respuestas:
		- 200 OK
			```json
			{
				"success": true,
				"message": "Usuario obtenido exitosamente",
				"time": "2026-01-17T00:00:00.000Z",
				"data": { "user": { "id": "uuid", "email": "user@example.com" } }
			}
			```
		- 401 Unauthorized (token ausente/invalidado/expirado)
		- 404 Not Found (usuario no encontrado)

---

## Ejemplos con cURL

Registrar:
```bash
curl -X POST http://localhost:3001/api/register \
	-H "Content-Type: application/json" \
	-d '{"email":"user@example.com","password":"P4ssw0rd!"}'
```

Login:
```bash
curl -X POST http://localhost:3001/api/login \
	-H "Content-Type: application/json" \
	-d '{"email":"user@example.com","password":"P4ssw0rd!"}'
```

Perfil (privado):
```bash
curl http://localhost:3001/api/me \
	-H "Authorization: Bearer <JWT>"
```

---

## Errores y formato de respuesta
- Éxito: `success: true`, `message`, `time`, `data`.
- Error: `status: "error"`, `message`, `time`, `taskId`.

---

## Notas
- Los usuarios se guardan en `data/users.json` (solo para desarrollo/ejemplo).
- Las contraseñas se almacenan con `bcrypt`.
- Los tokens JWT expiran en 1 hora.
- No hay endpoint de logout; para invalidar, espera la expiración o cambia `JWT_SECRET`.

---

## Scripts disponibles
- `dev`: inicia con `nodemon`.
- `staret`: inicia con `node app.js` (errata; puedes renombrarlo a `start`).
- `test`: placeholder sin tests definidos.

---

## Seguridad (recomendaciones)
- Usa un `JWT_SECRET` robusto y manténlo fuera del control de versiones.
- Considera HTTPS/TLS en entornos reales.
- Este proyecto es educativo y no debe usarse tal cual en producción.

