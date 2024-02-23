// src/repositories/compraRepository.js

const { Compra } = require('../models')
//const { Op } = require('sequelize')

const compraRepository = {
    create: async (data, transaction) => {
        return await Compra.create(data, { transaction })
    },
    findAll: async (options = {}) => {
        const { page = 1, limit = 10, fecha } = options
        const offset = (page - 1) * limit
        const whereConditions = {}

        if (fecha) {
            whereConditions.fecha = fecha
        }

        if (page === -1 || limit === -1) {
            const result = await Compra.findAndCountAll({
                where: whereConditions,
                include: ['empleado', 'itemInventario'],
            })

            return {
                total: result.count,
                items: result.rows,
            }
        }

        const result = await Compra.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            include: ['empleado', 'itemInventario'],
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },

    getCompraById: async (id) => {
        return await Compra.findByPk(id, {
            include: ['empleado', 'itemInventario'],
        })
    },

    deleteCompra: async (id, transaction) => {
        return await Compra.destroy({ where: { id } }, { transaction })
    },
}

module.exports = compraRepository
