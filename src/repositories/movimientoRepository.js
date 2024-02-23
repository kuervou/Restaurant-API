const { Movimiento } = require('../models')
const { Op } = require('sequelize')

const movimientoRepository = {
    create: async (movimientoData, transaction) => {
        return await Movimiento.create(movimientoData, { transaction })
    },

    findAll: async (options = {}) => {
        const { page = 1, limit = 10, fecha } = options
        const offset = (page - 1) * limit

        const whereConditions = {}
        if (fecha) {
            whereConditions.fecha = {
                [Op.like]: `%${fecha}%`,
            }
        }

        if (page === -1 || limit === -1) {
            const result = await Movimiento.findAndCountAll({
                where: whereConditions,
                order: [
                    ['fecha', 'ASC'],
                    ['hora', 'ASC'],
                ],
            })

            return {
                total: result.count,
                items: result.rows,
            }
        }

        const result = await Movimiento.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            order: [
                ['fecha', 'ASC'],
                ['hora', 'ASC'],
            ],
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },

    update: async (id, movimientoData) => {
        return await Movimiento.update(movimientoData, { where: { id } })
    },

    findById: async (id) => {
        return await Movimiento.findByPk(id)
    },

    getMovimientosByCajaId: async (id, options) => {
        const { page = 1, limit = 10 } = options
        const offset = (page - 1) * limit

        if (page === -1 || limit === -1) {
            const result = await Movimiento.findAndCountAll({
                where: { cajaId: id },
                order: [
                    ['fecha', 'ASC'],
                    ['hora', 'ASC'],
                ],
            })

            return {
                total: result.count,
                items: result.rows,
            }
        }
        const result = await Movimiento.findAndCountAll({
            where: { cajaId: id },
            offset,
            limit,
            order: [
                ['fecha', 'ASC'],
                ['hora', 'ASC'],
            ],
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },

    deleteMovimiento: async (id, transaction) => {
        const movimiento = await Movimiento.findByPk(id, { transaction })
        await movimiento.destroy({ transaction })
    },
}

module.exports = movimientoRepository
