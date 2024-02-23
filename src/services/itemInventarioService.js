const { HttpError, HttpCode } = require('../error-handling/http_error')
const itemInventarioRepository = require('../repositories/itemInventarioRepository')
const categoriaRepository = require('../repositories/categoriaRepository') // Suponiendo que tengas un repositorio para categorías

// Función auxiliar para chequear la unicidad del nombre del item
const checkNombreUnique = async (nombre, excludeId = null) => {
    const existingItem = await itemInventarioRepository.findByNombre(nombre)
    if (existingItem && (!excludeId || existingItem.id !== excludeId)) {
        throw new HttpError(
            HttpCode.CONFLICT,
            'Ya existe un item con ese nombre'
        )
    }
}

// Función auxiliar para chequear la existencia de la categoría
const checkCategoriaExists = async (categoriaId) => {
    const existingCategoria =
        await categoriaRepository.getCategoriaById(categoriaId)
    if (!existingCategoria) {
        throw new HttpError(HttpCode.NOT_FOUND, 'Categoría no encontrada')
    }
}

const itemInventarioService = {
    crearItemInventario: async (
        nombre,
        descripcion,
        stock,
        costo,
        cantxCasillero,
        porUnidad,
        categoriaId
    ) => {
        await checkNombreUnique(nombre)
        await checkCategoriaExists(categoriaId)
        return await itemInventarioRepository.create(
            nombre,
            descripcion,
            stock,
            costo,
            cantxCasillero,
            porUnidad,
            categoriaId
        )
    },
    getItemsInventario: async function (options = {}) {
        return await itemInventarioRepository.findAll(options)
    },

    getItemInventarioById: async (id) => {
        return await itemInventarioRepository.getItemInventarioById(id)
    },

    updateItemInventario: async (
        id,
        nombre,
        descripcion,
        stock,
        costo,
        cantxCasillero,
        porUnidad,
        categoriaId
    ) => {
        if (nombre) {
            await checkNombreUnique(nombre, id) // El id se pasa para excluirlo y permitir la actualización de otros campos sin cambiar el nombre
        }
        if (categoriaId) {
            await checkCategoriaExists(categoriaId)
        }
        return await itemInventarioRepository.update(
            id,
            nombre,
            descripcion,
            stock,
            costo,
            cantxCasillero,
            porUnidad,
            categoriaId
        )
    },
    deleteItemInventario: async (id) => {
        return await itemInventarioRepository.deleteItemInventario(id)
    },

    updateStock: async (id, amount) => {
        // Obtener el stock actual del itemInventario
        const currentItem =
            await itemInventarioRepository.getItemInventarioById(id)

        // Si no existe el item, lanzar un error
        if (!currentItem) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'ItemInventario no encontrado'
            )
        }

        // Calcula el nuevo stock
        const newStock = currentItem.stock + amount

        // Valida que el nuevo stock no sea menor que cero
        if (newStock < 0) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'No se puede actualizar el stock a un valor negativo'
            )
        }

        // Actualizar el stock
        const updatedItem = await itemInventarioRepository.updateStock(
            id,
            newStock
        )
        return updatedItem
    },
}

module.exports = itemInventarioService
