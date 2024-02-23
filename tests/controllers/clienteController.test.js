const request = require('supertest')
const { app } = require('../../src/app')
const clienteService = require('../../src/services/clienteService')
jest.mock('../../src/services/clienteService')
const { generateTokenForTesting } = require('../utils')

describe('clienteController', () => {
    let authToken

    beforeEach(() => {
        authToken = `Bearer ${generateTokenForTesting()}`
    })

    describe('POST /api/clientes', () => {
        it('should create a new cliente', async () => {
            const clienteData = {
                nombre: 'John',
                apellido: 'Doe',
                telefono: '123456789',
            }
            clienteService.crearCliente.mockResolvedValue(clienteData)

            const res = await request(app)
                .post('/api/clientes')
                .set('Authorization', authToken)
                .send(clienteData)

            expect(res.statusCode).toEqual(201)
            expect(res.body).toHaveProperty('message', 'Cliente creado')
            expect(clienteService.crearCliente).toHaveBeenCalledWith(
                'john',
                'doe',
                '123456789'
            )
        })
    })

    describe('GET /api/clientes', () => {
        it('should retrieve clientes', async () => {
            const mockClientes = [
                {
                    id: 1,
                    nombre: 'john',
                    apellido: 'doe',
                    telefono: '123456789',
                },
                {
                    id: 2,
                    nombre: 'jane',
                    apellido: 'doe',
                    telefono: '098765432',
                },
            ]
            clienteService.getClientes.mockResolvedValue(mockClientes)

            const res = await request(app)
                .get('/api/clientes')
                .set('Authorization', authToken)
                .query({ page: 1, limit: 10 })

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(mockClientes)
        })
    })

    //hacer un get sin  query
    describe('GET /api/clientes without query', () => {
        it('should retrieve clientes', async () => {
            const mockClientes = [
                {
                    id: 1,
                    nombre: 'john',
                    apellido: 'doe',
                    telefono: '123456789',
                },
                {
                    id: 2,
                    nombre: 'jane',
                    apellido: 'doe',
                    telefono: '098765432',
                },
            ]
            clienteService.getClientes.mockResolvedValue(mockClientes)

            const res = await request(app)
                .get('/api/clientes')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(mockClientes)
        })
    })

    describe('GET /api/clientes/:id', () => {
        it('should retrieve a cliente by id', async () => {
            const cliente = {
                id: 1,
                nombre: 'john',
                apellido: 'doe',
                telefono: '123456789',
            }
            clienteService.getClienteById.mockResolvedValue(cliente)

            const res = await request(app)
                .get(`/api/clientes/${cliente.id}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(cliente)
        })

        it('should return 404 if cliente not found', async () => {
            clienteService.getClienteById.mockResolvedValue(null)

            const res = await request(app)
                .get('/api/clientes/999')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
        })
    })

    describe('PUT /api/clientes/:id', () => {
        it('should update the cliente', async () => {
            const clienteData = {
                nombre: 'Jane',
                apellido: 'Doe',
                telefono: '123456789',
                cuenta: 200,
            }
            clienteService.updateCliente.mockResolvedValue([1])

            const res = await request(app)
                .put('/api/clientes/1')
                .set('Authorization', authToken)
                .send(clienteData)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Cliente actualizado')
        })

        it('should return 404 if the cliente does not exist', async () => {
            clienteService.updateCliente.mockResolvedValue([0])

            const res = await request(app)
                .put('/api/clientes/999')
                .set('Authorization', authToken)
                .send({
                    nombre: 'Jane',
                    apellido: 'Doe',
                    telefono: '123456789',
                    cuenta: 200,
                })

            expect(res.statusCode).toEqual(404)
        })
    })

    //Hacer un update sin pasar el nombre y apellido
    describe('PUT /api/clientes/:id without nombre and apellido', () => {
        it('should update the cliente', async () => {
            const clienteData = { telefono: '123456789', cuenta: 200 }
            clienteService.updateCliente.mockResolvedValue([1])

            const res = await request(app)
                .put('/api/clientes/1')
                .set('Authorization', authToken)
                .send(clienteData)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Cliente actualizado')
        })

        it('should return 404 if the cliente does not exist', async () => {
            clienteService.updateCliente.mockResolvedValue([0])

            const res = await request(app)
                .put('/api/clientes/999')
                .set('Authorization', authToken)
                .send({ telefono: '123456789', cuenta: 200 })

            expect(res.statusCode).toEqual(404)
        })
    })

    describe('DELETE /api/clientes/:id', () => {
        it('should delete the cliente', async () => {
            clienteService.deleteCliente.mockResolvedValue(1)

            const res = await request(app)
                .delete('/api/clientes/1')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Cliente eliminado')
        })

        it('should return 404 if the cliente does not exist', async () => {
            clienteService.deleteCliente.mockResolvedValue(0)

            const res = await request(app)
                .delete('/api/clientes/999')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})
