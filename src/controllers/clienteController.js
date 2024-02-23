const clienteService = require('../services/clienteService')
const asyncHandler = require('express-async-handler')
const { HttpError, HttpCode } = require('../error-handling/http_error')

const clienteController = {
    crearCliente: asyncHandler(async (req, res) => {
        const { nombre, apellido, telefono } = req.body
        const nombreNormalizado = nombre.toLowerCase() //normalizamos el nombre
        const apellidoNormalizado = apellido.toLowerCase() //normalizamos el apellido
        await clienteService.crearCliente(
            nombreNormalizado,
            apellidoNormalizado,
            telefono
        )
        res.status(HttpCode.CREATED).json({ message: 'Cliente creado' })
    }),

    getClientes: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const filterName = req.query.nombre || ''
        const filterApellido = req.query.apellido || ''

        const clientes = await clienteService.getClientes({
            page,
            limit,
            nombre: filterName,
            apellido: filterApellido,
        })
        res.json(clientes)
    }),

    getClienteById: asyncHandler(async (req, res) => {
        const id = req.params.id

        const cliente = await clienteService.getClienteById(id)

        if (!cliente) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Cliente no encontrado')
        }

        res.status(HttpCode.OK).json(cliente)
    }),

    updateCliente: asyncHandler(async (req, res) => {
        const id = req.params.id
        const { telefono, cuenta } = req.body
        let { nombre, apellido } = req.body
        nombre = nombre ? nombre.toLowerCase() : undefined //normalizamos el nombre
        apellido = apellido ? apellido.toLowerCase() : undefined //normalizamos el apellido
        const clienteActualizado = await clienteService.updateCliente(
            id,
            nombre,
            apellido,
            telefono,
            cuenta
        )

        if (clienteActualizado[0] === 0) {
            // Si la cantidad de registros actualizados es 0
            throw new HttpError(HttpCode.NOT_FOUND, 'Cliente no encontrado')
        }

        res.status(HttpCode.OK).json({ message: 'Cliente actualizado' })
    }),

    deleteCliente: asyncHandler(async (req, res) => {
        const id = req.params.id

        const resultado = await clienteService.deleteCliente(id)

        if (resultado === 0) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Cliente no encontrado')
        }

        res.status(HttpCode.OK).json({ message: 'Cliente eliminado' })
    }),
}

module.exports = clienteController
