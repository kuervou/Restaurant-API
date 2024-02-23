const request = require('supertest')
const { app } = require('../../src/app') // Asegúrate de que esta ruta sea correcta.
const compraService = require('../../src/services/compraService')
jest.mock('../../src/services/compraService') // Esto mockea el servicio.
const { generateTokenForTesting } = require('../utils')

describe('compraController', () => {
    let authToken

    beforeEach(() => {
        authToken = `Bearer ${generateTokenForTesting()}`
    })

    describe('POST /api/compras', () => {
        it('should create a new compra successfully', async () => {
            const compraData = {
                fecha: '2022-01-01',
                hora: '10:00:00',
                cantidadxCasillero: 2,
                cantidad: 10,
                empleadoId: 1,
                itemInventarioId: 1,
            }

            compraService.crearCompra.mockResolvedValue({
                // La respuesta simulada incluye los campos de compraData y cualquier dato adicional retornado por el servicio
                id: expect.any(Number), // El ID se genera automáticamente, así que podemos esperar cualquier número
                fecha: compraData.fecha,
                hora: compraData.hora,
                cantidadxCasillero: compraData.cantidadxCasillero,
                cantidad: compraData.cantidad,
                empleadoId: compraData.empleadoId,
                itemInventarioId: compraData.itemInventarioId,
                total: expect.any(Number), // Suponiendo que el total se calcula en el servicio
                updatedAt: expect.any(String), // La fecha de actualización puede ser cualquier string que represente una fecha
                createdAt: expect.any(String), // Igual para la fecha de creación
            })
        })
        it('should return an error when required data is missing', async () => {
            const compraData = {
                fecha: '2022-01-01',
                hora: '10:00:00',
                cantidadxCasillero: 2,
                cantidad: 10,
                empleadoId: 1,
                itemInventarioId: 1,
            }

            compraService.crearCompra.mockImplementation(() => {
                throw new Error('Datos faltantes o inválidos') // Simula una excepción lanzada por el servicio
            })

            const res = await request(app)
                .post('/api/compras')
                .set('Authorization', authToken)
                .send(compraData)

            expect(res.statusCode).toEqual(500)
            expect(res.body).toHaveProperty('message')
            expect(compraService.crearCompra).toHaveBeenCalledWith(compraData)
        })

        // Puedes agregar más pruebas para otros casos de error, como datos inválidos que no generan excepciones pero no cumplen con la lógica de negocio.
    })

    describe('GET /api/compras', () => {
        it('should retrieve a list of compras with pagination', async () => {
            compraService.getCompras.mockResolvedValue({
                // Suponemos que el servicio devuelve un objeto con la lista de compras y metadatos de paginación
                compras: [], // Aquí deberían ir los datos de las compras
                total: 0,
                page: 1,
                limit: 10,
            })

            const res = await request(app)
                .get('/api/compras?page=1&limit=10')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('compras')
            expect(compraService.getCompras).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                fecha: undefined,
            })
        })

        it('should retrieve compras for a specific date', async () => {
            const fecha = '2022-01-01'
            compraService.getCompras.mockResolvedValue({
                // Suponemos que el servicio devuelve un objeto con la lista de compras y metadatos de paginación
                compras: [], // Aquí deberían ir los datos de las compras para la fecha especificada
                total: 0,
                page: 1,
                limit: 10,
            })

            const res = await request(app)
                .get(`/api/compras?fecha=${fecha}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('compras')
            expect(compraService.getCompras).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                fecha,
            })
        })

        // ... Agrega pruebas para manejar casos donde no se encuentran compras ...
    })

    describe('GET /api/compras/:id', () => {
        it('should retrieve a specific compra by ID', async () => {
            const compraId = '1'
            compraService.getCompraById.mockResolvedValue({
                id: compraId,
                fecha: '2022-01-01',
                hora: '10:00:00',
                cantidadxCasillero: 2,
                cantidad: 10,
                empleadoId: 1,
                itemInventarioId: 1,
                total: 100,
                updatedAt: '2021-09-01 10:00:00',
                createdAt: '2021-09-01 10:00:00',
            })

            const res = await request(app)
                .get(`/api/compras/${compraId}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('id', compraId)
            expect(compraService.getCompraById).toHaveBeenCalledWith(compraId)
        })

        it('should return an error when compra with specified ID does not exist', async () => {
            const compraId = '999'
            compraService.getCompraById.mockResolvedValue(null)

            const res = await request(app)
                .get(`/api/compras/${compraId}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
            expect(res.body).toHaveProperty('message', 'Compra no encontrada')
            expect(compraService.getCompraById).toHaveBeenCalledWith(compraId)
        })

        // ... Agrega más pruebas según sea necesario ...
    })

    describe('DELETE /api/compras/:id', () => {
        it('should delete a compra', async () => {
            const compraId = '1'
            compraService.deleteCompra.mockResolvedValue(1) // Suponemos que el servicio devuelve 1 para indicar éxito

            const res = await request(app)
                .delete(`/api/compras/${compraId}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Compra eliminada')
            expect(compraService.deleteCompra).toHaveBeenCalledWith(compraId)
        })

        it('should return an error when compra to delete does not exist', async () => {
            const compraId = '999'
            compraService.deleteCompra.mockResolvedValue(0) // Suponemos que el servicio devuelve 0 para indicar que no se encontró la compra

            const res = await request(app)
                .delete(`/api/compras/${compraId}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
            expect(res.body).toHaveProperty('message', 'Compra no encontrada')
            expect(compraService.deleteCompra).toHaveBeenCalledWith(compraId)
        })

        // ... Agrega más pruebas según sea necesario ...
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})
