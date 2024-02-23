const request = require('supertest')
const { app } = require('../../src/app')
const ordenService = require('../../src/services/ordenService')
const cajaService = require('../../src/services/cajaService')
const empleadoService = require('../../src/services/empleadoService')
jest.mock('../../src/services/ordenService')
jest.mock('../../src/services/cajaService')
jest.mock('../../src/services/empleadoService')
const { generateTokenForTesting } = require('../utils')
const { HttpError, HttpCode } = require('../../src/error-handling/http_error')

describe('ordenController', () => {
    let authToken

    beforeEach(() => {
        authToken = `Bearer ${generateTokenForTesting()}`
    })

    describe('POST /api/ordenes', () => {
        beforeEach(() => {
            // Resetear mocks antes de cada prueba
            ordenService.crearOrden.mockClear()
        })

        it('should create a new order successfully', async () => {
            const ordenData = {
                fecha: '2023-03-15',
                hora: '15:00:00',
                ocupacion: 4,
                items: [
                    { itemMenuId: 1, cantidad: 2, precio: 10.0 },
                    { itemMenuId: 2, cantidad: 1, precio: 15.0 },
                ],
                estado: 'En cocina', // agregado según la lógica del servicio
                paga: false, // agregado según la lógica del servicio
            }

            const expectedResponse = {
                message: 'Orden creada',
                newOrden: {
                    id: 1,
                    fecha: '2023-03-15',
                    hora: '15:00:00',
                    estado: 'En cocina', // estado por defecto
                    ocupacion: 4,
                    items: [
                        { itemMenuId: 1, cantidad: 2, precio: 10.0 },
                        { itemMenuId: 2, cantidad: 1, precio: 15.0 },
                    ],
                    // otros campos según necesidad
                },
            }

            const serviceResponse = {
                id: 1,
                fecha: '2023-03-15',
                hora: '15:00:00',
                estado: 'En cocina', // estado por defecto
                ocupacion: 4,
                items: [
                    { itemMenuId: 1, cantidad: 2, precio: 10.0 },
                    { itemMenuId: 2, cantidad: 1, precio: 15.0 },
                ],
                // otros campos según necesidad
            }

            ordenService.crearOrden.mockResolvedValue(serviceResponse)

            const res = await request(app)
                .post('/api/ordenes')
                .set('Authorization', authToken)
                .send(ordenData)

            expect(res.statusCode).toEqual(201)
            expect(res.body).toEqual(expectedResponse)
            expect(ordenService.crearOrden).toHaveBeenCalledWith(ordenData)
        })

        it('should return an error if required fields are missing', async () => {
            const ordenData = {
                // datos incompletos o incorrectos
            }

            const res = await request(app)
                .post('/api/ordenes')
                .set('Authorization', authToken)
                .send(ordenData)

            expect(res.statusCode).toBeGreaterThanOrEqual(400)
            expect(res.body).toHaveProperty('message')
        })

        // Aquí puedes agregar más pruebas para diferentes escenarios, como datos inválidos, falta de autorización, etc.
    })

    describe('POST /api/ordenes/pagarTodo', () => {
        beforeEach(() => {
            ordenService.pagarTodo.mockClear()
            cajaService.getCajaById.mockResolvedValue({
                id: 1,
                monto: 1000,
                estado: 'Abierta',
            })
            empleadoService.getEmpleadoById.mockResolvedValue({
                id: 1,
                nombre: 'Juan',
                apellido: 'Perez',
                rol: 'Mozo',
            })
            ordenService.getOrdenesByIds.mockResolvedValue([
                {
                    id: 1,
                    fecha: '2021-09-01',
                    hora: '12:00:00',
                    estado: 'En cocina',
                    ocupacion: 4,
                    items: [],
                    paga: false,
                },
                {
                    id: 2,
                    fecha: '2021-09-01',
                    hora: '12:00:00',
                    estado: 'En cocina',
                    ocupacion: 4,
                    items: [],
                    paga: false,
                },
            ])
        })

        it('should process the payment for all orders successfully', async () => {
            const ordenesIds = [1, 2]
            const cajaId = 1
            const empleadoId = 1
            const metodoPago = 'Efectivo'

            // Mocks para caja y empleado
            cajaService.getCajaById.mockResolvedValue({ id: cajaId })
            empleadoService.getEmpleadoById.mockResolvedValue({
                id: empleadoId,
            })

            // Mock para las órdenes existentes
            ordenService.getOrdenesByIds.mockResolvedValue([
                { id: 1, paga: false },
                { id: 2, paga: false },
            ])

            // Mock para el servicio de pagar todo
            ordenService.pagarTodo.mockResolvedValue({
                /* tu respuesta esperada del servicio */
            })

            const res = await request(app)
                .post('/api/ordenes/pagarTodo')
                .set('Authorization', authToken)
                .send({ ordenes: ordenesIds, cajaId, empleadoId, metodoPago })
            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Pagos realizados')
            // Asegúrate de que el objeto con el que se llama a pagarTodo sea el correcto
            expect(ordenService.pagarTodo).toHaveBeenCalledWith(
                expect.objectContaining({
                    ordenesNoPagadas: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(Number),
                            paga: false,
                        }),
                    ]),
                    cajaId,
                    empleadoId,
                    metodoPago,
                    fecha: expect.any(String),
                    hora: expect.any(String),
                })
            )
        })

        //test que devuelva "" throw new HttpError(HttpCode.NOT_FOUND, 'Caja no encontrada')"

        it('should return an error if caja does not exist', async () => {
            const ordenesIds = [1, 2]
            const cajaId = 1
            const empleadoId = 1
            const metodoPago = 'Efectivo'

            cajaService.getCajaById.mockResolvedValue(null)

            const res = await request(app)
                .post('/api/ordenes/pagarTodo')
                .set('Authorization', authToken)
                .send({ ordenes: ordenesIds, cajaId, empleadoId, metodoPago })
            expect(res.statusCode).toEqual(404)
            expect(res.body).toHaveProperty('message', 'Caja no encontrada')
        })

        //test throw new HttpError(HttpCode.NOT_FOUND, 'Empleado no encontrado')
        it('should return an error if empleado does not exist', async () => {
            const ordenesIds = [1, 2]
            const cajaId = 1
            const empleadoId = 1
            const metodoPago = 'Efectivo'

            empleadoService.getEmpleadoById.mockResolvedValue(null)

            const res = await request(app)
                .post('/api/ordenes/pagarTodo')
                .set('Authorization', authToken)
                .send({ ordenes: ordenesIds, cajaId, empleadoId, metodoPago })
            expect(res.statusCode).toEqual(404)
            expect(res.body).toHaveProperty('message', 'Empleado no encontrado')
        })
        /*test para   Iif (ordenesExistentes.length !== ordenes.length) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'Alguna de las ordenes no existe'
            )
        } /*/
        it('should return an error if ordenes does not exist', async () => {
            const ordenesIds = [1, 2]
            const cajaId = 1
            const empleadoId = 1
            const metodoPago = 'Efectivo'

            ordenService.getOrdenesByIds.mockResolvedValue([])

            const res = await request(app)
                .post('/api/ordenes/pagarTodo')
                .set('Authorization', authToken)
                .send({ ordenes: ordenesIds, cajaId, empleadoId, metodoPago })
            expect(res.statusCode).toEqual(404)
            expect(res.body).toHaveProperty(
                'message',
                'Alguna de las ordenes no existe'
            )
        })

        // Otros tests...
    })

    describe('GET /api/ordenes', () => {
        beforeEach(() => {
            // Resetear mocks antes de cada prueba
            ordenService.getOrdenes.mockClear()
        })

        it('should retrieve orders with specific filters', async () => {
            const filterData = {
                page: 1,
                limit: 10,
                empleadoId: 1,
                clienteId: 2,
                estado: 'En cocina',
                mesaId: 3,
                fecha: '2023-03-15',
            }

            const expectedOrders = [
                // ...lista de órdenes esperadas según los filtros...
            ]

            ordenService.getOrdenes.mockResolvedValue(expectedOrders)

            const res = await request(app)
                .get('/api/ordenes')
                .query(filterData)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedOrders)
            expect(ordenService.getOrdenes).toHaveBeenCalledWith(
                expect.objectContaining(filterData)
            )
        })

        // Aquí puedes agregar más pruebas para otros escenarios de filtro
    })

    describe('GET /api/ordenes/caja', () => {
        beforeEach(() => {
            // Resetear mocks antes de cada prueba
            ordenService.getOrdenesCaja.mockClear()
        })

        it('should retrieve orders associated with a specific caja filtered by mesaId', async () => {
            const mesaId = 5 // Ejemplo de mesaId para filtrar
            const expectedOrders = [
                // ...lista de órdenes esperadas asociadas a la caja y filtradas por mesaId...
            ]

            ordenService.getOrdenesCaja.mockResolvedValue(expectedOrders)

            const res = await request(app)
                .get('/api/ordenes/caja')
                .query({ mesaId })
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedOrders)
            expect(ordenService.getOrdenesCaja).toHaveBeenCalledWith({
                mesaId: mesaId,
            })
        })

        // Aquí puedes agregar más pruebas para otros escenarios, como sin mesaId o con diferentes mesaId
    })

    describe('GET /api/ordenes/mozo', () => {
        beforeEach(() => {
            // Resetear mocks antes de cada prueba
            ordenService.getOrdenesMozo.mockClear()
        })

        it('should retrieve orders associated with a specific mozo filtered by mesaId', async () => {
            const mesaId = 3 // Ejemplo de mesaId para filtrar
            const expectedOrders = [
                // ...lista de órdenes esperadas asociadas al mozo y filtradas por mesaId...
            ]

            ordenService.getOrdenesMozo.mockResolvedValue(expectedOrders)

            const res = await request(app)
                .get('/api/ordenes/mozo')
                .query({ mesaId })
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedOrders)
            expect(ordenService.getOrdenesMozo).toHaveBeenCalledWith({
                mesaId: mesaId,
            })
        })

        // Aquí puedes agregar más pruebas para otros escenarios, como sin mesaId o con diferentes mesaId
    })

    describe('GET /api/ordenes/historial', () => {
        // ... Pruebas para obtener el historial de ordenes ...
        beforeEach(() => {
            // Resetear mocks antes de cada prueba
            ordenService.getOrdenesHistorial.mockClear()
        })

        it('should retrieve orders associated with a specific mozo filtered by mesaId', async () => {
            const mesaId = 3 // Ejemplo de mesaId para filtrar
            const expectedOrders = [
                // ...lista de órdenes esperadas asociadas al mozo y filtradas por mesaId...
            ]

            ordenService.getOrdenesHistorial.mockResolvedValue(expectedOrders)

            const res = await request(app)
                .get('/api/ordenes/historial')
                .query({ mesaId })
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedOrders)
            expect(ordenService.getOrdenesHistorial).toHaveBeenCalledWith({
                mesaId: mesaId,
            })
        })

        // Aquí puedes agregar más pruebas para otros escenarios, como sin mesaId o con diferentes mesaId
    })

    describe('GET /api/ordenes/:id', () => {
        beforeEach(() => {
            // Resetear mocks antes de cada prueba
            ordenService.getOrdenById.mockClear()
        })

        it('should retrieve an order by its ID', async () => {
            const orderId = '1' // Ejemplo de ID de orden
            const expectedOrder = {
                // ...datos de la orden esperada...
            }

            ordenService.getOrdenById.mockResolvedValue(expectedOrder)

            const res = await request(app)
                .get(`/api/ordenes/${orderId}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedOrder)
            expect(ordenService.getOrdenById).toHaveBeenCalledWith(orderId)
        })

        it('should return an error when order with specified ID does not exist', async () => {
            const orderId = '999' // Ejemplo de ID inexistente
            ordenService.getOrdenById.mockResolvedValue(null)

            const res = await request(app)
                .get(`/api/ordenes/${orderId}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
            expect(res.body).toHaveProperty('message', 'Orden no encontrada')
        })

        // Aquí puedes agregar más pruebas para diferentes escenarios, como con un ID inválido
    })

    describe('GET /api/ordenes/ocupacion', () => {
        beforeEach(() => {
            // Resetear mocks antes de cada prueba
            ordenService.getCountOcupacion.mockClear()
        })

        it('should retrieve the occupation count', async () => {
            const expectedOcupacion = {
                // ...datos de la ocupación esperada...
            }

            ordenService.getCountOcupacion.mockResolvedValue(expectedOcupacion)

            const res = await request(app)
                .get('/api/ordenes/ocupacion')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedOcupacion)
            expect(ordenService.getCountOcupacion).toHaveBeenCalled()
        })

        // Aquí puedes agregar más pruebas para diferentes escenarios si es necesario
    })

    describe('GET /api/ordenes/:id/estadoPagos', () => {
        beforeEach(() => {
            // Resetear mocks antes de cada prueba
            ordenService.getEstadoPagos.mockClear()
        })

        it('should retrieve the payment status of an order', async () => {
            const orderId = '1'
            const expectedEstadoPagos = {
                // ...datos del estado de los pagos esperados...
            }

            ordenService.getEstadoPagos.mockResolvedValue(expectedEstadoPagos)

            const res = await request(app)
                .get(`/api/ordenes/${orderId}/estadoPagos`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedEstadoPagos)
            expect(ordenService.getEstadoPagos).toHaveBeenCalledWith(orderId)
        })

        // Aquí puedes agregar más pruebas para diferentes escenarios si es necesario
    })

    describe('GET /api/ordenes/infoPagos/general/', () => {
        beforeEach(() => {
            // Resetear mocks antes de cada prueba
            ordenService.infoPagosOrdenes.mockClear()
        })

        it('should retrieve payment information for multiple orders', async () => {
            const ordenIds = [1, 2, 3]
            const expectedPagosInfo = {
                ordenesIds: ordenIds,
                totalGeneralPagado: 300,
                totalGeneralOrden: 500,
                detalles: [
                    // Detalles de los pagos de las órdenes
                ],
            }

            ordenService.infoPagosOrdenes.mockResolvedValue(expectedPagosInfo)

            const res = await request(app)
                .get(`/api/ordenes/infoPagos/general?Ids=${ordenIds.join(',')}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedPagosInfo)
            expect(ordenService.infoPagosOrdenes).toHaveBeenCalledWith(ordenIds)
        })

        // Aquí puedes agregar más pruebas para diferentes escenarios si es necesario
    })

    describe('GET /api/ordenes/estadisticas/ventas', () => {
        beforeEach(() => {
            ordenService.getEstadisticasVentas.mockClear()
        })

        it('should retrieve sales statistics for a specific day', async () => {
            const fecha = '2023-04-01'
            const expectedStats = {
                // Datos esperados de las estadísticas de ventas
            }

            ordenService.getEstadisticasVentas.mockResolvedValue(expectedStats)

            const res = await request(app)
                .get(`/api/ordenes/estadisticas/ventas?dia=${fecha}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedStats)
            expect(ordenService.getEstadisticasVentas).toHaveBeenCalledWith({
                dia: fecha,
            })
        })

        it('should retrieve sales statistics for a specific month', async () => {
            const mes = '4'
            const expectedStats = {
                // Datos esperados de las estadísticas de ventas
            }

            ordenService.getEstadisticasVentas.mockResolvedValue(expectedStats)

            const res = await request(app)
                .get(`/api/ordenes/estadisticas/ventas?mes=${mes}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedStats)
            expect(ordenService.getEstadisticasVentas).toHaveBeenCalledWith({
                mes,
            })
        })

        it('should retrieve sales statistics for a specific year', async () => {
            const anio = '2023'
            const expectedStats = {
                // Datos esperados de las estadísticas de ventas
            }

            ordenService.getEstadisticasVentas.mockResolvedValue(expectedStats)

            const res = await request(app)
                .get(`/api/ordenes/estadisticas/ventas?anio=${anio}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedStats)
            expect(ordenService.getEstadisticasVentas).toHaveBeenCalledWith({
                anio,
            })
        })

        // Aquí puedes agregar más pruebas para diferentes escenarios si es necesario
    })

    describe('GET /api/ordenes/estadisticas/cantOrdenesProcesadas', () => {
        beforeEach(() => {
            ordenService.getCantOrdenesProcesadas.mockClear()
        })

        it('should retrieve the count of processed orders for a specific day', async () => {
            const fecha = '2023-04-01'
            const expectedCount = {
                // Datos esperados de la cantidad de órdenes procesadas
            }

            ordenService.getCantOrdenesProcesadas.mockResolvedValue(
                expectedCount
            )

            const res = await request(app)
                .get(
                    `/api/ordenes/estadisticas/cantOrdenesProcesadas?dia=${fecha}`
                )
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedCount)
            expect(ordenService.getCantOrdenesProcesadas).toHaveBeenCalledWith({
                dia: fecha,
            })
        })

        it('should retrieve the count of processed orders for a specific month', async () => {
            const mes = '4'
            const expectedCount = {
                // Datos esperados de la cantidad de órdenes procesadas
            }

            ordenService.getCantOrdenesProcesadas.mockResolvedValue(
                expectedCount
            )

            const res = await request(app)
                .get(
                    `/api/ordenes/estadisticas/cantOrdenesProcesadas?mes=${mes}`
                )
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedCount)
            expect(ordenService.getCantOrdenesProcesadas).toHaveBeenCalledWith({
                mes,
            })
        })

        it('should retrieve the count of processed orders for a specific year', async () => {
            const anio = '2023'
            const expectedCount = {
                // Datos esperados de la cantidad de órdenes procesadas
            }

            ordenService.getCantOrdenesProcesadas.mockResolvedValue(
                expectedCount
            )

            const res = await request(app)
                .get(
                    `/api/ordenes/estadisticas/cantOrdenesProcesadas?anio=${anio}`
                )
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedCount)
            expect(ordenService.getCantOrdenesProcesadas).toHaveBeenCalledWith({
                anio,
            })
        })

        // Aquí puedes agregar más pruebas para diferentes escenarios si es necesario
    })

    describe('GET /api/ordenes/estadisticas/consumoPorClienteId/:id', () => {
        beforeEach(() => {
            ordenService.getConsumoPorClienteId.mockClear()
        })

        it('should retrieve the consumption for a specific client for a specific day', async () => {
            const clienteId = '1'
            const fecha = '2023-04-01'
            const expectedConsumption = {
                // Datos esperados del consumo del cliente
            }

            ordenService.getConsumoPorClienteId.mockResolvedValue(
                expectedConsumption
            )

            const res = await request(app)
                .get(
                    `/api/ordenes/estadisticas/consumoPorClienteId/1?dia=2023-04-01`
                )
                .set('Authorization', authToken)
            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedConsumption)
            expect(ordenService.getConsumoPorClienteId).toHaveBeenCalledWith(
                clienteId,
                { dia: fecha }
            )
        })

        it('should retrieve the consumption for a specific client for a specific month', async () => {
            const clienteId = '1'
            const mes = '4'
            const expectedConsumption = {
                // Datos esperados del consumo del cliente
            }

            ordenService.getConsumoPorClienteId.mockResolvedValue(
                expectedConsumption
            )

            const res = await request(app)
                .get(`/api/ordenes/estadisticas/consumoPorClienteId/1?mes=4`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedConsumption)
            expect(ordenService.getConsumoPorClienteId).toHaveBeenCalledWith(
                clienteId,
                { mes }
            )
        })

        it('should retrieve the consumption for a specific client for a specific year', async () => {
            const clienteId = '1'
            const anio = '2023'
            const expectedConsumption = {
                // Datos esperados del consumo del cliente
            }

            ordenService.getConsumoPorClienteId.mockResolvedValue(
                expectedConsumption
            )

            const res = await request(app)
                .get(
                    `/api/ordenes/estadisticas/consumoPorClienteId/1?anio=2023`
                )
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedConsumption)
            expect(ordenService.getConsumoPorClienteId).toHaveBeenCalledWith(
                clienteId,
                { anio }
            )
        })

        // Aquí puedes agregar más pruebas para diferentes escenarios si es necesario
    })

    describe('GET /ordenes/estadisticas/consumoClientes', () => {
        beforeEach(() => {
            ordenService.getConsumoClientes.mockClear()
        })

        it('should retrieve the consumption statistics for a specific day', async () => {
            const fecha = '2023-04-01'
            const expectedStatistics = {
                // Datos esperados de las estadísticas de consumo
            }

            ordenService.getConsumoClientes.mockResolvedValue(
                expectedStatistics
            )

            const res = await request(app)
                .get(`/api/ordenes/estadisticas/consumoClientes?dia=2023-04-01`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedStatistics)
            expect(ordenService.getConsumoClientes).toHaveBeenCalledWith({
                dia: fecha,
            })
        })

        it('should retrieve the consumption statistics for a specific month', async () => {
            const mes = '4'
            const expectedStatistics = {
                // Datos esperados de las estadísticas de consumo
            }

            ordenService.getConsumoClientes.mockResolvedValue(
                expectedStatistics
            )

            const res = await request(app)
                .get(`/api/ordenes/estadisticas/consumoClientes?mes=4`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedStatistics)
            expect(ordenService.getConsumoClientes).toHaveBeenCalledWith({
                mes,
            })
        })

        it('should retrieve the consumption statistics for a specific year', async () => {
            const anio = '2023'
            const expectedStatistics = {
                // Datos esperados de las estadísticas de consumo
            }

            ordenService.getConsumoClientes.mockResolvedValue(
                expectedStatistics
            )

            const res = await request(app)
                .get(`/api/ordenes/estadisticas/consumoClientes?anio=2023`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedStatistics)
            expect(ordenService.getConsumoClientes).toHaveBeenCalledWith({
                anio,
            })
        })

        // Aquí puedes agregar más pruebas para diferentes escenarios si es necesario
    })

    describe('GET /api/ordenes/estadisticas/top5Clientes', () => {
        beforeEach(() => {
            ordenService.getTop5Clientes.mockClear()
        })

        it('should retrieve the top 5 clients for a specific day', async () => {
            const fecha = '2023-04-01'
            const expectedTopClientes = {
                // Datos esperados del top 5 clientes
            }

            ordenService.getTop5Clientes.mockResolvedValue(expectedTopClientes)

            const res = await request(app)
                .get(`/api/ordenes/estadisticas/top5Clientes?dia=2023-04-01`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedTopClientes)
            expect(ordenService.getTop5Clientes).toHaveBeenCalledWith({
                dia: fecha,
            })
        })

        // Pruebas adicionales para diferentes filtros (mes, año)...
    })

    describe('GET /api/ordenes/estadisticas/top5ItemsMenu', () => {
        beforeEach(() => {
            ordenService.getTop5ItemsMenu.mockClear()
        })

        it('should retrieve the top 5 menu items for a specific day', async () => {
            const fecha = '2023-04-01'
            const expectedTopItems = {
                // Datos esperados del top 5 items del menú
            }

            ordenService.getTop5ItemsMenu.mockResolvedValue(expectedTopItems)

            const res = await request(app)
                .get(`/api/ordenes/estadisticas/top5ItemsMenu?dia=2023-04-01`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedTopItems)
            expect(ordenService.getTop5ItemsMenu).toHaveBeenCalledWith({
                dia: fecha,
            })
        })

        // Pruebas adicionales para diferentes filtros (mes, año)...
    })

    describe('GET /api/ordenes/estadisticas/horasPico', () => {
        beforeEach(() => {
            ordenService.getHorasPico.mockClear()
        })

        it('should retrieve peak hours for a specific day', async () => {
            const dia = '2023-04-01'
            const expectedHorasPico = {
                // Datos esperados de las horas pico
            }

            ordenService.getHorasPico.mockResolvedValue(expectedHorasPico)

            const res = await request(app)
                .get(`/api/ordenes/estadisticas/horasPico?dia=2023-04-01`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedHorasPico)
            expect(ordenService.getHorasPico).toHaveBeenCalledWith({ dia })
        })

        // Pruebas adicionales si es necesario...
    })

    describe('GET /api/ordenes/estadisticas/ingresoEnMes', () => {
        beforeEach(() => {
            ordenService.getIngresoEnMes.mockClear()
        })

        it('should retrieve income for a specific month', async () => {
            const mes = '4' // Abril
            const expectedIngresos = {
                // Datos esperados de los ingresos en el mes
            }

            ordenService.getIngresoEnMes.mockResolvedValue(expectedIngresos)

            const res = await request(app)
                .get(`/api/ordenes/estadisticas/ingresoEnMes?mes=4`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedIngresos)
            expect(ordenService.getIngresoEnMes).toHaveBeenCalledWith({ mes })
        })

        // Pruebas adicionales para validar el rango del mes...
    })

    describe('GET /api/getIngresoEnAnio', () => {
        // ... Pruebas para obtener ingresos en un año específico ...

        beforeEach(() => {
            ordenService.getIngresoEnAnio.mockClear()
        })

        it('should retrieve income for a specific year', async () => {
            const anio = '2023'
            const expectedIngresos = {
                // Datos esperados de los ingresos en el año
            }

            ordenService.getIngresoEnAnio.mockResolvedValue(expectedIngresos)

            const res = await request(app)
                .get(`/api/ordenes/estadisticas/ingresoEnAnio?anio=2023`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(expectedIngresos)
            expect(ordenService.getIngresoEnAnio).toHaveBeenCalledWith({ anio })
        })
    })

    describe('PUT /api/ordenes/:id', () => {
        beforeEach(() => {
            ordenService.updateOrden.mockClear()
        })

        it('should update an order successfully', async () => {
            const ordenId = '1'
            const updateData = {
                // Datos de actualización de la orden
                estado: 'En cocina',
                empleadoId: 2,
                // otros campos según necesidad
            }

            ordenService.updateOrden.mockResolvedValue([1]) // Suponiendo que 1 registro fue actualizado

            const res = await request(app)
                .put(`/api/ordenes/${ordenId}`)
                .set('Authorization', authToken)
                .send(updateData)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Orden actualizada')
            expect(ordenService.updateOrden).toHaveBeenCalledWith(
                ordenId,
                updateData
            )
        })

        it('should return error if order not found', async () => {
            const ordenId = '99' // ID no existente
            const updateData = {
                // Datos de actualización de la orden
            }

            ordenService.updateOrden.mockResolvedValue([0]) // Ningún registro actualizado

            const res = await request(app)
                .put(`/api/ordenes/${ordenId}`)
                .set('Authorization', authToken)
                .send(updateData)

            expect(res.statusCode).toBeGreaterThanOrEqual(400)
            expect(res.body).toHaveProperty('message')
        })

        // Pruebas adicionales para diferentes escenarios (datos inválidos, falta de autorización, etc.)
    })

    describe('PUT /api/ordenes/:id/mesas', () => {
        beforeEach(() => {
            ordenService.addMesas.mockClear()
        })

        it('should add mesas to an order successfully', async () => {
            const ordenId = '1'
            const mesasToAdd = [2, 3] // IDs de las mesas a agregar

            ordenService.addMesas.mockResolvedValue({
                message: 'Mesas agregadas',
            })

            const res = await request(app)
                .post(`/api/ordenes/1/mesas`)
                .set('Authorization', authToken)
                .send({ mesas: mesasToAdd })

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Mesas agregadas')
            expect(ordenService.addMesas).toHaveBeenCalledWith(
                ordenId,
                mesasToAdd
            )
        })

        it('should return error if order not found', async () => {
            const mesasToAdd = [2, 3]

            ordenService.addMesas.mockRejectedValue(
                new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada')
            )

            const res = await request(app)
                .post(`/api/ordenes/99/mesas`)
                .set('Authorization', authToken)
                .send({ mesas: mesasToAdd })

            expect(res.statusCode).toBeGreaterThanOrEqual(400)
            expect(res.body).toHaveProperty('message', 'Orden no encontrada')
        })

        // Pruebas adicionales para diferentes escenarios (mesas inválidas, falta de autorización, etc.)
    })

    describe('DELETE /api/ordenes/:id/mesas', () => {
        beforeEach(() => {
            ordenService.removeMesas.mockClear()
        })

        it('should remove mesas from an order successfully', async () => {
            const ordenId = '1'
            const mesasToRemove = [2, 3] // IDs de las mesas a remover

            ordenService.removeMesas.mockResolvedValue({
                message: 'Mesas removidas',
            })

            const res = await request(app)
                .delete(`/api/ordenes/1/mesas`)
                .set('Authorization', authToken)
                .send({ mesas: mesasToRemove })

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Mesas removidas')
            expect(ordenService.removeMesas).toHaveBeenCalledWith(
                ordenId,
                mesasToRemove
            )
        })

        it('should return error if order not found', async () => {
            const mesasToRemove = [2, 3]

            ordenService.removeMesas.mockRejectedValue(
                new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada')
            )

            const res = await request(app)
                .delete(`/api/ordenes/99/mesas`)
                .set('Authorization', authToken)
                .send({ mesas: mesasToRemove })

            expect(res.statusCode).toBeGreaterThanOrEqual(400)
            expect(res.body).toHaveProperty('message', 'Orden no encontrada')
        })

        // Pruebas adicionales para diferentes escenarios (mesas inválidas, falta de autorización, etc.)
    })

    describe('POST /api/ordenes/:id/items', () => {
        beforeEach(() => {
            ordenService.addItems.mockClear()
        })

        it('should add items to an order successfully', async () => {
            const ordenId = '1'
            const itemsToAdd = [
                { itemMenuId: 1, cantidad: 2, precio: 10.0 },
                { itemMenuId: 2, cantidad: 1, precio: 15.0 },
            ]

            ordenService.addItems.mockResolvedValue({
                message: 'Items agregados',
            })

            const res = await request(app)
                .post(`/api/ordenes/1/items`)
                .set('Authorization', authToken)
                .send({ items: itemsToAdd })

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Items agregados')
            expect(ordenService.addItems).toHaveBeenCalledWith(ordenId, {
                items: itemsToAdd,
            })
        })

        it('should return error if order not found', async () => {
            const itemsToAdd = [
                { itemMenuId: 1, cantidad: 2, precio: 10.0 },
                { itemMenuId: 2, cantidad: 1, precio: 15.0 },
            ]

            ordenService.addItems.mockRejectedValue(
                new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada')
            )

            const res = await request(app)
                .post(`/api/ordenes/99/items`)
                .set('Authorization', authToken)
                .send({ items: itemsToAdd })

            expect(res.statusCode).toBeGreaterThanOrEqual(400)
            expect(res.body).toHaveProperty('message', 'Orden no encontrada')
        })

        // Pruebas adicionales para diferentes escenarios (items inválidos, falta de autorización, etc.)
    })

    describe('DELETE /api/ordenes/:id/items', () => {
        beforeEach(() => {
            ordenService.removeItems.mockClear()
        })

        it('should remove items from an order successfully', async () => {
            const ordenId = '1'
            const itemsToRemove = [1, 2] // IDs de los items a remover

            ordenService.removeItems.mockResolvedValue({
                message: 'Items removidos',
            })

            const res = await request(app)
                .delete(`/api/ordenes/1/items`)
                .set('Authorization', authToken)
                .send({ items: itemsToRemove })

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Items removidos')
            expect(ordenService.removeItems).toHaveBeenCalledWith(
                ordenId,
                itemsToRemove
            )
        })

        it('should return error if order not found or invalid items provided', async () => {
            const itemsToRemove = [1, 2]

            ordenService.removeItems.mockRejectedValue(
                new HttpError(
                    HttpCode.NOT_FOUND,
                    'Orden no encontrada o items inválidos'
                )
            )

            const res = await request(app)
                .delete(`/api/ordenes/99/items`)
                .set('Authorization', authToken)
                .send({ items: itemsToRemove })

            expect(res.statusCode).toBeGreaterThanOrEqual(400)
            expect(res.body).toHaveProperty(
                'message',
                'Orden no encontrada o items inválidos'
            )
        })

        // Pruebas adicionales para diferentes escenarios (remover items no pertenecientes a la orden, falta de autorización, etc.)
    })

    describe('DELETE /api/ordenes/:id', () => {
        beforeEach(() => {
            ordenService.deleteOrden.mockClear()
        })

        it('should delete an order successfully', async () => {
            const ordenId = '1'

            ordenService.deleteOrden.mockResolvedValue(1) // 1 indica que una orden fue eliminada

            const res = await request(app)
                .delete(`/api/ordenes/${ordenId}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Orden eliminada')
            expect(ordenService.deleteOrden).toHaveBeenCalledWith(ordenId)
        })

        it('should return error if order not found or cannot be deleted', async () => {
            const ordenId = 99 // ID no existente o no se puede eliminar

            ordenService.deleteOrden.mockRejectedValue(
                new HttpError(
                    HttpCode.NOT_FOUND,
                    'Orden no encontrada o no se puede eliminar'
                )
            )

            const res = await request(app)
                .delete(`/api/ordenes/${ordenId}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toBeGreaterThanOrEqual(400)
            expect(res.body).toHaveProperty(
                'message',
                'Orden no encontrada o no se puede eliminar'
            )
        })

        // Pruebas adicionales para diferentes escenarios (orden con pagos asociados, falta de autorización, etc.)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})
