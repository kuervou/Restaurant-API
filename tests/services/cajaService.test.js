const cajaService = require('../../src/services/cajaService')
const cajaRepository = require('../../src/repositories/cajaRepository')

jest.mock('../../src/repositories/cajaRepository')

describe('deleteCaja', () => {
    it('should delete a caja', async () => {
        cajaRepository.deleteCaja.mockResolvedValue(1) // Asumiendo que devuelve el número de filas afectadas

        const result = await cajaService.deleteCaja(1)
        expect(result).toEqual(1)
        expect(cajaRepository.deleteCaja).toHaveBeenCalledWith(1)
    })

    it('should handle when the caja to be deleted does not exist', async () => {
        cajaRepository.deleteCaja.mockResolvedValue(0)

        const result = await cajaService.deleteCaja(999)
        expect(result).toEqual(0)
    })
})

describe('updateCaja', () => {
    it('should update an existing caja', async () => {
        const mockTotal = 150
        cajaRepository.update.mockResolvedValue([1]) // Asumiendo que devuelve el número de filas afectadas

        const result = await cajaService.updateCaja(1, mockTotal)
        expect(result).toEqual([1])
        expect(cajaRepository.update).toHaveBeenCalledWith(1, mockTotal)
    })
})

describe('getCajaById', () => {
    it('should retrieve a caja by its ID', async () => {
        const mockCaja = { id: 1, total: 100 }
        cajaRepository.getCajaById.mockResolvedValue(mockCaja)

        const result = await cajaService.getCajaById(1)
        expect(result).toEqual(mockCaja)
    })

    it('should return null when the caja with specified ID does not exist', async () => {
        cajaRepository.getCajaById.mockResolvedValue(null)

        const result = await cajaService.getCajaById(999)
        expect(result).toBeNull()
    })
})

describe('getCajas', () => {
    it('should retrieve a list of cajas', async () => {
        const mockCajas = [
            { id: 1, total: 100 },
            { id: 2, total: 200 },
        ]
        cajaRepository.findAll.mockResolvedValue(mockCajas)

        const result = await cajaService.getCajas()
        expect(result).toEqual(mockCajas)
    })
})

describe('crearCaja', () => {
    it('should successfully create a new caja', async () => {
        const mockTotal = 100
        cajaRepository.create.mockResolvedValue({ id: 1, total: mockTotal })

        const result = await cajaService.crearCaja(mockTotal)
        expect(result).toEqual({ id: 1, total: mockTotal })
        expect(cajaRepository.create).toHaveBeenCalledWith(mockTotal)
    })
})
