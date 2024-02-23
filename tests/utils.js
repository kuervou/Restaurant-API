const jwt = require('jsonwebtoken')

function generateTokenForTesting() {
    // Definimos un payload básico para las pruebas.
    // Esto debe ser similar al payload que usas en producción
    // al generar tokens para usuarios reales.
    const testUserPayload = {
        id: 1,
        rol: 'Admin',
        nick: 'pipe',
        nombre: 'Felipe',
        apellido: 'Prince',
        telefono: '123456789',
        activo: true,
    }

    // Genera un token usando el payload y tu clave secreta.
    // Esto debería ser similar a cómo generas tokens en producción.
    const token = jwt.sign(testUserPayload, process.env.SECRET_KEY, {
        expiresIn: '1h', // puedes ajustar la duración si es necesario
    })

    return token
}
module.exports = { generateTokenForTesting }
