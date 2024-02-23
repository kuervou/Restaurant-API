const categoriaService = require('../services/categoriaService')
const asyncHandler = require('express-async-handler')
const { HttpError, HttpCode } = require('../error-handling/http_error')

const categoriaController = {
    crearCategoria: asyncHandler(async (req, res) => {
        const { nombre } = req.body
        const nombreNormalizado = nombre.toLowerCase() //normalizamos el nombre
        await categoriaService.crearCategoria(nombreNormalizado)
        res.status(HttpCode.CREATED).json({ message: 'Categoria creada' })
    }),

    getCategorias: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const filterName = req.query.nombre || ''

        const categorias = await categoriaService.getCategorias({
            page,
            limit,
            nombre: filterName,
        })
        res.json(categorias)
    }),

    getCategoriaById: asyncHandler(async (req, res) => {
        const id = req.params.id

        const categoria = await categoriaService.getCategoriaById(id)

        if (!categoria) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Categoria no encontrada')
        }

        res.status(HttpCode.OK).json(categoria)
    }),

    updateCategoria: asyncHandler(async (req, res) => {
        const id = req.params.id
        let { nombre } = req.body
        nombre = nombre.toLowerCase() //normalizamos el nombre
        const categoriaActualizada = await categoriaService.updateCategoria(
            id,
            nombre
        )

        if (categoriaActualizada[0] === 0) {
            // Si la cantidad de registros actualizados es 0
            throw new HttpError(HttpCode.NOT_FOUND, 'Categoria no encontrada')
        }

        res.status(HttpCode.OK).json({ message: 'Categoria actualizada' })
    }),

    deleteCategoria: asyncHandler(async (req, res) => {
        const id = req.params.id

        const resultado = await categoriaService.deleteCategoria(id)

        if (resultado === 0) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Categoria no encontrada')
        }

        res.status(HttpCode.OK).json({ message: 'Categoria eliminada' })
    }),
}

module.exports = categoriaController
