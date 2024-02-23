const movimientoService = require('../../src/services/movimientoService')
const movimientoRepository = require('../../src/repositories/movimientoRepository')
const cajaRepository = require('../../src/repositories/cajaRepository')
const empleadoRepository = require('../../src/repositories/empleadoRepository')
const db = require('../../src/models')

jest.mock('../../src/repositories/movimientoRepository')
jest.mock('../../src/repositories/cajaRepository')
jest.mock('../../src/repositories/empleadoRepository')
jest.mock('../../src/models')

describe('movimientoService', () => {
    beforeEach(() => {
        movimientoRepository.create.mockReset()
        movimientoRepository.findAll.mockReset()
        movimientoRepository.findById.mockReset()
        movimientoRepository.getMovimientosByCajaId.mockReset()
        movimientoRepository.deleteMovimiento.mockReset()
        cajaRepository.getCajaById.mockReset()
        cajaRepository.updateTotal.mockReset()
        empleadoRepository.getEmpleadoById.mockReset()
        db.sequelize.transaction.mockImplementation(() => ({
            commit: jest.fn().mockResolvedValue(null),
            rollback: jest.fn().mockResolvedValue(null),
        }))
    })

    describe('crearMovimiento', () => {
        it('should create a movimiento successfully', async () => {
            const movimientoData = {
                /* ... datos del movimiento ... */
            }
            const mockMovimiento = {
                /* ... datos del movimiento creado ... */
            }
            movimientoRepository.create.mockResolvedValue(mockMovimiento)
            cajaRepository.getCajaById.mockResolvedValue({
                /* ... datos de la caja ... */
            })
            empleadoRepository.getEmpleadoById.mockResolvedValue({
                /* ... datos del empleado ... */
            })

            const result =
                await movimientoService.crearMovimiento(movimientoData)
            expect(result).toEqual(mockMovimiento)
        })

        // Add more tests for error cases
    })

    describe('getMovimientos', () => {
        it('should retrieve movimientos successfully', async () => {
            const options = {
                /* ... opciones de filtrado ... */
            }
            const mockMovimientos = [
                /* ... lista de movimientos ... */
            ]
            movimientoRepository.findAll.mockResolvedValue(mockMovimientos)

            const result = await movimientoService.getMovimientos(options)
            expect(result).toEqual(mockMovimientos)
        })
    })

    describe('getMovimientoById', () => {
        it('should retrieve a movimiento by id successfully', async () => {
            const id = 1
            const mockMovimiento = {
                /* ... datos del movimiento ... */
            }
            movimientoRepository.findById.mockResolvedValue(mockMovimiento)

            const result = await movimientoService.getMovimientoById(id)
            expect(result).toEqual(mockMovimiento)
        })
    })

    describe('getMovimientosByCajaId', () => {
        it('should retrieve movimientos by caja id successfully', async () => {
            const id = 1
            const options = {
                /* ... opciones de filtrado ... */
            }
            const mockMovimientos = [
                /* ... lista de movimientos ... */
            ]
            movimientoRepository.getMovimientosByCajaId.mockResolvedValue(
                mockMovimientos
            )

            const result = await movimientoService.getMovimientosByCajaId(
                id,
                options
            )
            expect(result).toEqual(mockMovimientos)
        })
    })

    describe('deleteMovimiento', () => {
        it('should delete a movimiento successfully', async () => {
            const id = 1
            const mockMovimiento = {
                /* ... datos del movimiento ... */
            }
            movimientoRepository.findById.mockResolvedValue(mockMovimiento)
            cajaRepository.getCajaById.mockResolvedValue({
                /* ... datos de la caja ... */
            })
            movimientoRepository.deleteMovimiento.mockResolvedValue(1) // Number of rows affected

            const result = await movimientoService.deleteMovimiento(id)
            expect(result).toEqual(1)
        })

        // Add more tests for error cases
    })
})
