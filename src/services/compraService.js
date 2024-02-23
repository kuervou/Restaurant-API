// src/services/compraService.js

const compraRepository = require('../repositories/compraRepository')
const empleadoRepository = require('../repositories/empleadoRepository')
const itemInventarioRepository = require('../repositories/itemInventarioRepository')
const { HttpError, HttpCode } = require('../error-handling/http_error')
const db = require('../models')
const sequelize = db.sequelize

const compraService = {
    crearCompra: async (data) => {
        // Iniciar transacción
        const transaction = await sequelize.transaction()
        try {
            //Validar que el empleado y el itemInventario existen
            const empleado = await empleadoRepository.getEmpleadoById(
                data.empleadoId
            )
            const itemInventario =
                await itemInventarioRepository.getItemInventarioById(
                    data.itemInventarioId
                )
            if (!empleado) {
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    'Empleado no encontrado'
                )
            }
            if (!itemInventario) {
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    'ItemInventario no encontrado'
                )
            }

            //declaramos una varibale total que procederemos a calcular mas adelante
            let total = 0
            //Lo primero que hacemos es fijarnos si el campo cantidadxCasillero está presente o no

            //Si no hay quiere decir que es una compra por unidad (data.cantidad representa las unidades), procedemos a actualizar el stock del itemInventario
            if (!data.cantidadxCasillero) {
                await itemInventarioRepository.sumarStock(
                    itemInventario,
                    data.cantidad,
                    transaction
                )
                total = data.cantidad * itemInventario.costo
            }
            //Si no es null quiere decir que es una compra por casillero (data.cantidad representa la cantidad de casilleros), procedemos a actualizar el stock del itemInventario
            else {
                let cantidadUnidades = data.cantidadxCasillero * data.cantidad
                await itemInventarioRepository.sumarStock(
                    itemInventario,
                    cantidadUnidades,
                    transaction
                )
                total = cantidadUnidades * itemInventario.costo
            }

            //Actualizamos el total de la compra
            data.total = total

            const nuevaCompra = await compraRepository.create(data, transaction)

            await transaction.commit()

            return nuevaCompra
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    },

    getCompras: async function (options = {}) {
        return await compraRepository.findAll(options)
    },

    getCompraById: async (id) => {
        return await compraRepository.getCompraById(id)
    },

    deleteCompra: async (id) => {
        // Iniciar transacción
        const transaction = await sequelize.transaction()
        try {
            const compra = await compraRepository.getCompraById(id)
            if (!compra) {
                throw new HttpError(HttpCode.NOT_FOUND, 'Compra no encontrada')
            }

            const itemInventario =
                await itemInventarioRepository.getItemInventarioById(
                    compra.itemInventarioId
                )
            if (!itemInventario) {
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    'ItemInventario no encontrado'
                )
            }

            //Lo primero que hacemos es fijarnos si el campo cantidadxCasillero es null o no

            //Si es null quiere decir que es una compra por unidad (data.cantidad representa las unidades), procedemos a actualizar el stock del itemInventario
            if (compra.cantidadxCasillero === null) {
                await itemInventarioRepository.descontarStock(
                    itemInventario,
                    compra.cantidad,
                    transaction
                )
            }
            //Si no es null quiere decir que es una compra por casillero (data.cantidad representa la cantidad de casilleros), procedemos a actualizar el stock del itemInventario
            else {
                let cantidadUnidades =
                    compra.cantidadxCasillero * compra.cantidad
                await itemInventarioRepository.descontarStock(
                    itemInventario,
                    cantidadUnidades,
                    transaction
                )
            }

            await compraRepository.deleteCompra(id, transaction)

            await transaction.commit()

            return compra
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    },
}

module.exports = compraService
