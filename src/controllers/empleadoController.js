const empleadoService = require('../services/empleadoService')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const { HttpError, HttpCode } = require('../error-handling/http_error')
const SECRET_KEY = process.env.SECRET_KEY

const empleadoController = {
    crearEmpleado: asyncHandler(async (req, res) => {
        const { nick, nombre, apellido, password, telefono, rol } = req.body
        await empleadoService.crearEmpleado(
            nick,
            nombre,
            apellido,
            password,
            telefono,
            rol
        )
        res.status(HttpCode.CREATED).json({ message: 'Empleado creado' })
    }),

    getEmpleados: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const filterName = req.query.nombre || ''
        const filterApellido = req.query.apellido || ''
        const filterNick = req.query.nick || ''
        const filterRol = req.query.rol || ''

        const empleados = await empleadoService.getEmpleados({
            page,
            limit,
            nick: filterNick,
            rol: filterRol,
            nombre: filterName,
            apellido: filterApellido,
        })
        res.json(empleados)
    }),

    getEmpleadoById: asyncHandler(async (req, res) => {
        const id = req.params.id

        const empleado = await empleadoService.getEmpleadoById(id)

        if (!empleado) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Empleado no encontrado')
        }

        res.status(HttpCode.OK).json(empleado)
    }),

    updateEmpleado: asyncHandler(async (req, res) => {
        const id = req.params.id
        const { nick, nombre, apellido, password, telefono, rol, activo } =
            req.body

        const empleadoActualizado = await empleadoService.updateEmpleado(
            id,
            nick,
            nombre,
            apellido,
            password,
            telefono,
            rol,
            activo
        )

        if (empleadoActualizado[0] === 0) {
            // Si la cantidad de registros actualizados es 0
            throw new HttpError(HttpCode.NOT_FOUND, 'Empleado no encontrado')
        }

        res.status(HttpCode.OK).json({ message: 'Empleado actualizado' })
    }),

    deleteEmpleado: asyncHandler(async (req, res) => {
        const id = req.params.id

        const resultado = await empleadoService.deleteEmpleado(id)

        if (resultado == 0) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Empleado no encontrado')
        }

        res.status(HttpCode.OK).json({ message: 'Empleado desactivado' })
    }),

    login: asyncHandler(async (req, res) => {
        const { nick, password } = req.body
        const empleado = await empleadoService.authenticate(nick, password)

        if (!empleado) {
            throw new HttpError(
                HttpCode.UNAUTHORIZED,
                'Usuario o contraseña incorrecta'
            )
        }

        if (empleado.activo === false) {
            throw new HttpError(HttpCode.UNAUTHORIZED, 'Usuario no está activo')
        }

        const token = jwt.sign(
            {
                id: empleado.id,
                nick: empleado.nick,
                nombre: empleado.nombre,
                apellido: empleado.apellido,
                telefono: empleado.telefono,
                rol: empleado.rol,
                activo: empleado.activo,
            },
            SECRET_KEY,
            { expiresIn: '10h' }
        )

        res.status(HttpCode.OK).json({
            token,
            empleado: {
                id: empleado.id,
                nick: empleado.nick,
                nombre: empleado.nombre,
                apellido: empleado.apellido,
                telefono: empleado.telefono,
                rol: empleado.rol,
                activo: empleado.activo,
            },
        })
    }),

    resetPassword: asyncHandler(async (req, res) => {
        const id = req.params.id
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'Se necesita la contraseña actual y la nueva contraseña'
            )
        }

        const empleado = await empleadoService.authenticateById(
            id,
            currentPassword
        )

        if (!empleado) {
            throw new HttpError(
                HttpCode.UNAUTHORIZED,
                'Contraseña actual incorrecta'
            )
        }

        await empleadoService.resetPassword(id, newPassword)

        res.status(HttpCode.OK).json({ message: 'Contraseña actualizada' })
    }),
}

module.exports = empleadoController
