const request = require('supertest')
const { app } = require('../../src/app') // Asegúrate de que esta ruta sea correcta.
const itemInventarioService = require('../../src/services/itemInventarioService')
jest.mock('../../src/services/itemInventarioService')
const { generateTokenForTesting } = require('../utils')

describe('itemInventarioController', () => {
    let authToken

    beforeEach(() => {
        authToken = `Bearer ${generateTokenForTesting()}`
    })

    describe('POST /api/itemsInventario', () => {
        it('should create a new itemInventario', async () => {
            const itemData = {
                nombre: 'Producto1',
                descripcion: 'Descripción del Producto1',
                stock: 100,
                costo: 50,
                cantxCasillero: 5,
                porUnidad: true,
                categoriaId: 1,
            }

            itemInventarioService.crearItemInventario.mockResolvedValue(null) // Asume que el servicio no devuelve nada en caso de éxito

            const res = await request(app)
                .post('/api/itemsInventario')
                .set('Authorization', authToken)
                .send(itemData)

            expect(res.statusCode).toEqual(201)
            expect(res.body).toHaveProperty('message', 'ItemInventario creado')
            expect(
                itemInventarioService.crearItemInventario
            ).toHaveBeenCalledWith(
                itemData.nombre.toLowerCase(),
                itemData.descripcion,
                itemData.stock,
                itemData.costo,
                itemData.cantxCasillero,
                itemData.porUnidad,
                itemData.categoriaId
            )
        })

        // ... Agrega más pruebas para casos de error, como datos inválidos ...
    })

    describe('GET /api/itemsInventario', () => {
        it('should retrieve a list of items with pagination', async () => {
            const mockItems = [
                {
                    /* Datos del primer item */ id: 1,
                    nombre: 'Producto1',
                    descripcion: 'Descripción del Producto1',
                    stock: 100,
                    costo: 50,
                    cantxCasillero: 5,
                    porUnidad: true,
                    categoriaId: 1,
                },
                {
                    /* Datos del segundo item */ id: 2,
                    nombre: 'Producto2',
                    descripcion: 'Descripción del Producto2',
                    stock: 200,
                    costo: 100,
                    cantxCasillero: 10,
                    porUnidad: false,
                    categoriaId: 2,
                },
                // ... más items ...
            ]
            itemInventarioService.getItemsInventario.mockResolvedValue({
                items: mockItems,
                total: mockItems.length,
                page: 1,
                limit: 10,
            })

            const res = await request(app)
                .get('/api/itemsInventario?page=1&limit=10')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('items')
            expect(res.body.items.length).toBeLessThanOrEqual(10)
            expect(
                itemInventarioService.getItemsInventario
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    page: 1,
                    limit: 10,
                })
            )
        })

        //Test para filtrar por nombre
        it('should retrieve a list of items filtered by name', async () => {
            const mockItems = [
                {
                    /* Datos del primer item */ id: 1,
                    nombre: 'Producto1',
                    descripcion: 'Descripción del Producto1',
                    stock: 100,
                    costo: 50,
                    cantxCasillero: 5,
                    porUnidad: true,
                    categoriaId: 1,
                },
                {
                    /* Datos del segundo item */ id: 2,
                    nombre: 'Producto2',
                    descripcion: 'Descripción del Producto2',
                    stock: 200,
                    costo: 100,
                    cantxCasillero: 10,
                    porUnidad: false,
                    categoriaId: 2,
                },
                // ... más items ...
            ]
            itemInventarioService.getItemsInventario.mockResolvedValue({
                items: mockItems,
                total: mockItems.length,
                page: 1,
                limit: 10,
            })

            const res = await request(app)
                .get('/api/itemsInventario?nombre=Producto1')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('items')
            expect(res.body.items.length).toBeLessThanOrEqual(10)
            expect(
                itemInventarioService.getItemsInventario
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    nombre: 'Producto1',
                })
            )
        })

        //Test para filtrar por categoria
        it('should retrieve a list of items filtered by category', async () => {
            const mockItems = [
                {
                    /* Datos del primer item */ id: 1,
                    nombre: 'Producto1',
                    descripcion: 'Descripción del Producto1',
                    stock: 100,
                    costo: 50,
                    cantxCasillero: 5,
                    porUnidad: true,
                    categoriaId: 1,
                },
                {
                    /* Datos del segundo item */ id: 2,
                    nombre: 'Producto2',
                    descripcion: 'Descripción del Producto2',
                    stock: 200,
                    costo: 100,
                    cantxCasillero: 10,
                    porUnidad: false,
                    categoriaId: 2,
                },
                // ... más items ...
            ]
            itemInventarioService.getItemsInventario.mockResolvedValue({
                items: mockItems,
                total: mockItems.length,
                page: 1,
                limit: 10,
            })

            const res = await request(app)
                .get('/api/itemsInventario?categoriaId=1')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('items')
            expect(res.body.items.length).toBeLessThanOrEqual(10)
            expect(
                itemInventarioService.getItemsInventario
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    categoriaId: 1,
                })
            )
        })

        //Test para filtrar por unidad
        it('should retrieve a list of items filtered by unit', async () => {
            const mockItems = [
                {
                    /* Datos del primer item */ id: 1,
                    nombre: 'Producto1',
                    descripcion: 'Descripción del Producto1',
                    stock: 100,
                    costo: 50,
                    cantxCasillero: 5,
                    porUnidad: true,
                    categoriaId: 1,
                },
                {
                    /* Datos del segundo item */ id: 2,
                    nombre: 'Producto2',
                    descripcion: 'Descripción del Producto2',
                    stock: 200,
                    costo: 100,

                    cantxCasillero: 10,
                    porUnidad: false,
                    categoriaId: 2,
                },
                // ... más items ...
            ]
            itemInventarioService.getItemsInventario.mockResolvedValue({
                items: mockItems,
                total: mockItems.length,
                page: 1,
                limit: 10,
            })

            const res = await request(app)
                .get('/api/itemsInventario?porUnidad=true')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('items')
            expect(res.body.items.length).toBeLessThanOrEqual(10)
            expect(
                itemInventarioService.getItemsInventario
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    porUnidad: 'true',
                })
            )
        })

        // ... Agrega pruebas adicionales para verificar el filtrado por nombre, categoría, etc. ...
    })

    describe('GET /api/itemsInventario/:id', () => {
        it('should retrieve a specific itemInventario by ID', async () => {
            const itemId = '1'
            const mockItem = {
                /* Datos del item */ id: itemId,
                nombre: 'Producto1',
                descripcion: 'Descripción del Producto1',
                stock: 100,
                costo: 50,
                cantxCasillero: 5,
                porUnidad: true,
                categoriaId: 1,
            }

            itemInventarioService.getItemInventarioById.mockResolvedValue(
                mockItem
            )

            const res = await request(app)
                .get(`/api/itemsInventario/${itemId}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(mockItem)
            expect(
                itemInventarioService.getItemInventarioById
            ).toHaveBeenCalledWith(itemId)
        })

        it('should return an error when itemInventario with specified ID does not exist', async () => {
            const itemId = '999'
            itemInventarioService.getItemInventarioById.mockResolvedValue(null)

            const res = await request(app)
                .get(`/api/itemsInventario/${itemId}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
            expect(res.body).toHaveProperty(
                'message',
                'ItemInventario no encontrado'
            )
        })
    })

    describe('PUT /api/itemsInventario/:id', () => {
        it('should update an itemInventario', async () => {
            const itemId = '1'
            const updateData = {
                /* Datos para actualizar */ nombre: 'producto1',
                descripcion: 'Descripción del Producto1',
                stock: 100,
                costo: 50,
                cantxCasillero: 5,
                porUnidad: true,
                categoriaId: 1,
            }
            itemInventarioService.updateItemInventario.mockResolvedValue([1]) // Suponemos que devuelve la cantidad de registros actualizados

            const res = await request(app)
                .put(`/api/itemsInventario/${itemId}`)
                .set('Authorization', authToken)
                .send(updateData)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty(
                'message',
                'ItemInventario actualizado'
            )
            expect(
                itemInventarioService.updateItemInventario
            ).toHaveBeenCalledWith(itemId, ...Object.values(updateData))
        })

        it('should return an error when itemInventario to update does not exist', async () => {
            const itemId = '999'
            const updateData = {
                /* Datos para actualizar */ nombre: 'Producto1',
                descripcion: 'Descripción del Producto1',
                stock: 100,
                costo: 50,
                cantxCasillero: 5,
                porUnidad: true,
                categoriaId: 1,
            }
            itemInventarioService.updateItemInventario.mockResolvedValue([0])

            const res = await request(app)
                .put(`/api/itemsInventario/${itemId}`)
                .set('Authorization', authToken)
                .send(updateData)

            expect(res.statusCode).toEqual(404)
            expect(res.body).toHaveProperty(
                'message',
                'ItemInventario no encontrado'
            )
        })
    })

    describe('DELETE /api/itemsInventario/:id', () => {
        it('should delete an itemInventario', async () => {
            const itemId = '1'
            itemInventarioService.deleteItemInventario.mockResolvedValue(1)

            const res = await request(app)
                .delete(`/api/itemsInventario/${itemId}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty(
                'message',
                'ItemInventario eliminado'
            )
            expect(
                itemInventarioService.deleteItemInventario
            ).toHaveBeenCalledWith(itemId)
        })

        it('should return an error when itemInventario to delete does not exist', async () => {
            const itemId = '999'
            itemInventarioService.deleteItemInventario.mockResolvedValue(0)

            const res = await request(app)
                .delete(`/api/itemsInventario/${itemId}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
            expect(res.body).toHaveProperty(
                'message',
                'ItemInventario no encontrado'
            )
        })
    })

    describe('PUT /api/itemsInventario/:id/stock', () => {
        it('should update the stock of an itemInventario', async () => {
            const itemId = '1'
            const stockData = { amount: 10 }
            itemInventarioService.updateStock.mockResolvedValue({
                /* datos actualizados del item */ id: itemId,
                nombre: 'Producto1',
                descripcion: 'Descripción del Producto1',
                stock: 110,
                costo: 50,
                cantxCasillero: 5,
                porUnidad: true,
                categoriaId: 1,
            })

            const res = await request(app)
                .put(`/api/itemsInventario/${itemId}/stock`)
                .set('Authorization', authToken)
                .send(stockData)

            expect(res.statusCode).toEqual(200)
            expect(itemInventarioService.updateStock).toHaveBeenCalledWith(
                itemId,
                stockData.amount
            )
            // Verifica más propiedades del body según lo que tu API debe devolver
        })

        it('should return an error when itemInventario to update stock does not exist', async () => {
            const itemId = '999'
            const stockData = { amount: 10 }
            itemInventarioService.updateStock.mockResolvedValue(null)

            const res = await request(app)
                .put(`/api/itemsInventario/${itemId}/stock`)
                .set('Authorization', authToken)
                .send(stockData)

            expect(res.statusCode).toEqual(404)
            expect(res.body).toHaveProperty(
                'message',
                'ItemInventario no encontrado'
            )
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})
