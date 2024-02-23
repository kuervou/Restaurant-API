const { ItemInventario, Categoria, ItemMenu } = require('../models')
const sequelize = require('sequelize')
const { Op } = require('sequelize')

const itemInventarioRepository = {
    create: async (
        nombre,
        descripcion,
        stock,
        costo,
        cantxCasillero,
        porUnidad,
        categoriaId
    ) => {
        const nuevoItemInventario = await ItemInventario.create({
            nombre,
            descripcion,
            stock,
            costo,
            cantxCasillero,
            porUnidad,
            categoriaId,
        })
        return nuevoItemInventario
    },

    findAll: async (options = {}) => {
        const { page = 1, limit = 10, nombre, categoriaId, porUnidad } = options
        const offset = (page - 1) * limit

        const whereConditions = {}
        if (nombre) {
            whereConditions.nombre = {
                [Op.like]: `%${nombre}%`,
            }
        }
        if (categoriaId) {
            whereConditions.categoriaId = categoriaId
        }
        if (porUnidad !== undefined) {
            whereConditions.porUnidad = porUnidad === 'true'
        }

        const result = await ItemInventario.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            include: [
                {
                    model: Categoria,
                    as: 'categoria',
                },
            ],
            attributes: {
                exclude: ['categoriaId', 'porUnidad'],
                include: [[sequelize.col('porUnidad'), 'ventaPorUnidad']],
            },
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },

    update: async (
        id,
        nombre,
        descripcion,
        stock,
        costo,
        cantxCasillero,
        porUnidad,
        categoriaId
    ) => {
        return await ItemInventario.update(
            {
                nombre,
                descripcion,
                stock,
                costo,
                cantxCasillero,
                porUnidad,
                categoriaId,
            },
            { where: { id: id } }
        )
    },

    getItemInventarioById: async (id) => {
        return await ItemInventario.findByPk(id, {
            include: [
                {
                    //para mostrar la categoria de forma más limpia
                    model: Categoria,
                    as: 'categoria',
                },
            ],
            attributes: {
                exclude: ['categoriaId', 'porUnidad'],
                include: [[sequelize.col('porUnidad'), 'ventaPorUnidad']], //para darle un nombre más descriptivo al atributo
            },
        })
    },

    updatePorUnidad: async (id, porUnidadValue, transaction) => {
        return await ItemInventario.update(
            { porUnidad: porUnidadValue },
            { where: { id: id }, transaction }
        )
    },

    deleteItemInventario: async (id) => {
        return await ItemInventario.destroy({
            where: { id: id },
        })
    },
    findByNombre: async (nombre) => {
        return await ItemInventario.findOne({
            where: { nombre: nombre.toLowerCase() },
        })
    },
    updateStock: async (id, newStock) => {
        const item = await ItemInventario.findByPk(id)
        if (!item) {
            return null
        }

        item.stock = newStock
        await item.save()
        return item
    },
    descontarStock: async (itemInventario, cantidad, transaction) => {
        await itemInventario.update(
            { stock: itemInventario.stock - cantidad },
            { transaction }
        )
    },
    sumarStock: async (itemInventario, cantidad, transaction) => {
        await itemInventario.update(
            { stock: itemInventario.stock + cantidad },
            { transaction }
        )
    },

    getStock: async (itemInventario) => {
        return itemInventario.stock
    },
    getItemsMenuByItemInventarioId: async (itemInventarioId, transaction) => {
        return await ItemInventario.findByPk(itemInventarioId, {
            include: [
                {
                    model: ItemMenu,
                    as: 'itemMenus',
                    through: {
                        attributes: [],
                    },
                    attributes: {
                        exclude: ['imagen', 'activo', 'grupoId'],
                    },
                },
            ],
            attributes: {
                exclude: ['categoriaId', 'porUnidad'],
            },
            transaction,
        })
    },
}

module.exports = itemInventarioRepository
