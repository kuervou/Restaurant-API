const grupoService = require('../services/grupoService')
const asyncHandler = require('express-async-handler')
const { HttpError, HttpCode } = require('../error-handling/http_error')

const grupoController = {
    crearGrupo: asyncHandler(async (req, res) => {
        const { nombre, esBebida } = req.body
        const nombreNormalizado = nombre.toLowerCase() //normalizamos el nombre
        await grupoService.crearGrupo(nombreNormalizado, esBebida)
        res.status(HttpCode.CREATED).json({ message: 'Grupo creado' })
    }),

    getGrupos: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const filterName = req.query.nombre || ''
        const filterEsBebida = req.query.esBebida || undefined

        const grupos = await grupoService.getGrupos({
            page,
            limit,
            nombre: filterName,
            esBebida: filterEsBebida,
        })
        res.json(grupos)
    }),

    getGrupoById: asyncHandler(async (req, res) => {
        const id = req.params.id

        const grupo = await grupoService.getGrupoById(id)

        if (!grupo) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Grupo no encontrado')
        }

        res.status(HttpCode.OK).json(grupo)
    }),

    updateGrupo: asyncHandler(async (req, res) => {
        const id = req.params.id
        let { nombre, esBebida } = req.body

        nombre = nombre ? nombre.toLowerCase() : undefined //normalizamos el nombre
        const grupoActualizado = await grupoService.updateGrupo(
            id,
            nombre,
            esBebida
        )

        if (grupoActualizado[0] === 0) {
            // Si la cantidad de registros actualizados es 0
            throw new HttpError(HttpCode.NOT_FOUND, 'Grupo no encontrado')
        }

        res.status(HttpCode.OK).json({ message: 'Grupo actualizado' })
    }),

    deleteGrupo: asyncHandler(async (req, res) => {
        const id = req.params.id

        const resultado = await grupoService.deleteGrupo(id)

        if (resultado === 0) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Grupo no encontrado')
        }

        res.status(HttpCode.OK).json({ message: 'Grupo eliminado' })
    }),
}

module.exports = grupoController
