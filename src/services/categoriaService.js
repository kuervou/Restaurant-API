const categoriaRepository = require('../repositories/categoriaRepository')
const { HttpError, HttpCode } = require('../error-handling/http_error')

//Función auxiliar para chequear unicidad del nombre
const checkNombreUnique = async (nombre, excludeId = null) => {
    const formattedNombre = nombre.toLowerCase()
    const existingCategoria =
        await categoriaRepository.findByNombre(formattedNombre)
    if (
        existingCategoria &&
        (!excludeId || existingCategoria.id !== excludeId)
    ) {
        throw new HttpError(
            HttpCode.CONFLICT,
            'Ya existe una categoría con ese nombre'
        )
    }
}

const categoriaService = {
    crearCategoria: async (nombre) => {
        await checkNombreUnique(nombre)
        return await categoriaRepository.create(nombre)
    },
    getCategorias: async function (options = {}) {
        return await categoriaRepository.findAll(options)
    },

    getCategoriaById: async (id) => {
        return await categoriaRepository.getCategoriaById(id)
    },

    updateCategoria: async (id, nombre) => {
        if (nombre) {
            await checkNombreUnique(nombre, id)
        }
        return await categoriaRepository.update(id, nombre)
    },

    deleteCategoria: async (id) => {
        return await categoriaRepository.deleteCategoria(id)
    },
}

module.exports = categoriaService
