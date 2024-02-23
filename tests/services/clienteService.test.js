const clienteService = require('../../src/services/clienteService')
const clienteRepository = require('../../src/repositories/clienteRepository')

jest.mock('../../src/repositories/clienteRepository')

describe('crearCliente', () => {
    it('should successfully create a new cliente', async () => {
        const mockCliente = {
            nombre: 'Juan',
            apellido: 'Pérez',
            telefono: '123456789',
        }
        clienteRepository.create.mockResolvedValue(mockCliente)
        clienteRepository.findByNombreAndApellido.mockResolvedValue(null)

        const result = await clienteService.crearCliente(
            mockCliente.nombre,
            mockCliente.apellido,
            mockCliente.telefono
        )
        expect(result).toEqual(mockCliente)
    })

    it('should throw an error when cliente with the same nombre and apellido already exists', async () => {
        const mockCliente = {
            nombre: 'Juan',
            apellido: 'Pérez',
            telefono: '123456789',
        }
        clienteRepository.findByNombreAndApellido.mockResolvedValue(mockCliente)

        await expect(
            clienteService.crearCliente(
                mockCliente.nombre,
                mockCliente.apellido,
                mockCliente.telefono
            )
        ).rejects.toThrow(
            'Ya existe un cliente con esa combinación de nombre y apellido'
        )
    })
})

describe('getClientes', () => {
    it('should retrieve a list of clientes', async () => {
        const mockClientes = [
            { id: 1, nombre: 'Juan', apellido: 'Pérez', telefono: '123456789' },
            { id: 2, nombre: 'Ana', apellido: 'Gómez', telefono: '987654321' },
        ]
        clienteRepository.findAll.mockResolvedValue(mockClientes)

        const result = await clienteService.getClientes()
        expect(result).toEqual(mockClientes)
    })
})

describe('getClienteById', () => {
    it('should retrieve a cliente by its ID', async () => {
        const mockCliente = {
            id: 1,
            nombre: 'Juan',
            apellido: 'Pérez',
            telefono: '123456789',
        }
        clienteRepository.getClienteById.mockResolvedValue(mockCliente)

        const result = await clienteService.getClienteById(1)
        expect(result).toEqual(mockCliente)
    })

    it('should return null when the cliente with specified ID does not exist', async () => {
        clienteRepository.getClienteById.mockResolvedValue(null)

        const result = await clienteService.getClienteById(999)
        expect(result).toBeNull()
    })
})

describe('updateCliente', () => {
    it('should update an existing cliente', async () => {
        const mockCliente = {
            nombre: 'Juan',
            apellido: 'Pérez',
            telefono: '123456789',
            cuenta: 200,
        }
        clienteRepository.update.mockResolvedValue([1])
        clienteRepository.findByNombreAndApellido.mockResolvedValue(null)

        const result = await clienteService.updateCliente(
            1,
            mockCliente.nombre,
            mockCliente.apellido,
            mockCliente.telefono,
            mockCliente.cuenta
        )
        expect(result).toEqual([1])
    })

    it('should throw an error when cliente name and apellido already exists in another cliente', async () => {
        const mockCliente = {
            nombre: 'Juan',
            apellido: 'Pérez',
            telefono: '123456789',
            cuenta: 200,
        }
        clienteRepository.findByNombreAndApellido.mockResolvedValue({
            id: 2,
            ...mockCliente,
        })

        await expect(
            clienteService.updateCliente(
                1,
                mockCliente.nombre,
                mockCliente.apellido,
                mockCliente.telefono,
                mockCliente.cuenta
            )
        ).rejects.toThrow(
            'Ya existe un cliente con esa combinación de nombre y apellido'
        )
    })
})

describe('deleteCliente', () => {
    it('should delete a cliente', async () => {
        clienteRepository.deleteCliente.mockResolvedValue(1)

        const result = await clienteService.deleteCliente(1)
        expect(result).toEqual(1)
    })

    it('should handle when the cliente to be deleted does not exist', async () => {
        clienteRepository.deleteCliente.mockResolvedValue(0)

        const result = await clienteService.deleteCliente(999)
        expect(result).toEqual(0)
    })
})
