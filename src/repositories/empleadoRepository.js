const { Empleado } = require('../models')
const { Op } = require('sequelize')

const empleadoRepository = {
    create: async (nick, nombre, apellido, password, telefono, rol) => {
        const nuevoEmpleado = await Empleado.create({
            nick,
            nombre,
            apellido,
            password,
            telefono,
            rol,
        })
        return nuevoEmpleado
    },
    findAll: async (options = {}) => {
        const { page = 1, limit = 10, nombre, apellido, nick, rol } = options

        const offset = (page - 1) * limit

        const whereClause = {}
        whereClause.activo = true // Solo empleados activos
        if (nick) whereClause.nick = { [Op.like]: `%${nick}%` }
        if (nombre) whereClause.nombre = { [Op.like]: `%${nombre}%` }
        if (apellido) whereClause.apellido = { [Op.like]: `%${apellido}%` }
        if (rol) whereClause.rol = { [Op.like]: `%${rol}%` }

        const result = await Empleado.findAndCountAll({
            where: whereClause,
            offset,
            limit,
            order: [['nombre', 'ASC']],
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },

    update: async (
        id,
        nick,
        nombre,
        apellido,
        password,
        telefono,
        rol,
        activo
    ) => {
        return await Empleado.update(
            { nick, nombre, apellido, password, telefono, rol, activo },
            { where: { id: id } }
        )
    },

    getEmpleadoById: async (id) => {
        return await Empleado.findByPk(id, {
            attributes: { exclude: ['password'] },
        })
    },

    getPasswordById: async (id) => {
        return await Empleado.findOne({
            where: { id: id },
            attributes: ['id', 'password'],
        })
    },

    findByNick: async (nick) => {
        return await Empleado.findOne({ where: { nick } })
    },

    deleteEmpleado: async (id) => {
        return await Empleado.update({ activo: false }, { where: { id: id } })
    },

    resetPassword: async (id, newPassword) => {
        const empleado = await Empleado.findByPk(id)
        if (!empleado) {
            throw new Error('Empleado no encontrado')
        }
        empleado.password = newPassword
        return await empleado.save()
    },
}

module.exports = empleadoRepository
