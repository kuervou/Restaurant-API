const empleadoRepository = require('../repositories/empleadoRepository')
const bcrypt = require('bcryptjs')
const { HttpError, HttpCode } = require('../error-handling/http_error')

// Función auxiliar para chequear la unicidad del nick
const checkNickUnique = async (nick, excludeId = null) => {
    const existingUser = await empleadoRepository.findByNick(nick)
    if (existingUser && (!excludeId || existingUser.id !== excludeId)) {
        throw new HttpError(
            HttpCode.CONFLICT,
            'El nick ya está siendo utilizado por otro empleado'
        )
    }
}

const empleadoService = {
    crearEmpleado: async (
        nick,
        nombre,
        apellido,
        password,
        telefono,
        rol,
        activo
    ) => {
        // Chequear si el nick es único antes de intentar crear el empleado
        await checkNickUnique(nick)

        return await empleadoRepository.create(
            nick,
            nombre,
            apellido,
            password,
            telefono,
            rol,
            activo
        )
    },

    getEmpleados: async function (options = {}) {
        return await empleadoRepository.findAll(options)
    },

    getEmpleadoById: async (id) => {
        return await empleadoRepository.getEmpleadoById(id)
    },

    updateEmpleado: async (
        id,
        nick,
        nombre,
        apellido,
        password,
        telefono,
        rol,
        activo
    ) => {
        // Chequear si el nick es único antes de intentar actualizar el empleado
        if (nick) await checkNickUnique(nick, id)

        return await empleadoRepository.update(
            id,
            nick,
            nombre,
            apellido,
            password,
            telefono,
            rol,
            activo
        )
    },

    deleteEmpleado: async (id) => {
        return await empleadoRepository.deleteEmpleado(id)
    },

    authenticate: async (nick, password) => {
        const user = await empleadoRepository.findByNick(nick)
        if (!user) return null

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) return null

        return user
    },

    resetPassword: async (id, newPassword) => {
        return await empleadoRepository.resetPassword(id, newPassword) //la encriptación de la password se hace en un hook de sequelize
    },

    authenticateById: async (id, password) => {
        const empleado = await empleadoRepository.getPasswordById(id)

        if (!empleado) return null

        const isPasswordValid = await bcrypt.compare(
            password,
            empleado.password
        )
        if (!isPasswordValid) return null

        return empleado
    },
}

module.exports = empleadoService
