const sequelize = require('sequelize')
const { Op } = require('sequelize')
const { Item, ItemMenu, Orden } = require('../models')

const itemRepository = {
    createItem: async (data, transaction) => {
        return await Item.create(data, { transaction })
    },

    findAll: async (options) => {
        return await Item.findAll({
            where: {
                ordenId: options.ordenId,
            },
        })
    },

    deleteItems: async (items, transaction) => {
        return await Item.destroy({
            where: {
                id: items,
            },
            transaction,
        })
    },

    updateOrderTotal: async (ordenId) => {
        const order = await Orden.findByPk(ordenId, {
            include: [{ model: Item, as: 'items' }],
        })
        const newTotal = order.items.reduce(
            (sum, item) => sum + item.precio * item.cantidad,
            0
        )
        await order.update({ total: newTotal })
    },

    findItems: async (items) => {
        return await Item.findAll({
            where: {
                id: items,
            },
        })
    },

    getTop5ItemsMenuPorDia: async (dia) => {
        return await Item.findAll({
            attributes: [
                'itemMenuId',
                [
                    sequelize.fn('SUM', sequelize.col('cantidad')),
                    'cantidadVendida',
                ],
                [sequelize.col('itemMenu.nombre'), 'nombre'],
            ],
            include: [
                {
                    model: ItemMenu,
                    as: 'itemMenu',
                    attributes: [],
                },
                {
                    model: Orden,
                    as: 'orden',
                    attributes: [],
                    where: {
                        fecha: dia,
                        paga: true,
                    },
                },
            ],
            group: ['itemMenuId', 'itemMenu.id'],
            order: [[sequelize.fn('SUM', sequelize.col('cantidad')), 'DESC']],
            limit: 5,
            includeIgnoreAttributes: false,
            subQuery: false,
            raw: true,
            nest: true,
        })
    },

    getTop5ItemsMenu: async (fechaInicio, fechaFin) => {
        return await Item.findAll({
            attributes: [
                'itemMenuId',
                [
                    sequelize.fn('SUM', sequelize.col('cantidad')),
                    'cantidadVendida',
                ],
                [sequelize.col('itemMenu.nombre'), 'nombre'],
            ],
            include: [
                {
                    model: ItemMenu,
                    as: 'itemMenu',
                    attributes: [],
                },
                {
                    model: Orden,
                    as: 'orden',
                    attributes: [],
                    where: {
                        fecha: {
                            [Op.between]: [fechaInicio, fechaFin],
                        },
                        paga: true,
                    },
                },
            ],
            group: ['itemMenuId', 'itemMenu.id'],
            order: [[sequelize.fn('SUM', sequelize.col('cantidad')), 'DESC']],
            limit: 5,
            includeIgnoreAttributes: false,
            subQuery: false,
            raw: true,
            nest: true,
        })
    },
}

module.exports = itemRepository
