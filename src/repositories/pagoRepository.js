// src/repositories/pagoRepository.js

const { Pago } = require('../models')
const { Op } = require('sequelize')

const pagoRepository = {
    create: async (pagoData, transaction) => {
        return await Pago.create(pagoData, { transaction })
    },

    findAll: async (options = {}) => {
        const { page = 1, limit = 10, fecha, ordenId } = options
        const offset = (page - 1) * limit

        const whereConditions = {}

        if (fecha) {
            whereConditions.fecha = {
                [Op.like]: `%${fecha}%`,
            }
        }

        if (ordenId) {
            whereConditions.ordenId = ordenId // Agregar la condición para ordenId
        }

        if (page === -1 || limit === -1) {
            const result = await Pago.findAndCountAll({
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

        const result = await Pago.findAndCountAll({
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

    findById: async (id) => {
        return await Pago.findByPk(id)
    },

    getPagosByCajaId: async (id, options) => {
        const { page = 1, limit = 10 } = options
        const offset = (page - 1) * limit

        if (page === -1 || limit === -1) {
            const result = await Pago.findAndCountAll({
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

        const result = await Pago.findAndCountAll({
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

    deletePago: async (id, transaction) => {
        const pago = await Pago.findByPk(id, { transaction })
        await pago.destroy({ transaction })
    },
}

module.exports = pagoRepository
