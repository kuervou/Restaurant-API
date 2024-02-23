const grupoService = require('../../src/services/grupoService')
const grupoRepository = require('../../src/repositories/grupoRepository')

jest.mock('../../src/repositories/grupoRepository')

describe('grupoService', () => {
    describe('crearGrupo', () => {
        const mockNombre = 'Grupo Test'
        const mockEsBebida = true

        beforeEach(() => {
            grupoRepository.findByNombre.mockReset()
            grupoRepository.create.mockReset()
        })

        it('should successfully create a new group', async () => {
            grupoRepository.findByNombre.mockResolvedValue(null)
            grupoRepository.create.mockResolvedValue({
                id: 1,
                nombre: mockNombre,
                esBebida: mockEsBebida,
            })

            const result = await grupoService.crearGrupo(
                mockNombre,
                mockEsBebida
            )

            expect(grupoRepository.findByNombre).toHaveBeenCalledWith(
                mockNombre.toLowerCase()
            )
            expect(grupoRepository.create).toHaveBeenCalledWith(
                mockNombre,
                mockEsBebida
            )
            expect(result).toEqual({
                id: 1,
                nombre: mockNombre,
                esBebida: mockEsBebida,
            })
        })

        it('should throw an error when group name already exists', async () => {
            grupoRepository.findByNombre.mockResolvedValue({
                id: 2,
                nombre: mockNombre,
                esBebida: mockEsBebida,
            })

            await expect(
                grupoService.crearGrupo(mockNombre, mockEsBebida)
            ).rejects.toThrow('Ya existe un grupo con ese nombre')

            expect(grupoRepository.findByNombre).toHaveBeenCalledWith(
                mockNombre.toLowerCase()
            )
            expect(grupoRepository.create).not.toHaveBeenCalled()
        })
    })

    describe('getGrupos', () => {
        it('should retrieve a list of groups', async () => {
            const mockGroups = [
                { id: 1, nombre: 'Bebidas', esBebida: true },
                { id: 2, nombre: 'Comidas', esBebida: false },
            ]

            grupoRepository.findAll.mockResolvedValue({
                total: mockGroups.length,
                items: mockGroups,
            })

            const result = await grupoService.getGrupos()
            expect(result.items).toEqual(mockGroups)
            expect(result.total).toEqual(mockGroups.length)
        })
    })

    describe('getGrupoById', () => {
        it('should retrieve a group by its ID', async () => {
            const mockGroup = { id: 1, nombre: 'Bebidas', esBebida: true }

            grupoRepository.getGrupoById.mockResolvedValue(mockGroup)

            const result = await grupoService.getGrupoById(1)
            expect(result).toEqual(mockGroup)
        })

        it('should return null when the group with specified ID does not exist', async () => {
            grupoRepository.getGrupoById.mockResolvedValue(null)

            const result = await grupoService.getGrupoById(999)
            expect(result).toBeNull()
        })
    })

    describe('updateGrupo', () => {
        it('should throw an error when group name already exists in another group', async () => {
            grupoRepository.findByNombre.mockResolvedValue({
                id: 2,
                nombre: 'Otro grupo',
            })

            await expect(
                grupoService.updateGrupo(1, 'Otro grupo', true)
            ).rejects.toThrow('Ya existe un grupo con ese nombre')
        })
    })

    describe('deleteGrupo', () => {
        it('should delete a group', async () => {
            grupoRepository.deleteGrupo.mockResolvedValue(1) // Asumiendo que devuelve el número de filas afectadas

            const result = await grupoService.deleteGrupo(1)
            expect(result).toEqual(1)
        })

        it('should handle when the group to be deleted does not exist', async () => {
            grupoRepository.deleteGrupo.mockResolvedValue(0)

            const result = await grupoService.deleteGrupo(999)
            expect(result).toEqual(0)
        })
    })

    // Aquí vendrían las implementaciones específicas de cada prueba.
})
