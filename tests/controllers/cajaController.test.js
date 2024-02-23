const request = require('supertest')
const { app } = require('../../src/app') // Asegúrate de que esta ruta sea correcta.
const cajaService = require('../../src/services/cajaService')
jest.mock('../../src/services/cajaService') // Esto mockea el servicio.
const { generateTokenForTesting } = require('../utils')

describe('cajaController', () => {
    let authToken

    // Esto se ejecutará antes de cada prueba
    beforeEach(() => {
        authToken = `Bearer ${generateTokenForTesting()}`
    })

    describe('POST /api/cajas', () => {
        it('should create a new caja', async () => {
            const cajaData = { total: 100 }
            cajaService.crearCaja.mockResolvedValue(cajaData)

            const res = await request(app)
                .post('/api/cajas')
                .set('Authorization', authToken)
                .send(cajaData)

            expect(res.statusCode).toEqual(201)
            expect(res.body).toHaveProperty('message', 'Caja creada')
            expect(cajaService.crearCaja).toHaveBeenCalledWith(100)
        })

        // Aquí podrías añadir más pruebas para diferentes escenarios, como cuando faltan campos.
    })

    describe('GET /api/cajas', () => {
        it('should retrieve cajas', async () => {
            const mockCajas = [
                { id: 1, total: 100 },
                { id: 2, total: 200 },
            ]
            cajaService.getCajas.mockResolvedValue(mockCajas)

            const res = await request(app)
                .get('/api/cajas')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(mockCajas)
        })

        // Más pruebas aquí...
    })

    describe('GET /api/cajas/:id', () => {
        it('should retrieve a caja by id', async () => {
            const caja = { id: 1, total: 100 }
            cajaService.getCajaById.mockResolvedValue(caja)

            const res = await request(app)
                .get(`/api/cajas/${caja.id}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(caja)
        })

        it('should return 404 if caja not found', async () => {
            cajaService.getCajaById.mockResolvedValue(null)

            const res = await request(app)
                .get('/api/cajas/999')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
        })

        // Más pruebas aquí...
    })

    describe('PUT /api/cajas/:id', () => {
        it('should update the caja', async () => {
            const cajaData = { total: 200 }
            cajaService.updateCaja.mockResolvedValue([1]) // Suponemos que devuelve el número de registros actualizados.

            const res = await request(app)
                .put('/api/cajas/1')
                .set('Authorization', authToken)
                .send(cajaData)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Caja actualizada')
        })

        it('should return 404 if the caja does not exist', async () => {
            cajaService.updateCaja.mockResolvedValue([0])

            const res = await request(app)
                .put('/api/cajas/999')
                .set('Authorization', authToken)
                .send({ total: 300 })

            expect(res.statusCode).toEqual(404)
        })

        // Más pruebas aquí...
    })

    describe('DELETE /api/cajas/:id', () => {
        it('should delete the caja', async () => {
            cajaService.deleteCaja.mockResolvedValue(1)

            const res = await request(app)
                .delete('/api/cajas/1')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Caja eliminada')
        })

        it('should return 404 if the caja does not exist', async () => {
            cajaService.deleteCaja.mockResolvedValue(0)

            const res = await request(app)
                .delete('/api/cajas/999')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
        })

        // Más pruebas aquí...
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})
