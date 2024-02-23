// src/repositories/itemMenuRepository.js
const { ItemMenu } = require('../models')
const { ItemInventario } = require('../models')
const { Grupo } = require('../models')
const { Op } = require('sequelize')
const { HttpError, HttpCode } = require('../error-handling/http_error')

const itemMenuRepository = {
    create: async (data, transaction) => {
        const newItemMenu = await ItemMenu.create(data, { transaction })
        return newItemMenu
    },
    addItemInventario: async (itemMenu, itemInventarioId, transaction) => {
        const itemInventario = await ItemInventario.findByPk(itemInventarioId)

        if (itemMenu && itemInventario) {
            await itemMenu.addItemInventario(itemInventario, { transaction })
        } else {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                `ItemInventario con id ${itemInventarioId} no encontrado`
            )
        }
    },
    removeItemInventario: async (itemMenuId, itemInventarioId, transaction) => {
        const itemMenu = await ItemMenu.findByPk(itemMenuId)
        const itemInventario = await ItemInventario.findByPk(itemInventarioId)

        if (itemMenu && itemInventario) {
            await itemMenu.removeItemInventario(itemInventario, {
                transaction,
            })
        } else {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                `ItemInventario con id ${itemInventarioId} no encontrado`
            )
        }
    },

    findItemInventarios: async (itemMenu) => {
        return await itemMenu.getItemInventarios()
    },

    findAll: async (options = {}) => {
        const { page = 1, limit = 10, nombre, grupoId } = options
        const offset = (page - 1) * limit

        const whereConditions = {}
        if (nombre) {
            whereConditions.Nombre = {
                [Op.like]: `%${nombre}%`,
            }
        }
        if (grupoId) {
            if (Array.isArray(grupoId)) {
                whereConditions.GrupoId = {
                    [Op.in]: grupoId,
                }
            } else {
                whereConditions.GrupoId = grupoId
            }
        }

        const result = await ItemMenu.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            order: [['Nombre', 'ASC']],
            include: [
                {
                    model: Grupo, // Asegúrate de importar este modelo al principio del archivo
                    as: 'grupo',
                },
                {
                    model: ItemInventario, // Asegúrate de importar este modelo al principio del archivo
                    as: 'ItemInventarios', // Por convención, Sequelize usa el nombre plural del modelo
                    through: {
                        attributes: [], // Si quieres excluir todos los campos de la tabla intermedia. Si deseas incluir algunos, coloca sus nombres aquí.
                    },
                },
            ],
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },
    //findAllActivos
    findAllActivos: async (options = {}) => {
        const { page = 1, limit = 10, nombre, grupoId } = options
        const offset = (page - 1) * limit

        const whereConditions = {}
        whereConditions.Activo = true
        if (nombre) {
            whereConditions.Nombre = {
                [Op.like]: `%${nombre}%`,
            }
        }
        if (grupoId) {
            if (Array.isArray(grupoId)) {
                whereConditions.GrupoId = {
                    [Op.in]: grupoId,
                }
            } else {
                whereConditions.GrupoId = grupoId
            }
        }

        const result = await ItemMenu.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            order: [['Nombre', 'ASC']],
            include: ['grupo'], // incluyendo asociaciones
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },
    //findAllActivosBasic
    findAllActivosBasic: async (options = {}) => {
        const { page = 1, limit = 10, nombre, grupoId } = options
        const offset = (page - 1) * limit

        const whereConditions = {}
        whereConditions.Activo = true
        if (nombre) {
            whereConditions.Nombre = {
                [Op.like]: `%${nombre}%`,
            }
        }
        if (grupoId) {
            if (Array.isArray(grupoId)) {
                whereConditions.GrupoId = {
                    [Op.in]: grupoId,
                }
            } else {
                whereConditions.GrupoId = grupoId
            }
        }

        //si page o limit son -1, no se aplica paginación
        if (page === -1 || limit === -1) {
            const result = await ItemMenu.findAndCountAll({
                where: whereConditions,
                order: [['Nombre', 'ASC']],
                include: ['grupo'], // incluyendo asociaciones
                //exlcuir campos imagen, activo, grupoId
                attributes: { exclude: ['imagen', 'activo', 'grupoId'] },
            })

            return {
                total: result.count,
                items: result.rows,
            }
        }

        const result = await ItemMenu.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            order: [['Nombre', 'ASC']],
            include: ['grupo'], // incluyendo asociaciones
            //exlcuir campos imagen, activo, grupoId
            attributes: { exclude: ['imagen', 'activo', 'grupoId'] },
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },

    update: async (id, data) => {
        return await ItemMenu.update(data, { where: { id: id } })
    },
    getItemMenuById: async (id) => {
        return await ItemMenu.findByPk(id, {
            include: ['grupo'], // incluyendo asociaciones
            //exlcuir campos imagen, activo, grupoId
            attributes: { exclude: ['imagen', 'activo', 'grupoId'] },
        })
    },
    getItemMenuInventarioById: async (id) => {
        return await ItemMenu.findByPk(id, {
            include: [
                {
                    model: Grupo, // Asegúrate de importar este modelo al principio del archivo
                    as: 'grupo',
                },
                {
                    model: ItemInventario, // Asegúrate de importar este modelo al principio del archivo
                    as: 'ItemInventarios', // Por convención, Sequelize usa el nombre plural del modelo
                    through: {
                        attributes: [], // Si quieres excluir todos los campos de la tabla intermedia. Si deseas incluir algunos, coloca sus nombres aquí.
                    },
                },
            ],
            //exlcuir campos imagen, activo, grupoId
            attributes: { exclude: ['imagen', 'activo', 'grupoId'] },
        })
    },
    deleteItemMenu: async (id) => {
        //borrado logico
        return await ItemMenu.update({ activo: false }, { where: { id: id } })
    },

    activateItemMenu: async (id) => {
        return await ItemMenu.update({ activo: true }, { where: { id: id } })
    },
    findByNombre: async (nombre) => {
        return await ItemMenu.findOne({
            where: { nombre: nombre.toLowerCase() },
        })
    },
}

module.exports = itemMenuRepository
