// src/services/__tests__/compraService.test.js

const compraService = require('../../src/services/compraService')
const compraRepository = require('../../src/repositories/compraRepository')
const empleadoRepository = require('../../src/repositories/empleadoRepository')
const itemInventarioRepository = require('../../src/repositories/itemInventarioRepository')
const db = require('../../src/models')

jest.mock('../../src/repositories/compraRepository')
jest.mock('../../src/repositories/empleadoRepository')
jest.mock('../../src/repositories/itemInventarioRepository')
jest.mock('../../src/models')

describe('compraService', () => {
    beforeEach(() => {
        // Resetea los mocks antes de cada prueba
        jest.clearAllMocks()
    })

    describe('crearCompra', () => {
        it('debe crear una compra exitosamente', async () => {
            // Mockea las dependencias
            empleadoRepository.getEmpleadoById.mockResolvedValue({
                /* datos del empleado */
            })
            itemInventarioRepository.getItemInventarioById.mockResolvedValue({
                /* datos del itemInventario */
            })
            compraRepository.create.mockResolvedValue({
                /* datos de la compra creada */
            })
            db.sequelize.transaction.mockResolvedValue({
                commit: jest.fn(),
                rollback: jest.fn(),
            })

            const data = {
                /* datos de la compra */
            }
            const result = await compraService.crearCompra(data)

            expect(result).toEqual({
                /* datos esperados de la compra */
            })
            // Agrega más expectativas según sea necesario
        })

        it('debe crear una compra exitosamente x casillero', async () => {
            // Mockea las dependencias
            empleadoRepository.getEmpleadoById.mockResolvedValue({
                /* datos del empleado */
            })
            itemInventarioRepository.getItemInventarioById.mockResolvedValue({
                /* datos del itemInventario */
            })
            compraRepository.create.mockResolvedValue({
                /* datos de la compra creada */
            })
            db.sequelize.transaction.mockResolvedValue({
                commit: jest.fn(),
                rollback: jest.fn(),
            })

            const data = {
                /* datos de la compra */ cantxCasillero: 1,
                cantidad: 1,
            }
            const result = await compraService.crearCompra(data)

            expect(result).toEqual({
                /* datos esperados de la compra */
            })
            // Agrega más expectativas según sea necesario
        })

        //empleado no encontrado
        it('debe lanzar un error si el empleado no existe', async () => {
            // Mockea las dependencias
            empleadoRepository.getEmpleadoById.mockResolvedValue(null)

            const data = {
                /* datos de la compra */
            }
            await expect(compraService.crearCompra(data)).rejects.toThrow(
                'Empleado no encontrado'
            )
        })

        //itemInventario no encontrado
        it('debe lanzar un error si el itemInventario no existe', async () => {
            // Mockea las dependencias
            empleadoRepository.getEmpleadoById.mockResolvedValue({
                /* datos del empleado */
            })
            itemInventarioRepository.getItemInventarioById.mockResolvedValue(
                null
            )

            const data = {
                /* datos de la compra */
            }
            await expect(compraService.crearCompra(data)).rejects.toThrow(
                'ItemInventario no encontrado'
            )
        })

        // Agrega más casos de prueba como errores, datos inválidos, etc.
    })

    describe('getCompras', () => {
        it('debe obtener todas las compras', async () => {
            compraRepository.findAll.mockResolvedValue([
                /* Array de compras */
            ])
            const options = {
                /* opciones de filtro */
            }
            const result = await compraService.getCompras(options)

            expect(result).toEqual([
                /* Array esperado de compras */
            ])
            // Agrega más expectativas según sea necesario
        })
    })

    describe('getCompraById', () => {
        it('debe obtener una compra por ID', async () => {
            compraRepository.getCompraById.mockResolvedValue({
                /* datos de una compra */
            })
            const id = 1 // Ejemplo de ID
            const result = await compraService.getCompraById(id)

            expect(result).toEqual({
                /* datos esperados de la compra */
            })
            // Agrega más expectativas según sea necesario
        })
    })

    describe('deleteCompra', () => {
        it('debe eliminar una compra', async () => {
            compraRepository.getCompraById.mockResolvedValue({
                /* datos de la compra */
            })
            itemInventarioRepository.getItemInventarioById.mockResolvedValue({
                /* datos del itemInventario */
            })
            compraRepository.deleteCompra.mockResolvedValue({
                /* confirmación de eliminación */
            })
            db.sequelize.transaction.mockResolvedValue({
                commit: jest.fn(),
                rollback: jest.fn(),
            })

            const id = 1 // Ejemplo de ID
            const result = await compraService.deleteCompra(id)

            expect(result).toEqual({
                /* datos esperados después de la eliminación */
            })
            // Agrega más expectativas según sea necesario
        })

        // Agrega más casos de prueba como errores, compras no encontradas, etc.
    })

    // Agrega pruebas para otros métodos del servicio si los hay
})
