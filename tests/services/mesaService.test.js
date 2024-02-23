const mesaService = require('../../src/services/mesaService')
const mesaRepository = require('../../src/repositories/mesaRepository')

jest.mock('../../src/repositories/mesaRepository')

describe('mesaService', () => {
    beforeEach(() => {
        mesaRepository.create.mockReset()
        mesaRepository.findAll.mockReset()
        mesaRepository.findAllOcupadas.mockReset()
        mesaRepository.findAllLibres.mockReset()
        mesaRepository.getMesaById.mockReset()
        mesaRepository.update.mockReset()
        mesaRepository.deleteMesa.mockReset()
    })

    describe('crearMesa', () => {
        it('should create a mesa successfully', async () => {
            const nroMesa = 1
            const libre = true
            const mockMesa = { id: 1, nroMesa, libre }
            mesaRepository.create.mockResolvedValue(mockMesa)

            const result = await mesaService.crearMesa(nroMesa, libre)
            expect(result).toEqual(mockMesa)
        })

        // Add more tests for error cases
    })

    describe('getMesas', () => {
        it('should retrieve mesas successfully', async () => {
            const mockMesas = [{ id: 1, nroMesa: 1, libre: true }]
            mesaRepository.findAll.mockResolvedValue(mockMesas)

            const result = await mesaService.getMesas()
            expect(result).toEqual(mockMesas)
        })
    })

    describe('getMesasOcupadas', () => {
        it('should retrieve occupied mesas successfully', async () => {
            const mockMesas = [{ id: 1, nroMesa: 1, libre: false }]
            mesaRepository.findAllOcupadas.mockResolvedValue(mockMesas)

            const result = await mesaService.getMesasOcupadas()
            expect(result).toEqual(mockMesas)
        })
    })

    describe('getMesasLibres', () => {
        it('should retrieve free mesas successfully', async () => {
            const mockMesas = [{ id: 1, nroMesa: 1, libre: true }]
            mesaRepository.findAllLibres.mockResolvedValue(mockMesas)

            const result = await mesaService.getMesasLibres()
            expect(result).toEqual(mockMesas)
        })
    })

    describe('getMesaById', () => {
        it('should retrieve a mesa by id successfully', async () => {
            const id = 1
            const mockMesa = { id, nroMesa: 1, libre: true }
            mesaRepository.getMesaById.mockResolvedValue(mockMesa)

            const result = await mesaService.getMesaById(id)
            expect(result).toEqual(mockMesa)
        })
    })

    describe('updateMesa', () => {
        it('should update a mesa successfully', async () => {
            const id = 1
            const nroMesa = 2
            const libre = false
            mesaRepository.update.mockResolvedValue([1]) // Number of rows affected

            const result = await mesaService.updateMesa(id, nroMesa, libre)
            expect(result).toEqual([1])
        })
    })

    describe('deleteMesa', () => {
        it('should delete a mesa successfully', async () => {
            const id = 1
            mesaRepository.deleteMesa.mockResolvedValue(1) // Number of rows affected

            const result = await mesaService.deleteMesa(id)
            expect(result).toEqual(1)
        })
    })
})
