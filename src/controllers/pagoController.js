// src/controllers/pagoController.js

const pagoService = require('../services/pagoService')
const asyncHandler = require('express-async-handler')
const { HttpCode, HttpError } = require('../error-handling/http_error')
const cajaService = require('../services/cajaService')

const pagoController = {
    crearPago: asyncHandler(async (req, res) => {
        const pagoData = req.body
        const { nuevoPago } = await pagoService.crearPago(pagoData)
        const io = req.io

        io.emit('fetchOrdenes', { message: 'Orden actualizada' })

        io.emit('fetchTotalCaja', { message: 'Pago creada' })
        res.status(HttpCode.CREATED).json({
            message: 'Pago creado',
            nuevoPago,
        })
    }),

    getPagos: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const fecha = req.query.fecha || ''
        const ordenId = req.query.ordenId || ''

        const pagos = await pagoService.getPagos({
            page,
            limit,
            fecha,
            ordenId,
        })
        res.json(pagos)
    }),

    getPagoById: asyncHandler(async (req, res) => {
        const id = req.params.id
        const pago = await pagoService.getPagoById(id)
        res.status(HttpCode.OK).json(pago)
    }),

    getPagosByCajaId: asyncHandler(async (req, res) => {
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
        const pagos = await pagoService.getPagosByCajaId(id, options)
        res.status(HttpCode.OK).json(pagos)
    }),

    deletePago: asyncHandler(async (req, res) => {
        const id = req.params.id
        const { pagoEliminado } = await pagoService.deletePago(id)
        const io = req.io

        io.emit('fetchOrdenes', { message: 'Orden actualizada' })

        io.emit('fetchTotalCaja', { message: 'Pago eliminado' })

        res.status(HttpCode.OK).json({
            message: 'Pago eliminado',
            pagoEliminado,
        })
    }),
}

module.exports = pagoController
