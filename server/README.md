# Backend - Autenticación y autorización por roles

## Roles y permisos

Los únicos roles son `gerencia` y `soporte`.

| Operación                  | Gerencia | Soporte  |
| -------------------------- | -------- | -------- |
| Consultar clientes (GET)   | Sí       | Sí       |
| Crear clientes (POST)      | Sí       | Sí       |
| Editar clientes (PUT)      | Sí       | Sí       |
| Eliminar clientes (DELETE) | Sí       | No (403) |

El backend es quien decide: el rol sale de la base de datos y viaja firmado en un
token JWT. Ocultar el botón "Eliminar" en React es solo una ayuda visual.

## Variables de entorno

Se definen en `server/.env` (no se sube al repositorio). El archivo `server/.env.example`
lista todas las variables sin valores.

| Variable | Propósito |
| -------- | --------- |
| `MONGODB_URI` | Cadena de conexión de MongoDB Atlas |
| `JWT_SECRET` | Clave con la que se firman y verifican los tokens |
| `JWT_EXPIRES_IN` | Duración del token (opcional, por defecto `8h`) |
| `SEED_GERENCIA_NOMBRE` / `_EMAIL` / `_PASSWORD` | Datos de la cuenta de prueba de Gerencia |
| `SEED_SOPORTE_NOMBRE` / `_EMAIL` / `_PASSWORD` | Datos de la cuenta de prueba de Soporte |

Para generar un `JWT_SECRET` aleatorio:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Las contraseñas de prueba deben tener al menos 8 caracteres, una mayúscula y un número,
porque el formulario de login aplica esas reglas antes de enviar los datos.

## Crear las cuentas de prueba

Con `server/.env` completo, desde la raíz del repositorio:

```bash
node server/scripts/seedUsuarios.js
```

El script es idempotente: si una cuenta ya existe no la duplica ni la modifica.
Las contraseñas se guardan con hash (bcrypt) y nunca se muestran por consola.

## Iniciar el backend

Desde la raíz del repositorio (el servidor busca `server/.env` desde esa carpeta):

```bash
node server/server.js
```

## Endpoints

| Método | Ruta | Acceso | Descripción |
| ------ | ---- | ------ | ----------- |
| POST | `/api/auth/login` | Público | Recibe `email`, `password` y opcionalmente `sector`. Devuelve `token` y datos del usuario |
| GET | `/api/clientes` | Autenticado | Lista clientes |
| GET | `/api/clientes/:id` | Autenticado | Consulta un cliente |
| POST | `/api/clientes` | Autenticado | Crea un cliente |
| PUT | `/api/clientes/:id` | Autenticado | Actualiza un cliente |
| DELETE | `/api/clientes/:id` | Solo `gerencia` | Elimina un cliente |

Las rutas protegidas requieren el encabezado `Authorization: Bearer <token>`.

- `401`: falta el token, es inválido o venció.
- `403`: el token es válido pero el rol no tiene permiso.

## Limitaciones conocidas

- El token se guarda en `sessionStorage` del navegador (se pierde al cerrar la pestaña).
  Es accesible desde JavaScript, por lo que una vulnerabilidad XSS podría leerlo.
  En producción se recomienda una cookie `httpOnly` con HTTPS.
- No hay límite de intentos de login (rate limiting).
- No hay registro público ni administración de usuarios: quedan fuera del alcance.
- Los contadores de Gerencia y Soporte del Dashboard no se modificaron en este trabajo.