const itemService = require('../../src/services/itemService')
const itemRepository = require('../../src/repositories/itemRepository')
const itemMenuRepository = require('../../src/repositories/itemMenuRepository')
const itemInventarioRepository = require('../../src/repositories/itemInventarioRepository')

jest.mock('../../src/repositories/itemRepository')
jest.mock('../../src/repositories/itemMenuRepository')
jest.mock('../../src/repositories/itemInventarioRepository')

describe('createItemsForOrder', () => {
    // Datos de prueba
    const mockData = { items: [{ itemMenuId: 1, cantidad: 2 }] }
    const mockOrder = { id: 1, estado: 'POR_CONFIRMAR' }
    const mockItemMenu = { id: 1, nombre: 'Item Menu', precio: 100 }
    const mockItemInventario = { id: 1, porUnidad: true }

    beforeEach(() => {
        itemMenuRepository.getItemMenuById.mockReset()
        itemMenuRepository.findItemInventarios.mockReset()
        itemInventarioRepository.getStock.mockReset()
        itemInventarioRepository.descontarStock.mockReset()
        itemRepository.createItem.mockReset()
    })

    it('should create items for order successfully', async () => {
        itemMenuRepository.getItemMenuById.mockResolvedValue(mockItemMenu)
        itemMenuRepository.findItemInventarios.mockResolvedValue([
            mockItemInventario,
        ])
        itemInventarioRepository.getStock.mockResolvedValue(10) // Supongamos que hay suficiente stock
        itemRepository.createItem.mockResolvedValue({
            id: 1,
            ...mockData.items[0],
            precio: mockItemMenu.precio,
        })

        const result = await itemService.createItemsForOrder(
            mockData,
            mockOrder,
            null
        )
        expect(result).toHaveLength(1)
        expect(result[0]).toHaveProperty('id')
        expect(itemRepository.createItem).toHaveBeenCalled()
    })

    // Aquí puedes agregar pruebas para manejar casos de error, como cuando no hay stock suficiente o el itemMenu no se encuentra.
})

describe('manejarStockItemsOnCancelar', () => {
    const mockItems = [{ id: 1, itemMenuId: 1, cantidad: 2 }]

    beforeEach(() => {
        itemRepository.findItems.mockReset()
        itemMenuRepository.getItemMenuById.mockReset()
        itemMenuRepository.findItemInventarios.mockReset()
        itemInventarioRepository.sumarStock.mockReset()
    })

    it('should handle stock items on cancel correctly', async () => {
        itemRepository.findItems.mockResolvedValue(mockItems)
        itemMenuRepository.getItemMenuById.mockResolvedValue({
            id: 1,
            nombre: 'Item Menu',
        })
        itemMenuRepository.findItemInventarios.mockResolvedValue([
            { id: 1, porUnidad: true },
        ])
        itemInventarioRepository.sumarStock.mockResolvedValue(null)

        await itemService.manejarStockItemsOnCancelar(mockItems, null)
        expect(itemInventarioRepository.sumarStock).toHaveBeenCalled()
    })

    // Aquí puedes agregar pruebas adicionales para manejar casos específicos.
})

/*
Pruebas para manejarStockItemsOnConfirmar
Similar a las pruebas para manejarStockItemsOnCancelar, pero enfocándote en el proceso de confirmación y en los casos donde pueda haber un error debido a stock insuficiente.
*/

describe('manejarStockItemsOnConfirmar', () => {
    const mockItems = [{ id: 1, itemMenuId: 1, cantidad: 2 }]

    beforeEach(() => {
        itemRepository.findItems.mockReset()
        itemMenuRepository.getItemMenuById.mockReset()
        itemMenuRepository.findItemInventarios.mockReset()
        itemInventarioRepository.descontarStock.mockReset()
    })

    it('should handle stock items on confirm correctly', async () => {
        itemRepository.findItems.mockResolvedValue(mockItems)
        itemMenuRepository.getItemMenuById.mockResolvedValue({
            id: 1,
            nombre: 'Item Menu',
        })
        itemMenuRepository.findItemInventarios.mockResolvedValue([
            { id: 1, porUnidad: true },
        ])
        itemInventarioRepository.descontarStock.mockResolvedValue(null)

        await itemService.manejarStockItemsOnConfirmar(mockItems, null)
        expect(itemInventarioRepository.descontarStock).toHaveBeenCalled()
    })

    // Aquí puedes agregar pruebas adicionales para manejar casos específicos.
})

describe('deleteItems', () => {
    const mockItems = [{ id: 1, itemMenuId: 1, cantidad: 2 }]

    beforeEach(() => {
        itemRepository.findItems.mockReset()
        itemMenuRepository.getItemMenuById.mockReset()
        itemMenuRepository.findItemInventarios.mockReset()
        itemInventarioRepository.sumarStock.mockReset()
        itemRepository.deleteItems.mockReset()
    })

    it('should delete items and manage stock correctly', async () => {
        itemRepository.findItems.mockResolvedValue(mockItems)
        itemMenuRepository.getItemMenuById.mockResolvedValue({
            id: 1,
            nombre: 'Item Menu',
        })
        itemMenuRepository.findItemInventarios.mockResolvedValue([
            { id: 1, porUnidad: true },
        ])
        itemInventarioRepository.sumarStock.mockResolvedValue(null)
        itemRepository.deleteItems.mockResolvedValue(1)

        const result = await itemService.deleteItems(mockItems, null)
        expect(result).toEqual(1)
        expect(itemInventarioRepository.sumarStock).toHaveBeenCalled()
        expect(itemRepository.deleteItems).toHaveBeenCalledWith(mockItems, null)
    })

    // Agregar pruebas para manejar casos de error.
})
