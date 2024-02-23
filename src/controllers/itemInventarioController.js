const itemInventarioService = require('../services/itemInventarioService')
const asyncHandler = require('express-async-handler')
const { HttpError, HttpCode } = require('../error-handling/http_error')

const itemInventarioController = {
    crearItemInventario: asyncHandler(async (req, res) => {
        const {
            nombre,
            descripcion,
            stock,
            costo,
            cantxCasillero,
            porUnidad,
            categoriaId,
        } = req.body
        const nombreNormalizado = nombre.toLowerCase() //normalizamos el nombre
        await itemInventarioService.crearItemInventario(
            nombreNormalizado,
            descripcion,
            stock,
            costo,
            cantxCasillero,
            porUnidad,
            categoriaId
        )
        res.status(HttpCode.CREATED).json({ message: 'ItemInventario creado' })
    }),

    getItemsInventario: asyncHandler(async (req, res) => {
        const { page, limit, nombre, categoriaId, porUnidad } = req.query

        const options = {}
        if (page) options.page = +page
        if (limit) options.limit = +limit
        if (nombre) options.nombre = nombre
        if (categoriaId) options.categoriaId = +categoriaId
        if (porUnidad) options.porUnidad = porUnidad

        const itemsInventario =
            await itemInventarioService.getItemsInventario(options)
        res.json(itemsInventario)
    }),

    getItemInventarioById: asyncHandler(async (req, res) => {
        const id = req.params.id

        const itemInventario =
            await itemInventarioService.getItemInventarioById(id)

        if (!itemInventario) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'ItemInventario no encontrado'
            )
        }

        res.status(HttpCode.OK).json(itemInventario)
    }),

    updateItemInventario: asyncHandler(async (req, res) => {
        const id = req.params.id
        const {
            descripcion,
            stock,
            costo,
            cantxCasillero,
            porUnidad,
            categoriaId,
        } = req.body
        let { nombre } = req.body
        nombre = nombre ? nombre.toLowerCase() : undefined //normalizamos el nombre

        const itemInventarioActualizado =
            await itemInventarioService.updateItemInventario(
                id,
                nombre,
                descripcion,
                stock,
                costo,
                cantxCasillero,
                porUnidad,
                categoriaId
            )

        if (itemInventarioActualizado[0] === 0) {
            // Si la cantidad de registros actualizados es 0
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'ItemInventario no encontrado'
            )
        }

        res.status(HttpCode.OK).json({ message: 'ItemInventario actualizado' })
    }),

    deleteItemInventario: asyncHandler(async (req, res) => {
        const id = req.params.id

        const resultado = await itemInventarioService.deleteItemInventario(id)

        if (resultado === 0) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'ItemInventario no encontrado'
            )
        }

        res.status(HttpCode.OK).json({ message: 'ItemInventario eliminado' })
    }),

    updateStock: asyncHandler(async (req, res) => {
        const id = req.params.id
        const { amount } = req.body
        const updatedItem = await itemInventarioService.updateStock(id, amount)
        if (!updatedItem) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'ItemInventario no encontrado'
            )
        }
        res.status(HttpCode.OK).json(updatedItem)
    }),
}

module.exports = itemInventarioController
