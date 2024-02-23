// src/controllers/compraController.js

const compraService = require('../services/compraService')
const asyncHandler = require('express-async-handler')
const { HttpError, HttpCode } = require('../error-handling/http_error')

const compraController = {
    crearCompra: asyncHandler(async (req, res) => {
        const data = req.body
        const result = await compraService.crearCompra(data)
        res.status(HttpCode.CREATED).json({
            message: 'Compra creada',
            result,
        })
    }),

    getCompras: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const fecha = req.query.fecha

        const compras = await compraService.getCompras({
            page,
            limit,
            fecha,
        })
        res.json(compras)
    }),

    getCompraById: asyncHandler(async (req, res) => {
        const id = req.params.id

        const compra = await compraService.getCompraById(id)

        if (!compra) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Compra no encontrada')
        }

        res.status(HttpCode.OK).json(compra)
    }),

    deleteCompra: asyncHandler(async (req, res) => {
        const id = req.params.id

        const resultado = await compraService.deleteCompra(id)

        if (resultado === 0) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Compra no encontrada')
        }

        res.status(HttpCode.OK).json({ message: 'Compra eliminada' })
    }),
}

module.exports = compraController
