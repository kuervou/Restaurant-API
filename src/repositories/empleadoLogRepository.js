const { EmpleadoLog } = require('../models')

const empleadoLogRepository = {
    createEmpleadoLog: async (data, transaction) => {
        return await EmpleadoLog.create(data, { transaction })
    },
}

module.exports = empleadoLogRepository
