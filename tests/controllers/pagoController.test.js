const request = require('supertest')
const { app } = require('../../src/app')
const pagoService = require('../../src/services/pagoService')
const cajaService = require('../../src/services/cajaService')
jest.mock('../../src/services/pagoService')
jest.mock('../../src/services/cajaService')
const { generateTokenForTesting } = require('../utils')

// Suponemos que ya has configurado el mock global de socket.io en jest.setup.js

describe('pagoController', () => {
    let authToken

    beforeEach(() => {
        authToken = `Bearer ${generateTokenForTesting()}`
    })

    describe('POST /api/pagos', () => {
        it('should create a new pago', async () => {
            const pagoData = {
                fecha: '2023-10-25',
                hora: '14:30:00',
                metodoPago: 'Efectivo',
                total: 10,
                empleadoId: 1,
                cajaId: 1,
                ordenId: 55,
            }
            pagoService.crearPago.mockResolvedValue({ nuevoPago: pagoData })

            const response = await request(app)
                .post('/api/pagos')
                .set('Authorization', authToken)
                .send(pagoData)

            expect(response.statusCode).toBe(201)
            expect(response.body).toHaveProperty('message', 'Pago creado')
            expect(response.body).toHaveProperty('nuevoPago', pagoData)
            // No es necesario verificar las emisiones del socket aquí, ya que eso se maneja en el nivel de middleware y no se simula en Supertest
        })
    })

    describe('GET /api/pagos', () => {
        it('should return 200 with a list of pagos', async () => {
            const mockPagos = {
                total: 46,
                items: [
                    {
                        id: 16,
                        fecha: '2023-10-25',
                        hora: '14:30:00',
                        total: 10,
                        metodoPago: 'Credito',
                        ordenId: 62,
                        cajaId: 1,
                        EmpleadoId: 1,
                        createdAt: '2023-11-10T22:17:35.000Z',
                        updatedAt: '2023-11-10T22:17:35.000Z',
                        empleadoId: 1,
                    },
                    {
                        id: 17,
                        fecha: '2023-10-25',
                        hora: '14:30:00',
                        total: 10,
                        metodoPago: 'Credito',
                        ordenId: 62,
                        cajaId: 1,
                        EmpleadoId: 1,
                        createdAt: '2023-11-10T22:18:42.000Z',
                        updatedAt: '2023-11-10T22:18:42.000Z',
                        empleadoId: 1,
                    },
                    {
                        id: 19,
                        fecha: '2023-10-25',
                        hora: '14:30:00',
                        total: 12,
                        metodoPago: 'Credito',
                        ordenId: 62,
                        cajaId: 1,
                        EmpleadoId: 1,
                        createdAt: '2023-11-10T22:22:12.000Z',
                        updatedAt: '2023-11-10T22:22:12.000Z',
                        empleadoId: 1,
                    },
                    {
                        id: 31,
                        fecha: '2023-10-25',
                        hora: '14:30:00',
                        total: 10,
                        metodoPago: 'Efectivo',
                        ordenId: 55,
                        cajaId: 1,
                        EmpleadoId: 1,
                        createdAt: '2023-11-14T04:37:20.000Z',
                        updatedAt: '2023-11-14T04',
                        empleadoId: 1,
                    },
                ],
            }

            pagoService.getPagos.mockResolvedValue(mockPagos)

            const response = await request(app)
                .get('/api/pagos')
                .set('Authorization', authToken)
            // .query() si necesitas pasar parámetros de consulta

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual(mockPagos)
        })
    })

    describe('GET /api/pagos/:id', () => {
        it('should return 200 with a pago', async () => {
            const mockPago = {
                id: 10,
                fecha: '2023-11-03',
                hora: '18:14:18',
                total: 10,
                metodoPago: 'Efectivo',
                ordenId: 37,
                cajaId: 1,
                EmpleadoId: 1,
                createdAt: '2023-11-03T21:14:18.000Z',
                updatedAt: '2023-11-03T21:14:18.000Z',
                empleadoId: 1,
            }
            pagoService.getPagoById.mockResolvedValue(mockPago)

            const response = await request(app)
                .get('/api/pagos/1')
                .set('Authorization', authToken)

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual(mockPago)
        })
    })

    describe('GET /api/pagos/caja/:id', () => {
        it('should return 200 with pagos for a caja', async () => {
            const mockPagosCaja = {
                total: 45,
                items: [
                    {
                        id: 16,
                        fecha: '2023-10-25',
                        hora: '14:30:00',
                        total: 10,
                        metodoPago: 'Credito',
                        ordenId: 62,
                        cajaId: 1,
                        EmpleadoId: 1,
                        createdAt: '2023-11-10T22:17:35.000Z',
                        updatedAt: '2023-11-10T22:17:35.000Z',
                        empleadoId: 1,
                    },
                    {
                        id: 17,
                        fecha: '2023-10-25',
                        hora: '14:30:00',
                        total: 10,
                        metodoPago: 'Credito',
                        ordenId: 62,
                        cajaId: 1,
                        EmpleadoId: 1,
                        createdAt: '2023-11-10T22:18:42.000Z',
                        updatedAt: '2023-11-10T22:18:42.000Z',
                        empleadoId: 1,
                    },
                ],
            }
            cajaService.getCajaById.mockResolvedValue({
                id: 1,
                total: 21079,

                /* otros datos de la caja */
            })
            pagoService.getPagosByCajaId.mockResolvedValue(mockPagosCaja)

            const response = await request(app)
                .get('/api/pagos/caja/1')
                .set('Authorization', authToken)
                .query({ page: 1, limit: 10 })

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual(mockPagosCaja)
        })
    })

    //hacer otro get pagos by caja id pero sin query params

    describe('GET /api/pagos/caja/:id without qp', () => {
        it('should return 200 with pagos for a caja', async () => {
            const mockPagosCaja = {
                total: 45,
                items: [
                    {
                        id: 16,
                        fecha: '2023-10-25',
                        hora: '14:30:00',
                        total: 10,
                        metodoPago: 'Credito',
                        ordenId: 62,
                        cajaId: 1,
                        EmpleadoId: 1,
                        createdAt: '2023-11-10T22:17:35.000Z',
                        updatedAt: '2023-11-10T22:17:35.000Z',
                        empleadoId: 1,
                    },
                    {
                        id: 17,
                        fecha: '2023-10-25',
                        hora: '14:30:00',
                        total: 10,
                        metodoPago: 'Credito',
                        ordenId: 62,
                        cajaId: 1,
                        EmpleadoId: 1,
                        createdAt: '2023-11-10T22:18:42.000Z',
                        updatedAt: '2023-11-10T22:18:42.000Z',
                        empleadoId: 1,
                    },
                ],
            }
            cajaService.getCajaById.mockResolvedValue({
                id: 1,
                total: 21079,

                /* otros datos de la caja */
            })
            pagoService.getPagosByCajaId.mockResolvedValue(mockPagosCaja)

            const response = await request(app)
                .get('/api/pagos/caja/1')
                .set('Authorization', authToken)

            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual(mockPagosCaja)
        })
    })

    //HACER OTRO GET PAGOS BY CAJA ID PERO PARA UNA CAJA QUE NO EXISTE
    describe('GET /api/pagos/caja/:id 404', () => {
        it('should return 404 ERROR', async () => {
            cajaService.getCajaById.mockResolvedValue(null)

            const response = await request(app)
                .get('/api/pagos/caja/1')
                .set('Authorization', authToken)
                .query({ page: 1, limit: 10 })

            expect(response.statusCode).toBe(404)
        })
    })

    describe('DELETE /api/pagos/:id', () => {
        it('should return 200 when a pago is deleted', async () => {
            pagoService.deletePago.mockResolvedValue({
                message: 'Pago eliminado',
            })

            const response = await request(app)
                .delete('/api/pagos/1')
                .set('Authorization', authToken)

            expect(response.statusCode).toBe(200)
            expect(response.body).toHaveProperty('message', 'Pago eliminado')
            // Aquí también, no verificamos la emisión del socket
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})
