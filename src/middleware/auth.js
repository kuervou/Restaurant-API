/*
Aquí, el middleware se encarga de:

Leer el token del encabezado Authorization.
Verificar el token usando jwt.verify.
Comprobar si el rol del usuario está permitido
Adjuntar el resultado al objeto req si el token es válido.
Pasar el control al siguiente middleware en la cadena usando next().

Cómo se usa esto?

En los archivos dentro de la carpeta routes, se puede ver que se usa de la siguiente manera:

router.get(
    '/categorias/:id',
    auth([ROLES.ADMIN]),
    categoriaController.getCategoriaById
)

En ese caso solo tiene permitido el acceso al endpoint aquellos usuarios con rol ADMIN

Si, en cambio dijera: auth([]), cualquier usuario logueado podría acceder al endpoint.

Si no se utiliza el middleware como en el siguiente caso, cualquier usuario podría acceder al endpoint incluso sin estar logueado:

router.post(
    '/login',
    validate(loginSchema),
    validate(querySchema, 'query'),
    empleadoController.login
)

*/
const jwt = require('jsonwebtoken')
const { HttpCode, HttpError } = require('../error-handling/http_error')

module.exports = function (allowedRoles = []) {
    return function (req, res, next) {
        const token = req.header('Authorization')
            ? req.header('Authorization').replace('Bearer ', '')
            : null

        if (!token) {
            throw new HttpError(
                HttpCode.UNAUTHORIZED,
                'Acceso denegado. No hay token proporcionado.'
            )
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            req.user = decoded

            // Comprobar si el rol del usuario está permitido
            if (allowedRoles.length && !allowedRoles.includes(decoded.rol)) {
                throw new HttpError(
                    HttpCode.FORBIDDEN,
                    'Acceso denegado. No tienes permiso para realizar esta acción.'
                )
            }

            // Comprobar si el usuario está activo
            if (!decoded.activo) {
                throw new HttpError(
                    HttpCode.FORBIDDEN,
                    'Acceso denegado. Tu cuenta no está activa.'
                )
            }

            next()
        } catch (ex) {
            if (ex instanceof jwt.JsonWebTokenError) {
                throw new HttpError(HttpCode.BAD_REQUEST, 'Token inválido.')
            }
            throw ex
        }
    }
}
