const mesaService = require('../services/mesaService')
const asyncHandler = require('express-async-handler')
const { HttpError, HttpCode } = require('../error-handling/http_error')

const mesaController = {
    crearMesa: asyncHandler(async (req, res) => {
        const { nroMesa, libre } = req.body
        await mesaService.crearMesa(nroMesa, libre)
        res.status(HttpCode.CREATED).json({ message: 'Mesa creada' })
    }),

    getMesas: asyncHandler(async (req, res) => {
        const mesas = await mesaService.getMesas()
        res.json(mesas)
    }),

    getMesasOcupadas: asyncHandler(async (req, res) => {
        const mesas = await mesaService.getMesasOcupadas()
        res.json(mesas)
    }),

    getMesasLibres: asyncHandler(async (req, res) => {
        const mesas = await mesaService.getMesasLibres()
        res.json(mesas)
    }),

    getMesaById: asyncHandler(async (req, res) => {
        const id = req.params.id

        const mesa = await mesaService.getMesaById(id)

        if (!mesa) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Mesa no encontrada')
        }

        res.status(HttpCode.OK).json(mesa)
    }),

    updateMesa: asyncHandler(async (req, res) => {
        const id = req.params.id
        const { nroMesa, libre } = req.body

        const mesaActualizada = await mesaService.updateMesa(id, nroMesa, libre)

        if (mesaActualizada[0] === 0) {
            // Si la cantidad de registros actualizados es 0
            throw new HttpError(HttpCode.NOT_FOUND, 'Mesa no encontrada')
        }

        res.status(HttpCode.OK).json({ message: 'Mesa actualizada' })
    }),

    deleteMesa: asyncHandler(async (req, res) => {
        const id = req.params.id

        const resultado = await mesaService.deleteMesa(id)

        if (resultado === 0) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Mesa no encontrada')
        }

        res.status(HttpCode.OK).json({ message: 'Mesa eliminada' })
    }),
}

module.exports = mesaController
