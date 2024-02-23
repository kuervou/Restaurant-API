const request = require('supertest')
const { app } = require('../../src/app') // Asegúrate de que esta ruta sea correcta.
const grupoService = require('../../src/services/grupoService')
jest.mock('../../src/services/grupoService') // Esto mockea el servicio.
const { generateTokenForTesting } = require('../utils')

describe('grupoController', () => {
    let authToken

    // Esto se ejecutará antes de cada prueba
    beforeEach(() => {
        authToken = `Bearer ${generateTokenForTesting()}`
    })
    describe('POST /api/grupos', () => {
        it('should create a new group', async () => {
            const grupoData = { nombre: 'Electrónica', esBebida: false }
            grupoService.crearGrupo.mockResolvedValue(grupoData)

            const res = await request(app)
                .post('/api/grupos')
                .set('Authorization', authToken)
                .send(grupoData)

            expect(res.statusCode).toEqual(201)
            expect(res.body).toHaveProperty('message', 'Grupo creado')
            expect(grupoService.crearGrupo).toHaveBeenCalledWith(
                'electrónica',
                false
            )
        })

        // Aquí podrías añadir más pruebas para diferentes escenarios, como cuando faltan campos.
    })

    describe('GET /api/grupos', () => {
        it('should retrieve categories', async () => {
            const mockGrupos = [
                { id: 1, nombre: 'Electrónica' },
                { id: 2, nombre: 'Librería' },
            ]
            grupoService.getGrupos.mockResolvedValue(mockGrupos)

            const res = await request(app)
                .get('/api/grupos')
                .set('Authorization', authToken)
                .query({ page: 1, limit: 10 })

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(mockGrupos)
        })

        //hacer otro get sin query
        it('should retrieve categories without query', async () => {
            const mockGrupos = [
                { id: 1, nombre: 'Electrónica' },
                { id: 2, nombre: 'Librería' },
            ]
            grupoService.getGrupos.mockResolvedValue(mockGrupos)

            const res = await request(app)
                .get('/api/grupos')
                .set('Authorization', authToken)
                .query({})

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(mockGrupos)
        })

        // Más pruebas aquí...
    })

    describe('GET /api/grupos/:id', () => {
        it('should retrieve a group by id', async () => {
            const grupo = { id: 1, nombre: 'Electrónica' }
            grupoService.getGrupoById.mockResolvedValue(grupo)

            const res = await request(app)
                .get(`/api/grupos/${grupo.id}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(grupo)
        })

        it('should return 404 if group not found', async () => {
            grupoService.getGrupoById.mockResolvedValue(null)

            const res = await request(app)
                .get('/api/grupos/999')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
        })

        // Más pruebas aquí...
    })

    describe('PUT /api/grupos/:id', () => {
        it('should update the group', async () => {
            const grupoData = { nombre: 'Electrónica' }
            grupoService.updateGrupo.mockResolvedValue([1]) // Supongamos que devuelve el número de registros actualizados.

            const res = await request(app)
                .put('/api/grupos/1')
                .send(grupoData)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Grupo actualizado')
        })

        //probar el caso donde una grupo no se encuentra
        it('should return 404 if the group does not exist', async () => {
            const grupoData = { nombre: 'Electrónica' }
            grupoService.updateGrupo.mockResolvedValue([0]) // Supongamos que devuelve el número de registros actualizados.

            const res = await request(app)
                .put('/api/grupos/999')
                .send(grupoData)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
        })

        //updetear solo "esBebida"
        it('should update the group (without name)', async () => {
            const grupoData = { esBebida: true }
            grupoService.updateGrupo.mockResolvedValue([1]) // Supongamos que devuelve el número de registros actualizados.

            const res = await request(app)
                .put('/api/grupos/1')
                .send(grupoData)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Grupo actualizado')
        })

        // Más pruebas aquí...
    })

    describe('DELETE /api/grupos/:id', () => {
        it('should delete the group', async () => {
            grupoService.deleteGrupo.mockResolvedValue(1)

            const res = await request(app)
                .delete('/api/grupos/1')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Grupo eliminado')
        })

        it('should return 404 if the group does not exist', async () => {
            grupoService.deleteGrupo.mockResolvedValue(0)

            const res = await request(app)
                .delete('/api/grupos/999')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
        })

        // Más pruebas aquí...
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})
