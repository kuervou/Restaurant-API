const request = require('supertest')
const { app } = require('../../src/app') // Asegúrate de que esta ruta sea correcta.
const mesaService = require('../../src/services/mesaService')
jest.mock('../../src/services/mesaService') // Esto mockea el servicio.
const { generateTokenForTesting } = require('../utils')

describe('mesaController', () => {
    let authToken

    // Esto se ejecutará antes de cada prueba
    beforeEach(() => {
        authToken = `Bearer ${generateTokenForTesting()}`
    })
    describe('POST /api/mesas', () => {
        it('should create a new table', async () => {
            const mesaData = { nroMesa: 1, libre: true }
            mesaService.crearMesa.mockResolvedValue(mesaData)

            const res = await request(app)
                .post('/api/mesas')
                .set('Authorization', authToken)
                .send(mesaData)

            expect(res.statusCode).toEqual(201)
            expect(res.body).toHaveProperty('message', 'Mesa creada')
            expect(mesaService.crearMesa).toHaveBeenCalledWith(1, true)
        })

        // Aquí podrías añadir más pruebas para diferentes escenarios, como cuando faltan campos.
    })

    describe('GET /api/mesas', () => {
        it('should retrieve tables', async () => {
            const mockMesas = [
                { id: 1, nroMesa: 1, libre: true },
                { id: 2, nroMesa: 2, libre: false },
            ]
            mesaService.getMesas.mockResolvedValue(mockMesas)

            const res = await request(app)
                .get('/api/mesas')
                .set('Authorization', authToken)
                .query({ page: 1, limit: 10 })

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(mockMesas)
        })

        //hacer otro get sin query
        it('should retrieve tables without query', async () => {
            const mockMesas = [
                { id: 1, nroMesa: 1, libre: true },
                { id: 2, nroMesa: 2, libre: false },
            ]
            mesaService.getMesas.mockResolvedValue(mockMesas)

            const res = await request(app)
                .get('/api/mesas')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(mockMesas)
        })
    })

    describe('GET /api/mesas/:id', () => {
        it('should retrieve a mesa by id', async () => {
            const mockMesa = { id: 1, nroMesa: 1, libre: true }
            mesaService.getMesaById.mockResolvedValue(mockMesa)

            const res = await request(app)
                .get('/api/mesas/1')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(mockMesa)
        })

        it('should return 404 if mesa is not found', async () => {
            mesaService.getMesaById.mockResolvedValue(null)

            const res = await request(app)
                .get('/api/mesas/1')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
        })
    })

    describe('PUT /api/mesas/:id', () => {
        it('should update a mesa', async () => {
            const mesaData = { nroMesa: 1, libre: true }
            mesaService.updateMesa.mockResolvedValue([1])

            const res = await request(app)
                .put('/api/mesas/1')
                .set('Authorization', authToken)
                .send(mesaData)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual({ message: 'Mesa actualizada' })
            expect(mesaService.updateMesa).toHaveBeenCalledWith('1', 1, true)
        })

        it('should return 404 if mesa is not found', async () => {
            const mesaData = { nroMesa: 1, libre: true }
            mesaService.updateMesa.mockResolvedValue([0])

            const res = await request(app)
                .put('/api/mesas/1')
                .set('Authorization', authToken)
                .send(mesaData)

            expect(res.statusCode).toEqual(404)
        })
    })

    describe('DELETE /api/mesas/:id', () => {
        it('should delete a mesa', async () => {
            mesaService.deleteMesa.mockResolvedValue(1)

            const res = await request(app)
                .delete('/api/mesas/1')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual({ message: 'Mesa eliminada' })
        })

        it('should return 404 if mesa is not found', async () => {
            mesaService.deleteMesa.mockResolvedValue(0)

            const res = await request(app)
                .delete('/api/mesas/1')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
        })
    })

    describe('GET /api/mesas/ocupadas', () => {
        it('should retrieve occupied tables', async () => {
            const mockMesas = [
                { id: 1, nroMesa: 1, libre: false },
                { id: 2, nroMesa: 2, libre: false },
            ]
            mesaService.getMesasOcupadas.mockResolvedValue(mockMesas)

            const res = await request(app)
                .get('/api/mesas/ocupadas')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(mockMesas)
        })
    })

    describe('GET /api/mesas/libres', () => {
        it('should retrieve free tables', async () => {
            const mockMesas = [
                { id: 1, nroMesa: 1, libre: true },
                { id: 2, nroMesa: 2, libre: true },
            ]
            mesaService.getMesasLibres.mockResolvedValue(mockMesas)

            const res = await request(app)
                .get('/api/mesas/libres')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(mockMesas)
        })
    })
})
