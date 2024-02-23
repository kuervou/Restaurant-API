const itemRepository = require('../repositories/itemRepository')
const itemMenuRepository = require('../repositories/itemMenuRepository')
const itemInventarioRepository = require('../repositories/itemInventarioRepository')
const { HttpError, HttpCode } = require('../error-handling/http_error')
const { ESTADOS } = require('../constants/estados/estados')

const itemService = {
    createItemsForOrder: async (data, order, transaction) => {
        const itemsData = data.items
        const items = await Promise.all(
            itemsData.map(async (itemData) => {
                const itemMenu = await itemMenuRepository.getItemMenuById(
                    itemData.itemMenuId
                )
                if (!itemMenu) {
                    throw new HttpError(
                        HttpCode.NOT_FOUND,
                        `ItemMenu with ID ${itemData.itemMenuId} not found`
                    )
                }

                const itemInventarios =
                    await itemMenuRepository.findItemInventarios(itemMenu)
                if (
                    itemInventarios.length === 1 &&
                    itemInventarios[0].porUnidad === true
                ) {
                    //validamos que haya stock suficiente
                    const stock = await itemInventarioRepository.getStock(
                        itemInventarios[0]
                    )
                    if (stock < itemData.cantidad) {
                        throw new HttpError(
                            HttpCode.BAD_REQUEST,
                            `No hay stock suficiente para el item ${itemMenu.nombre}`
                        )
                    }

                    if (order.estado !== ESTADOS.POR_CONFIRMAR) {
                        await itemInventarioRepository.descontarStock(
                            itemInventarios[0],
                            itemData.cantidad,
                            transaction
                        )
                    }
                }

                return await itemRepository.createItem(
                    {
                        ordenId: order.id,
                        itemMenuId: itemData.itemMenuId,
                        cantidad: itemData.cantidad,
                        precio: itemMenu.precio,
                    },
                    transaction
                )
            })
        )

        return items
    },

    // Funcion que dado un conjunto de items, ubicamos su itemMenu asociado y si el itemMenu tiene asociado un unico itemInventario, entonces debemos sumar al stock la cantidad del item
    manejarStockItemsOnCancelar: async (items, transaction) => {
        //ubicamos los items a borrar a partir de su id
        const itemsToQuit = await itemRepository.findItems(items)
        //para cada item a borrar, ubicamos el itemMenu asociado y si el item menu tiene asociado un unico itemInventario, entonces debemos aumentar al stock la cantidad del item
        await Promise.all(
            itemsToQuit.map(async (item) => {
                const itemMenu = await itemMenuRepository.getItemMenuById(
                    item.itemMenuId
                )
                const itemInventarios =
                    await itemMenuRepository.findItemInventarios(itemMenu)
                if (
                    itemInventarios.length === 1 &&
                    itemInventarios[0].porUnidad === true
                ) {
                    await itemInventarioRepository.sumarStock(
                        itemInventarios[0],
                        item.cantidad,
                        transaction
                    )
                }
            })
        )
    },

    // Funcion que dado un conjunto de items, ubicamos su itemMenu asociado y si el itemMenu tiene asociado un unico itemInventario, entonces debemos restar al stock la cantidad del item
    manejarStockItemsOnConfirmar: async (items, transaction) => {
        //ubicamos los items a confirmar a partir de su id
        const itemsToConfirm = await itemRepository.findItems(items)
        //para cada item a confirmar, ubicamos el itemMenu asociado y si el item menu tiene asociado un unico itemInventario, entonces debemos restar al stock la cantidad del item
        await Promise.all(
            itemsToConfirm.map(async (item) => {
                const itemMenu = await itemMenuRepository.getItemMenuById(
                    item.itemMenuId
                )
                const itemInventarios =
                    await itemMenuRepository.findItemInventarios(itemMenu)
                if (
                    itemInventarios.length === 1 &&
                    itemInventarios[0].porUnidad === true
                ) {
                    //antes de descontar el stock, validamos que haya stock suficiente
                    const stock = await itemInventarioRepository.getStock(
                        itemInventarios[0]
                    )
                    if (stock < item.cantidad) {
                        throw new HttpError(
                            HttpCode.BAD_REQUEST,
                            `No hay stock suficiente para el item ${itemMenu.nombre}. Stock disponible: ${stock}`
                        )
                    }
                    await itemInventarioRepository.descontarStock(
                        itemInventarios[0],
                        item.cantidad,
                        transaction
                    )
                }
            })
        )
    },

    // Funcion que dado un conjunto de items, ubicamos su itemMenu asociado y si el itemMenu tiene asociado un unico itemInventario, entonces debemos sumar al stock la cantidad del item
    // Ademas el item es eliminado de la base de datos
    deleteItems: async (items, transaction) => {
        //ubicamos los items a borrar a partir de su id
        const itemsToDelete = await itemRepository.findItems(items)
        //para cada item a borrar, ubicamos el itemMenu asociado y si el item menu tiene asociado un unico itemInventario, entonces debemos sumar al stock la cantidad del item
        await Promise.all(
            itemsToDelete.map(async (item) => {
                const itemMenu = await itemMenuRepository.getItemMenuById(
                    item.itemMenuId
                )
                const itemInventarios =
                    await itemMenuRepository.findItemInventarios(itemMenu)
                if (
                    itemInventarios.length === 1 &&
                    itemInventarios[0].porUnidad === true
                ) {
                    await itemInventarioRepository.sumarStock(
                        itemInventarios[0],
                        item.cantidad,
                        transaction
                    )
                }
            })
        )
        //llamamos al repositorio para borrar los items
        return await itemRepository.deleteItems(items, transaction)
    },
}

module.exports = itemService
