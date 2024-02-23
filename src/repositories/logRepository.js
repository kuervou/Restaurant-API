const { Log } = require('../models')
const db = require('../models')

const logRepository = {
    createLog: async (data, transaction) => {
        return await Log.create(data, { transaction })
    },

    findOpenLogByItemInventarioId: async (itemInventarioId) => {
        return await Log.findOne({
            where: {
                itemInventarioId,
                fechaHoraCerrada: null,
            },
        })
    },

    closeLog: async (logId, fechaHoraCerrada, transaction) => {
        return await Log.update(
            { fechaHoraCerrada: fechaHoraCerrada },
            {
                where: {
                    id: logId,
                },
                transaction,
            }
        )
    },

    getLogs: async (itemInventarioId, page = 1, limit = 10) => {
        const offset = (page - 1) * limit

        return await Log.findAndCountAll({
            where: {
                itemInventarioId: itemInventarioId,
                fechaHoraAbierta: { [db.Sequelize.Op.ne]: null }, // Op.ne es "not equal"
                fechaHoraCerrada: { [db.Sequelize.Op.ne]: null },
            },
            offset,
            limit,
            order: [['fechaHoraAbierta', 'DESC']],
        })
    },
}

module.exports = logRepository
