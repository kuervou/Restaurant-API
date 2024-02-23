const request = require('supertest')
const { app } = require('../../src/app')
const logService = require('../../src/services/logService')
jest.mock('../../src/services/logService')
const { generateTokenForTesting } = require('../utils')

describe('logController', () => {
    let authToken

    beforeEach(() => {
        authToken = `Bearer ${generateTokenForTesting()}`
    })

    describe('POST /api/log/abrirBotella', () => {
        it('should open a bottle', async () => {
            const logData = {
                itemInventarioId: 1,
                empleadoId: 1,
            }
            const mockLog = {
                /* Respuesta simulada del log */ id: 1,
                itemInventarioId: 1,
                empleadoId: 1,
                fechaHora: '2021-09-01 12:00:00',
                tipo: 'apertura',
            }

            logService.abrirBotella.mockResolvedValue(mockLog)

            const res = await request(app)
                .post('/api/log/abrirBotella')
                .set('Authorization', authToken)
                .send(logData)

            expect(res.statusCode).toEqual(201)
            expect(res.body).toEqual(mockLog)
            expect(logService.abrirBotella).toHaveBeenCalledWith(
                logData.itemInventarioId,
                logData.empleadoId
            )
        })

        // ... Agrega más pruebas para casos de error ...
    })

    describe('POST /api/log/cerrarBotella', () => {
        it('should close a bottle', async () => {
            const logData = {
                itemInventarioId: 1,
                empleadoId: 1,
            }

            logService.cerrarBotella.mockResolvedValue([1]) // Suponiendo que devuelve la cantidad de registros actualizados

            const res = await request(app)
                .post('/api/log/cerrarBotella')
                .set('Authorization', authToken)
                .send(logData)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty(
                'message',
                'La botella se cerró correctamente.'
            )
        })

        //cerrar botella cuando no hay una botella abierta
        it('should not close a bottle', async () => {
            const logData = {
                itemInventarioId: 1,
                empleadoId: 1,
            }

            logService.cerrarBotella.mockResolvedValue([0]) // Suponiendo que devuelve la cantidad de registros actualizados

            const res = await request(app)
                .post('/api/log/cerrarBotella')
                .set('Authorization', authToken)
                .send(logData)

            expect(res.statusCode).toEqual(400)
            expect(res.body).toHaveProperty(
                'message',
                'No se pudo cerrar la botella, probablemente no exista un registro de botella abierta para el item de inventario especificado.'
            )
        })
        // ... Pruebas para casos donde la botella no se puede cerrar ...
    })

    describe('GET /api/logs/:itemInventarioId', () => {
        it('should retrieve logs for an itemInventario', async () => {
            const itemInventarioId = '1'
            const mockLogs = [
                /* Array de logs simulados */
            ]

            logService.getLogs.mockResolvedValue(mockLogs)

            const res = await request(app)
                .get(`/api/logs/${itemInventarioId}?page=1&limit=10`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(mockLogs)
            expect(logService.getLogs).toHaveBeenCalledWith(
                itemInventarioId,
                1,
                10
            )
        })

        // ... Agrega más pruebas para verificar la paginación y casos de error ...
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})
