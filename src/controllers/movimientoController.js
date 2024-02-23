const movimientoService = require('../services/movimientoService')
const asyncHandler = require('express-async-handler')
const cajaService = require('../services/cajaService')
const { HttpError, HttpCode } = require('../error-handling/http_error')

const movimientoController = {
    crearMovimiento: asyncHandler(async (req, res) => {
        const movimientoData = req.body
        //pasar el movimientoData.total a number si es string
        movimientoData.total = Number(movimientoData.total)
        await movimientoService.crearMovimiento(movimientoData)
        const io = req.io

        io.emit('fetchTotalCaja', { message: 'Movimiento creado' })
        res.status(HttpCode.CREATED).json({ message: 'Movimiento creado' })
    }),

    getMovimientos: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const filterFecha = req.query.fecha || ''

        const movimientos = await movimientoService.getMovimientos({
            page,
            limit,
            fecha: filterFecha,
        })
        res.json(movimientos)
    }),

    getMovimientoById: asyncHandler(async (req, res) => {
        const id = req.params.id

        const movimiento = await movimientoService.getMovimientoById(id)

        if (!movimiento) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Movimiento no encontrado')
        }

        res.status(HttpCode.OK).json(movimiento)
    }),

    getMovimientosByCajaId: asyncHandler(async (req, res) => {
        const id = req.params.id

        //obtenemos los datos para el paginado
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const options = {
            page,
            limit,
        }

        //validamos que la caja exista
        const caja = await cajaService.getCajaById(id)

        if (!caja) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Caja no encontrada')
        }

        const movimientos = await movimientoService.getMovimientosByCajaId(
            id,
            options
        )

        if (!movimientos) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'Movimientos no encontrados'
            )
        }

        res.status(HttpCode.OK).json(movimientos)
    }),

    deleteMovimiento: asyncHandler(async (req, res) => {
        const id = req.params.id

        const resultado = await movimientoService.deleteMovimiento(id)

        if (resultado === 0) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Movimiento no encontrado')
        }
        const io = req.io

        io.emit('fetchTotalCaja', { message: 'Movimiento eliminado' })

        res.status(HttpCode.OK).json({ message: 'Movimiento eliminado' })
    }),
}

module.exports = movimientoController
