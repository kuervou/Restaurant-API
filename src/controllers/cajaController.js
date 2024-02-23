const cajaService = require('../services/cajaService')
const asyncHandler = require('express-async-handler')
const { HttpError, HttpCode } = require('../error-handling/http_error')

const cajaController = {
    crearCaja: asyncHandler(async (req, res) => {
        const { total } = req.body
        await cajaService.crearCaja(total)
        res.status(HttpCode.CREATED).json({ message: 'Caja creada' })
    }),

    getCajas: asyncHandler(async (req, res) => {
        const cajas = await cajaService.getCajas()
        res.json(cajas)
    }),

    getCajaById: asyncHandler(async (req, res) => {
        const id = req.params.id

        const caja = await cajaService.getCajaById(id)

        if (!caja) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Caja no encontrada')
        }

        res.status(HttpCode.OK).json(caja)
    }),

    updateCaja: asyncHandler(async (req, res) => {
        const id = req.params.id
        const { total } = req.body

        const cajaActualizada = await cajaService.updateCaja(id, total)

        if (cajaActualizada[0] === 0) {
            // Si la cantidad de registros actualizados es 0
            throw new HttpError(HttpCode.NOT_FOUND, 'Caja no encontrada')
        }

        res.status(HttpCode.OK).json({ message: 'Caja actualizada' })
    }),

    deleteCaja: asyncHandler(async (req, res) => {
        const id = req.params.id

        const resultado = await cajaService.deleteCaja(id)

        if (resultado === 0) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Caja no encontrada')
        }

        res.status(HttpCode.OK).json({ message: 'Caja eliminada' })
    }),
}

module.exports = cajaController
