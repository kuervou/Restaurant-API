const categoriaService = require('../../src/services/categoriaService')
const categoriaRepository = require('../../src/repositories/categoriaRepository')

jest.mock('../../src/repositories/categoriaRepository')

describe('deleteCategoria', () => {
    it('should delete a categoria', async () => {
        categoriaRepository.deleteCategoria.mockResolvedValue(1)

        const result = await categoriaService.deleteCategoria(1)
        expect(result).toEqual(1)
    })

    it('should handle when the categoria to be deleted does not exist', async () => {
        categoriaRepository.deleteCategoria.mockResolvedValue(0)

        const result = await categoriaService.deleteCategoria(999)
        expect(result).toEqual(0)
    })
})

describe('updateCategoria', () => {
    it('should update an existing categoria', async () => {
        const mockNombre = 'Electrónica actualizada'
        categoriaRepository.update.mockResolvedValue([1])
        categoriaRepository.findByNombre.mockResolvedValue(null)

        const result = await categoriaService.updateCategoria(1, mockNombre)
        expect(result).toEqual([1])
    })

    it('should throw an error when categoria name already exists in another categoria', async () => {
        const mockNombre = 'Electrónica'
        categoriaRepository.findByNombre.mockResolvedValue({
            id: 2,
            nombre: mockNombre,
        })

        await expect(
            categoriaService.updateCategoria(1, mockNombre)
        ).rejects.toThrow('Ya existe una categoría con ese nombre')
    })
})

describe('getCategoriaById', () => {
    it('should retrieve a categoria by its ID', async () => {
        const mockCategoria = { id: 1, nombre: 'Electrónica' }
        categoriaRepository.getCategoriaById.mockResolvedValue(mockCategoria)

        const result = await categoriaService.getCategoriaById(1)
        expect(result).toEqual(mockCategoria)
    })

    it('should return null when the categoria with specified ID does not exist', async () => {
        categoriaRepository.getCategoriaById.mockResolvedValue(null)

        const result = await categoriaService.getCategoriaById(999)
        expect(result).toBeNull()
    })
})

describe('crearCategoria', () => {
    it('should successfully create a new categoria', async () => {
        const mockNombre = 'Electrónica'
        categoriaRepository.create.mockResolvedValue({
            id: 1,
            nombre: mockNombre,
        })
        categoriaRepository.findByNombre.mockResolvedValue(null)

        const result = await categoriaService.crearCategoria(mockNombre)
        expect(result).toEqual({ id: 1, nombre: mockNombre })
    })

    it('should throw an error when categoria name already exists', async () => {
        const mockNombre = 'Electrónica'
        categoriaRepository.findByNombre.mockResolvedValue({
            id: 2,
            nombre: mockNombre,
        })

        await expect(
            categoriaService.crearCategoria(mockNombre)
        ).rejects.toThrow('Ya existe una categoría con ese nombre')
    })
})

describe('getCategorias', () => {
    it('should retrieve a list of categorias', async () => {
        const mockCategorias = [
            { id: 1, nombre: 'Electrónica' },
            { id: 2, nombre: 'Ropa' },
        ]
        categoriaRepository.findAll.mockResolvedValue(mockCategorias)

        const result = await categoriaService.getCategorias()
        expect(result).toEqual(mockCategorias)
    })
})
