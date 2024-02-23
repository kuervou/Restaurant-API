const { Caja } = require('../models')

const cajaRepository = {
    create: async (total) => {
        const nuevaCaja = await Caja.create({
            total,
        })
        return nuevaCaja
    },
    findAll: async () => {
        return await Caja.findAll()
    },

    update: async (id, total) => {
        return await Caja.update({ total }, { where: { id: id } })
    },

    getCajaById: async (id) => {
        return await Caja.findByPk(id)
    },

    deleteCaja: async (id) => {
        return await Caja.destroy({
            where: { id: id },
        })
    },

    updateTotal: async (id, total, transaction) => {
        return await Caja.update({ total }, { where: { id }, transaction })
    },
}

module.exports = cajaRepository
