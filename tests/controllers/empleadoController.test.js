const request = require('supertest')
const { app } = require('../../src/app') // Asegúrate de que esta ruta sea correcta.
const empleadoService = require('../../src/services/empleadoService')
jest.mock('../../src/services/empleadoService')
const { generateTokenForTesting } = require('../utils')

describe('empleadoController', () => {
    let authToken

    beforeEach(() => {
        authToken = `Bearer ${generateTokenForTesting()}`
    })

    describe('POST /api/empleados', () => {
        it('should create a new empleado', async () => {
            const empleadoData = {
                nick: 'juan123',
                nombre: 'Juan',
                apellido: 'Perez',
                password: 'password123',
                telefono: '099088977',
                rol: 'Admin',
            }

            empleadoService.crearEmpleado.mockResolvedValue(null) // Asume que el servicio no devuelve nada en caso de éxito

            const res = await request(app)
                .post('/api/empleados')
                .set('Authorization', authToken)
                .send(empleadoData)

            expect(res.statusCode).toEqual(201)
            expect(res.body).toHaveProperty('message', 'Empleado creado')
            expect(empleadoService.crearEmpleado).toHaveBeenCalledWith(
                empleadoData.nick,
                empleadoData.nombre,
                empleadoData.apellido,
                empleadoData.password,
                empleadoData.telefono,
                empleadoData.rol
            )
        })

        // ... Agrega más pruebas para casos de error, como datos inválidos ...
    })

    describe('GET /api/empleados', () => {
        it('should retrieve a list of empleados with pagination', async () => {
            const mockEmpleados = [
                {
                    /* Datos del primer empleado */ id: 1,
                    nick: 'juan123',
                    nombre: 'Juan',
                    apellido: 'Perez',
                    telefono: '099088977',
                    rol: 'Admin',
                    activo: true,
                },
                {
                    /* Datos del segundo empleado */ id: 2,
                    nick: 'maria123',
                    nombre: 'Maria',
                    apellido: 'Gomez',
                    telefono: '099088977',
                    rol: 'Admin',
                    activo: true,
                },
                // ... más empleados ...
            ]
            empleadoService.getEmpleados.mockResolvedValue({
                empleados: mockEmpleados,
                total: mockEmpleados.length,
                page: 1,
                limit: 10,
            })

            const res = await request(app)
                .get('/api/empleados?page=1&limit=10')
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('empleados')
            expect(res.body.empleados.length).toBeLessThanOrEqual(10)
            expect(empleadoService.getEmpleados).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                nick: '',
                rol: '',
                nombre: '',
                apellido: '',
            })
        })

        // ... Agrega pruebas adicionales para otros filtros y casos de error ...
    })

    describe('GET /api/empleados/:id', () => {
        it('should retrieve a specific empleado by ID', async () => {
            const empleadoId = '1'
            const mockEmpleado = {
                /* Datos del empleado */ id: empleadoId,
                nick: 'juan123',
                nombre: 'Juan',
                apellido: 'Perez',
                telefono: '099088977',
                rol: 'Admin',
                activo: true,
            }

            empleadoService.getEmpleadoById.mockResolvedValue(mockEmpleado)

            const res = await request(app)
                .get(`/api/empleados/${empleadoId}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(mockEmpleado)
            expect(empleadoService.getEmpleadoById).toHaveBeenCalledWith(
                empleadoId
            )
        })

        it('should return an error when empleado with specified ID does not exist', async () => {
            const empleadoId = '999'
            empleadoService.getEmpleadoById.mockResolvedValue(null)

            const res = await request(app)
                .get(`/api/empleados/${empleadoId}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
            expect(res.body).toHaveProperty('message', 'Empleado no encontrado')
            expect(empleadoService.getEmpleadoById).toHaveBeenCalledWith(
                empleadoId
            )
        })
    })

    describe('PUT /api/empleados/:id', () => {
        it('should update an empleado', async () => {
            const empleadoId = '1'
            const updateData = {
                /* Datos para actualizar */
                nick: 'juan123',
                nombre: 'Juan',
                apellido: 'Perez',
            }
            empleadoService.updateEmpleado.mockResolvedValue([1]) // Asume que la respuesta es la cantidad de registros actualizados

            const res = await request(app)
                .put(`/api/empleados/${empleadoId}`)
                .set('Authorization', authToken)
                .send(updateData)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Empleado actualizado')
            expect(empleadoService.updateEmpleado).toHaveBeenCalledWith(
                empleadoId,
                updateData.nick,
                updateData.nombre,
                updateData.apellido,
                updateData.password,
                updateData.telefono,
                updateData.rol,
                updateData.activo
            )
        })

        it('should return an error when empleado to update does not exist', async () => {
            const empleadoId = '999'
            const updateData = {
                /* Datos para actualizar */
                nick: 'juan123',
                nombre: 'Juan',
                apellido: 'Perez',
            }
            empleadoService.updateEmpleado.mockResolvedValue([0])

            const res = await request(app)
                .put(`/api/empleados/${empleadoId}`)
                .set('Authorization', authToken)
                .send(updateData)

            expect(res.statusCode).toEqual(404)
            expect(res.body).toHaveProperty('message', 'Empleado no encontrado')
            expect(empleadoService.updateEmpleado).toHaveBeenCalledWith(
                empleadoId,
                updateData.nick,
                updateData.nombre,
                updateData.apellido,
                updateData.password,
                updateData.telefono,
                updateData.rol,
                updateData.activo
            )
        })
    })

    describe('DELETE /api/empleados/:id', () => {
        it('should delete an empleado', async () => {
            const empleadoId = '1'
            empleadoService.deleteEmpleado.mockResolvedValue(1)

            const res = await request(app)
                .delete(`/api/empleados/${empleadoId}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Empleado desactivado')
            expect(empleadoService.deleteEmpleado).toHaveBeenCalledWith(
                empleadoId
            )
        })

        it('should return an error when empleado to delete does not exist', async () => {
            const empleadoId = '999'
            empleadoService.deleteEmpleado.mockResolvedValue(0)

            const res = await request(app)
                .delete(`/api/empleados/${empleadoId}`)
                .set('Authorization', authToken)

            expect(res.statusCode).toEqual(404)
            expect(res.body).toHaveProperty('message', 'Empleado no encontrado')
            expect(empleadoService.deleteEmpleado).toHaveBeenCalledWith(
                empleadoId
            )
        })
    })

    describe('POST /api/login', () => {
        it('should successfully login an empleado and return a token', async () => {
            const credentials = { nick: 'pipe', password: 'password123' }
            //mockear respuesta del service.

            const mockEmpleado = {
                /* Datos del empleado */ id: 6,
                nick: 'pipe',
                nombre: 'Felipe',
                apellido: 'Prince',
                telefono: '34526789',
                rol: 'Admin',
                activo: true,
            }
            empleadoService.authenticate.mockResolvedValue(mockEmpleado)

            const res = await request(app).post('/api/login').send(credentials)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('token')
            expect(res.body.empleado).toEqual(
                expect.objectContaining({
                    id: mockEmpleado.id,
                    nick: mockEmpleado.nick,
                    nombre: mockEmpleado.nombre,
                    apellido: mockEmpleado.apellido,
                    telefono: mockEmpleado.telefono,
                    rol: mockEmpleado.rol,
                    activo: mockEmpleado.activo,
                })
            )
            expect(empleadoService.authenticate).toHaveBeenCalledWith(
                credentials.nick,
                credentials.password
            )
        })

        it('should return an error if credentials are incorrect', async () => {
            const credentials = { nick: 'juan123', password: 'wrongPassword' }
            empleadoService.authenticate.mockResolvedValue(null)

            const res = await request(app).post('/api/login').send(credentials)

            expect(res.statusCode).toEqual(401)
            expect(res.body).toHaveProperty(
                'message',
                'Usuario o contraseña incorrecta'
            )
        })

        //Se desea loguear un usuario que no esta activo
        it('should return an error if the user is not active', async () => {
            const credentials = { nick: 'juan123', password: 'password123' }
            const mockEmpleado = {
                /* Datos del empleado */ id: 6,
                nick: 'pipe',
                nombre: 'Felipe',
                apellido: 'Prince',
                telefono: '34526789',
                rol: 'Admin',
                activo: false,
            }
            empleadoService.authenticate.mockResolvedValue(mockEmpleado)

            const res = await request(app).post('/api/login').send(credentials)

            expect(res.statusCode).toEqual(401)
            expect(res.body).toHaveProperty('message', 'Usuario no está activo')
        })

        // ... Agrega pruebas adicionales para casos como usuario inactivo ...
    })

    describe('PUT /api/resetPassword/:id', () => {
        it('should successfully reset the password of an empleado', async () => {
            const empleadoId = '1'
            const passwordData = {
                currentPassword: 'oldPassword123',
                newPassword: 'newPassword123',
            }
            empleadoService.authenticateById.mockResolvedValue({
                /* datos del empleado */ id: empleadoId,
                nick: 'juan123',
                nombre: 'Juan',
                apellido: 'Perez',
                telefono: '099088977',
                rol: 'Admin',
                activo: true,
            })
            empleadoService.resetPassword.mockResolvedValue(1)

            const res = await request(app)
                .patch(`/api/resetPassword/${empleadoId}`)
                .set('Authorization', authToken)
                .send(passwordData)

            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('message', 'Contraseña actualizada')
            expect(empleadoService.authenticateById).toHaveBeenCalledWith(
                empleadoId,
                passwordData.currentPassword
            )
            expect(empleadoService.resetPassword).toHaveBeenCalledWith(
                empleadoId,
                passwordData.newPassword
            )
        })

        it('should return an error if the current password is incorrect', async () => {
            const empleadoId = '1'
            const passwordData = {
                currentPassword: 'wrongPassword',
                newPassword: 'newPassword123',
            }
            empleadoService.authenticateById.mockResolvedValue(null)

            const res = await request(app)
                .patch(`/api/resetPassword/${empleadoId}`)
                .set('Authorization', authToken)
                .send(passwordData)

            expect(res.statusCode).toEqual(401)
            expect(res.body).toHaveProperty(
                'message',
                'Contraseña actual incorrecta'
            )
        })
        //Test donde no se envia la contraseña actual
        it('should return an error if the current password is not sent', async () => {
            const empleadoId = '1'
            const passwordData = { newPassword: 'newPassword123' }
            empleadoService.authenticateById.mockResolvedValue(null)

            const res = await request(app)
                .patch(`/api/resetPassword/${empleadoId}`)
                .set('Authorization', authToken)
                .send(passwordData)

            expect(res.statusCode).toEqual(400)
            expect(res.body).toHaveProperty(
                'message',
                '"currentPassword" is required'
            )
        })

        //Test donde no se envia la nueva contraseña
        it('should return an error if the new password is not sent', async () => {
            const empleadoId = '1'
            const passwordData = { currentPassword: 'oldPassword123' }
            empleadoService.authenticateById.mockResolvedValue(null)

            const res = await request(app)
                .patch(`/api/resetPassword/${empleadoId}`)
                .set('Authorization', authToken)
                .send(passwordData)

            expect(res.statusCode).toEqual(400)
            expect(res.body).toHaveProperty(
                'message',
                '"newPassword" is required'
            )
        })

        // ... Agrega pruebas adicionales para otros casos de error ...
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})
