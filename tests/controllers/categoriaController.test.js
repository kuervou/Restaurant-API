const request = require('supertest')
const { app } = require('../../src/app') // Asegúrate de que esta ruta sea correcta.
const categoriaService = require('../../src/services/categoriaService')
jest.mock('../../src/services/categoriaService') // Esto mockea el servicio.
const { generateTokenForTesting } = require('../utils')

describe('categoriaController', () => {
    let authToken

    // Esto se ejecutará antes de cada prueba
    beforeEach(() => {
        authToken = `Bearer ${generateTokenForTesting()}`
    })
    describe('POST /api/categorias', () => {
        it('should create a new category', async () => {
            const categoriaData = { nombre: 'Electrónica' }
            categoriaService.crearCategoria.mockResolvedValue(categoriaData)

            const res = await request(app)
                .post('/api/categorias')
                .set('Authorization', authToken)
                .send(categoriaData)

            expect(res.statusCode).toEqual(201)
            expect(res.body).toHaveProperty('message', 'Categoria creada')
            expect(categoriaService.crearCategoria).toHaveBeenCalledWith(
                'electrónica'
            )
        })

        // Aquí podrías añadir más pruebas para diferentes escenarios, como cuando faltan campos.
    })

    describe('GET /api/categorias', () => {
        it('should retrieve categories', async () => {
            const mockCategorias = [
                { id: 1, nombre: 'Electrónica' },
                { id: 2, nombre: 'Librería' },
            ]
            categoriaService.getCategorias.mockResolvedValue(mockCategorias)

            const res = await request(app)
                .get('/api/categorias')
                .set('Authorization', authToken)
                .query({ page: 1, limit: 10 })

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(mockCategorias)
        })

        //hacer otro get sin query
        it('should retrieve categories without query', async () => {
            const mockCategorias = [
                { id: 1, nombre: 'Electrónica' },
                { id: 2, nombre: 'Librería' },
            ]
            categoriaService.getCategorias.mockResolvedValue(mockCategorias)

            const res = await request(app)
                .get('/api/categorias')
                .set('Authorization', authToken)
                .query({})

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(mockCategorias)
        })

        // Más pruebas aquí...
    })

    describe('GET /api/categorias/:id', () => {
        it('should retrieve a category by id', async () => {
            const categoria = { id: 1, nombre: 'Electrónica' }
            categoriaService.getCategoriaById.mockResolvedValue(categoria)

            const res = await request(app)
                .get(`/api/categorias/${categoria.id}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(categoria)
        })

        it('should return 404 if category not found', async () => {
            categoriaService.getCategoriaById.mockResolvedValue(null)

            const res = await request(app)
                .get('/api/categorias/999')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
        })

        // Más pruebas aquí...
    })

    describe('PUT /api/categorias/:id', () => {
        it('should update the category', async () => {
            const categoriaData = { nombre: 'Electrónica' }
            categoriaService.updateCategoria.mockResolvedValue([1]) // Supongamos que devuelve el número de registros actualizados.

            const res = await request(app)
                .put('/api/categorias/1')
                .send(categoriaData)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Categoria actualizada')
        })

        //probar el caso donde una categoria no se encuentra
        it('should return 404 if the category does not exist', async () => {
            const categoriaData = { nombre: 'Electrónica' }
            categoriaService.updateCategoria.mockResolvedValue([0]) // Supongamos que devuelve el número de registros actualizados.

            const res = await request(app)
                .put('/api/categorias/999')
                .send(categoriaData)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
        })

        // Más pruebas aquí...
    })

    describe('DELETE /api/categorias/:id', () => {
        it('should delete the category', async () => {
            categoriaService.deleteCategoria.mockResolvedValue(1)

            const res = await request(app)
                .delete('/api/categorias/1')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Categoria eliminada')
        })

        it('should return 404 if the category does not exist', async () => {
            categoriaService.deleteCategoria.mockResolvedValue(0)

            const res = await request(app)
                .delete('/api/categorias/999')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
        })

        // Más pruebas aquí...
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})
