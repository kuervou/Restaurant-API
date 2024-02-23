const request = require('supertest')
const { app } = require('../../src/app') // Asegúrate de que esta ruta sea correcta.
const movimientoService = require('../../src/services/movimientoService')
jest.mock('../../src/services/movimientoService') // Esto mockea el servicio.
const { generateTokenForTesting } = require('../utils')

const cajaService = require('../../src/services/cajaService')
jest.mock('../../src/services/cajaService')

describe('movimientoController', () => {
    let authToken

    // Esto se ejecutará antes de cada prueba
    beforeEach(() => {
        authToken = `Bearer ${generateTokenForTesting()}`
    })
    describe('POST /api/movimientos', () => {
        it('should return 201', async () => {
            const body = {
                fecha: '2021-10-10',
                hora: '10:10',
                tipo: 'Ingreso',
                observacion: 'observacion',
                total: 100,
                empleadoId: 1,
                cajaId: 1,
            }
            movimientoService.crearMovimiento.mockResolvedValue()
            const response = await request(app)
                .post('/api/movimientos')
                .set('Authorization', authToken)
                .send(body)
            expect(response.statusCode).toBe(201)
        })
    })

    describe('GET /api/movimientos', () => {
        it('should return 200', async () => {
            movimientoService.getMovimientos.mockResolvedValue([])
            const response = await request(app)
                .get('/api/movimientos')
                .set('Authorization', authToken)
            expect(response.statusCode).toBe(200)
        })
    })

    describe('GET /api/movimientos/:id', () => {
        it('should return 200', async () => {
            movimientoService.getMovimientoById.mockResolvedValue({})
            const response = await request(app)
                .get('/api/movimientos/1')
                .set('Authorization', authToken)
            expect(response.statusCode).toBe(200)
        })
    })

    //movimiento no encontrado
    describe('GET /api/movimientos/:id NOT FOUND', () => {
        it('should return 404', async () => {
            movimientoService.getMovimientoById.mockResolvedValue(null)
            const response = await request(app)
                .get('/api/movimientos/1')
                .set('Authorization', authToken)
            expect(response.statusCode).toBe(404)
        })
    })

    describe('DELETE /api/movimientos/:id', () => {
        it('should return 200', async () => {
            movimientoService.deleteMovimiento.mockResolvedValue(1)
            const response = await request(app)
                .delete('/api/movimientos/1')
                .set('Authorization', authToken)
            expect(response.statusCode).toBe(200)
        })
    })

    //movimiento no encontrado
    describe('DELETE /api/movimientos/:id NOT FOUND', () => {
        it('should return 404', async () => {
            movimientoService.deleteMovimiento.mockResolvedValue(0)
            const response = await request(app)
                .delete('/api/movimientos/1')
                .set('Authorization', authToken)
            expect(response.statusCode).toBe(404)
        })
    })

    describe('GET /api/movimientos/caja/:id', () => {
        // Caja encontrada y movimientos encontrados
        it('should return 200 and movimientos for a caja', async () => {
            const mockMovimientos = {
                total: 21,
                items: [
                    {
                        id: 7,
                        fecha: '2023-10-26',
                        hora: '10:00:00',
                        total: 500,
                        tipo: 'Retiro',
                        observacion: 'Pago banda',
                        cajaId: 1,
                        empleadoId: 1,
                        createdAt: '2023-11-01T01:02:05.000Z',
                        updatedAt: '2023-11-01T01:02:05.000Z',
                    },
                    {
                        id: 17,
                        fecha: '2023-10-26',
                        hora: '10:00:00',
                        total: 500,
                        tipo: 'Ingreso',
                        observacion: 'Pago banda',
                        cajaId: 1,
                        empleadoId: 1,
                        createdAt: '2023-11-01T01:42:16.000Z',
                        updatedAt: '2023-11-01T01:42:16.000Z',
                    },
                    // Puedes añadir más objetos aquí si necesitas probar con más datos
                ],
            }

            cajaService.getCajaById.mockResolvedValue({
                id: 1 /* otros datos de la caja */,
            })
            movimientoService.getMovimientosByCajaId.mockResolvedValue(
                mockMovimientos
            )

            const response = await request(app)
                .get('/api/movimientos/caja/1')
                .set('Authorization', authToken)
                .query({ page: 1, limit: 10 })

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual(mockMovimientos)
            expect(cajaService.getCajaById).toHaveBeenCalledWith('1')
            expect(
                movimientoService.getMovimientosByCajaId
            ).toHaveBeenCalledWith('1', { page: 1, limit: 10 })
        })

        // Caja encontrada y movimientos encontrados (sin query params)
        it('should return 200 and movimientos for a caja without query params', async () => {
            const mockMovimientos = {
                total: 21,
                items: [
                    {
                        id: 7,
                        fecha: '2023-10-26',
                        hora: '10:00:00',
                        total: 500,
                        tipo: 'Retiro',
                        observacion: 'Pago banda',
                        cajaId: 1,
                        empleadoId: 1,
                        createdAt: '2023-11-01T01:02:05.000Z',
                        updatedAt: '2023-11-01T01:02:05.000Z',
                    },
                    {
                        id: 17,
                        fecha: '2023-10-26',
                        hora: '10:00:00',
                        total: 500,
                        tipo: 'Ingreso',
                        observacion: 'Pago banda',
                        cajaId: 1,
                        empleadoId: 1,
                        createdAt: '2023-11-01T01:42:16.000Z',
                        updatedAt: '2023-11-01T01:42:16.000Z',
                    },
                    // Puedes añadir más objetos aquí si necesitas probar con más datos
                ],
            }

            cajaService.getCajaById.mockResolvedValue({
                id: 1 /* otros datos de la caja */,
            })
            movimientoService.getMovimientosByCajaId.mockResolvedValue(
                mockMovimientos
            )

            const response = await request(app)
                .get('/api/movimientos/caja/1')
                .set('Authorization', authToken)

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual(mockMovimientos)
            expect(cajaService.getCajaById).toHaveBeenCalledWith('1')
            expect(
                movimientoService.getMovimientosByCajaId
            ).toHaveBeenCalledWith('1', { page: 1, limit: 10 })
        })

        // Caja no encontrada
        it('should return 404 when the caja is not found', async () => {
            cajaService.getCajaById.mockResolvedValue(null)

            const response = await request(app)
                .get('/api/movimientos/caja/999')
                .set('Authorization', authToken)
                .query({ page: 1, limit: 10 })

            expect(response.statusCode).toBe(404)
            expect(response.body).toHaveProperty(
                'message',
                'Caja no encontrada'
            )
        })

        // Movimientos no encontrados
        it('should return 404 when movimientos for a caja are not found', async () => {
            cajaService.getCajaById.mockResolvedValue({
                id: 1 /* otros datos de la caja */,
            })
            movimientoService.getMovimientosByCajaId.mockResolvedValue(null)

            const response = await request(app)
                .get('/api/movimientos/caja/1')
                .set('Authorization', authToken)
                .query({ page: 1, limit: 10 })

            expect(response.statusCode).toBe(404)
            expect(response.body).toHaveProperty(
                'message',
                'Movimientos no encontrados'
            )
        })

        // ... otras pruebas según sea necesario
    })
})
