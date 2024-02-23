const logService = require('../../src/services/logService')
const logRepository = require('../../src/repositories/logRepository')
const itemInventarioRepository = require('../../src/repositories/itemInventarioRepository')
const empleadoLogRepository = require('../../src/repositories/empleadoLogRepository')
const db = require('../../src/models')

jest.mock('../../src/repositories/logRepository')
jest.mock('../../src/repositories/itemInventarioRepository')
jest.mock('../../src/repositories/empleadoLogRepository')
jest.mock('../../src/repositories/ordenRepository')
jest.mock('../../src/models')

describe('logService', () => {
    beforeEach(() => {
        db.ItemInventario.findOne.mockReset()
        db.Empleado.findOne.mockReset()
        logRepository.findOpenLogByItemInventarioId.mockReset()
        itemInventarioRepository.descontarStock.mockReset()
        logRepository.createLog.mockReset()
        empleadoLogRepository.createEmpleadoLog.mockReset()
        db.sequelize.transaction = jest.fn(() => ({
            commit: jest.fn().mockResolvedValue(null),
            rollback: jest.fn().mockResolvedValue(null),
        }))
    })

    // Pruebas para abrirBotella
    describe('abrirBotella', () => {
        const mockItemInventarioId = 1
        const mockEmpleadoId = 1
        const mockItemInventario = { id: 1, porUnidad: false, stock: 10 }
        const mockEmpleado = { id: 1 }
        const mockLog = { id: 1, fechaHoraAbierta: new Date() }

        it('should successfully open a bottle', async () => {
            db.ItemInventario.findOne.mockResolvedValue(mockItemInventario)
            db.Empleado.findOne.mockResolvedValue(mockEmpleado)
            logRepository.findOpenLogByItemInventarioId.mockResolvedValue(null)
            logRepository.createLog.mockResolvedValue(mockLog)

            const result = await logService.abrirBotella(
                mockItemInventarioId,
                mockEmpleadoId
            )
            expect(result).toEqual(mockLog)
        })

        // Aquí puedes agregar más pruebas para casos de error
    })
})
