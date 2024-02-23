// src/services/itemMenuService.js
const itemMenuRepository = require('../repositories/itemMenuRepository')
const { HttpError, HttpCode } = require('../error-handling/http_error')
const grupoRepository = require('../repositories/grupoRepository')

const db = require('../models')
const sequelize = db.sequelize

// Función auxiliar para chequear unicidad del nombre
const checkNombreUnique = async (nombre, excludeId = null) => {
    const existingItemMenu = await itemMenuRepository.findByNombre(nombre)
    if (existingItemMenu && (!excludeId || existingItemMenu.id !== excludeId)) {
        throw new HttpError(
            HttpCode.CONFLICT,
            'Ya existe un ItemMenu con ese nombre'
        )
    }
}
const itemInventarioRepository = require('../repositories/itemInventarioRepository')

//funcion auxiliar para chequear la existencia del grupo
const checkGrupoExists = async (grupoId) => {
    const existingGrupo = await grupoRepository.getGrupoById(grupoId)
    if (!existingGrupo) {
        throw new HttpError(HttpCode.NOT_FOUND, 'Grupo no encontrado')
    }
}
const itemMenuService = {
    crearItemMenu: async (data) => {
        const t = await sequelize.transaction()
        try {
            await checkNombreUnique(data.nombre)
            await checkGrupoExists(data.grupoId)
            //crear el nuevo itemMenu
            const newItemMenu = await itemMenuRepository.create(data, t)

            if (data.itemsInventario) {
                for (let itemInventarioData of data.itemsInventario) {
                    // Asociar ItemMenu con ItemInventario aquí
                    const itemInventario =
                        await itemInventarioRepository.getItemInventarioById(
                            itemInventarioData.id
                        )
                    if (itemInventario) {
                        await itemMenuRepository.addItemInventario(
                            newItemMenu,
                            itemInventarioData.id,
                            t
                        )
                    } else {
                        throw new HttpError(
                            HttpCode.NOT_FOUND,
                            `ItemInventario con id ${itemInventarioData.id} no encontrado`
                        )
                    }

                    // Actualizar el campo porUnidad del ItemInventario

                    await itemInventarioRepository.updatePorUnidad(
                        itemInventarioData.id,
                        data.porUnidad,
                        t
                    )
                }
            }
            await t.commit()
            return newItemMenu
        } catch (error) {
            await t.rollback()
            throw new HttpError(HttpCode.INTERNAL_SERVER, error.message)
        }
    },
    getItemsMenu: async (options = {}) => {
        return await itemMenuRepository.findAll(options)
    },
    getItemsMenuActivos: async (options = {}) => {
        return await itemMenuRepository.findAllActivos(options)
    },
    getItemsMenuActivosBasic: async (options = {}) => {
        return await itemMenuRepository.findAllActivosBasic(options)
    },
    getItemMenuById: async (id) => {
        return await itemMenuRepository.getItemMenuById(id)
    },
    getItemMenuInventarioById: async (id) => {
        return await itemMenuRepository.getItemMenuInventarioById(id)
    },
    updateItemMenu: async (id, data) => {
        if (data.nombre) {
            await checkNombreUnique(data.nombre, id)
        }
        if (data.grupoId) {
            await checkGrupoExists(data.grupoId)
        }
        return await itemMenuRepository.update(id, data)
    },
    deleteItemMenu: async (id) => {
        return await itemMenuRepository.deleteItemMenu(id)
    },

    activateItemMenu: async (id) => {
        return await itemMenuRepository.activateItemMenu(id)
    },

    //removeItemsInventario función que dado un itemMenu y un array de itemInventarioId desvincula los itemInventarioId con itemMenu en la tabla intermedia
    removeItemsInventario: async (id, data) => {
        let transaction
        const ItemMenu = await itemMenuRepository.getItemMenuById(id)
        if (!ItemMenu) {
            return null
        }

        try {
            // Iniciar transacción
            transaction = await sequelize.transaction()
            if (data.itemsInventario) {
                for (let itemInventarioData of data.itemsInventario) {
                    // Desasociar ItemMenu con ItemInventario aquí
                    const itemInventario =
                        await itemInventarioRepository.getItemInventarioById(
                            itemInventarioData.id
                        )
                    if (itemInventario) {
                        await itemMenuRepository.removeItemInventario(
                            id,
                            itemInventarioData.id,
                            transaction
                        )
                    } else {
                        throw new HttpError(
                            HttpCode.NOT_FOUND,
                            `ItemInventario con id ${itemInventarioData.id} no encontrado`
                        )
                    }
                    // Actualizar el campo porUnidad del ItemInventario
                    await itemInventarioRepository.updatePorUnidad(
                        itemInventarioData.id,
                        data.porUnidad,
                        transaction
                    )
                }
            } else {
                // Si no se envía el array de itemsInventario se advierte al usuario
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    `Debe enviar un array de itemsInventario`
                )
            }

            // Si todo está bien, confirmar la transacción
            await transaction.commit()
            return await itemMenuRepository.getItemMenuById(id)
        } catch (error) {
            // Si hay algún error, revertir la transacción
            if (transaction) await transaction.rollback()
            throw error
        }
    },

    //addItemsInventario función que dado un itemMenu y un array de itemInventarioId vincula los itemInventarioId con itemMenu en la tabla intermedia
    addItemsInventario: async (id, data) => {
        let transaction
        try {
            const ItemMenu = await itemMenuRepository.getItemMenuById(id)
            if (!ItemMenu) {
                return null
            }
            // Iniciar transacción
            transaction = await sequelize.transaction()
            if (data.itemsInventario) {
                for (let itemInventarioData of data.itemsInventario) {
                    // Asociar ItemMenu con ItemInventario aquí
                    const itemInventario =
                        await itemInventarioRepository.getItemInventarioById(
                            itemInventarioData.id
                        )
                    if (itemInventario) {
                        await itemMenuRepository.addItemInventario(
                            ItemMenu,
                            itemInventarioData.id,
                            transaction
                        )
                    } else {
                        throw new HttpError(
                            HttpCode.NOT_FOUND,
                            `ItemInventario con id ${itemInventarioData.id} no encontrado`
                        )
                    }
                    // Actualizar el campo porUnidad del ItemInventario
                    await itemInventarioRepository.updatePorUnidad(
                        itemInventarioData.id,
                        data.porUnidad,
                        transaction
                    )
                }
            } else {
                //si no se envia el array de itemsInventario se advierte al usuario
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    `Debe enviar un array de itemsInventario`
                )
            }

            // Si todo está bien, confirmar la transacción
            await transaction.commit()
            return await itemMenuRepository.getItemMenuById(id)
        } catch (error) {
            // Si hay algún error, revertir la transacción
            await transaction.rollback()
            throw error
        }
    },
}

module.exports = itemMenuService
