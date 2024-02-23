const movimientoRepository = require('../repositories/movimientoRepository')
const { HttpError, HttpCode } = require('../error-handling/http_error')
const { MOVIMIENTOS } = require('../constants/movimientos/movimientos')
const cajaRepository = require('../repositories/cajaRepository')
const empleadoRepository = require('../repositories/empleadoRepository')

const db = require('../models')
const sequelize = db.sequelize

const movimientoService = {
    crearMovimiento: async (movimientoData) => {
        // Iniciar transacción
        const transaction = await sequelize.transaction()

        try {
            // Validar que el empleado y caja existen
            const empleado = await empleadoRepository.getEmpleadoById(
                movimientoData.empleadoId
            )
            const caja = await cajaRepository.getCajaById(movimientoData.cajaId)

            if (!empleado) {
                throw new HttpError(
                    HttpCode.BAD_REQUEST,
                    'Empleado no encontrado'
                )
            }

            if (!caja) {
                throw new HttpError(HttpCode.BAD_REQUEST, 'Caja no encontrada')
            }

            // Aumentar o disminuir el total de la caja
            let nuevoTotal = caja.total
            if (movimientoData.tipo === MOVIMIENTOS.INGRESO) {
                nuevoTotal += movimientoData.total
            } else if (movimientoData.tipo === MOVIMIENTOS.RETIRO) {
                nuevoTotal -= movimientoData.total
            }

            await cajaRepository.updateTotal(caja.id, nuevoTotal, transaction)

            // Crear el movimiento
            const nuevoMovimiento = await movimientoRepository.create(
                movimientoData,
                transaction
            )

            // Si todo está bien, confirmar la transacción
            await transaction.commit()

            return nuevoMovimiento
        } catch (error) {
            // Si hay algún error, revertir la transacción
            await transaction.rollback()
            throw error
        }
    },

    getMovimientos: async function (options = {}) {
        return await movimientoRepository.findAll(options)
    },

    getMovimientoById: async (id) => {
        return await movimientoRepository.findById(id)
    },

    getMovimientosByCajaId: async (id, options) => {
        return await movimientoRepository.getMovimientosByCajaId(id, options)
    },

    deleteMovimiento: async (id) => {
        //cuando se elimina el movimiento debemos actualizar el total de la caja
        // Iniciar transacción
        const transaction = await sequelize.transaction()

        try {
            // Obtener el movimiento
            const movimiento = await movimientoRepository.findById(id)

            if (!movimiento) {
                throw new HttpError(
                    HttpCode.NOT_FOUND,
                    'Movimiento no encontrado'
                )
            }

            // Obtener la caja
            const caja = await cajaRepository.getCajaById(movimiento.cajaId)

            if (!caja) {
                throw new HttpError(HttpCode.BAD_REQUEST, 'Caja no encontrada')
            }

            // Actualizar el total de la caja
            let nuevoTotal = caja.total
            if (movimiento.tipo === MOVIMIENTOS.INGRESO) {
                nuevoTotal -= movimiento.total
            } else if (movimiento.tipo === MOVIMIENTOS.RETIRO) {
                nuevoTotal += movimiento.total
            }

            await cajaRepository.updateTotal(caja.id, nuevoTotal, transaction)

            // Eliminar el movimiento
            const resultado = await movimientoRepository.deleteMovimiento(
                id,
                transaction
            )

            // Si todo está bien, confirmar la transacción
            await transaction.commit()

            return resultado
        } catch (error) {
            // Si hay algún error, revertir la transacción
            await transaction.rollback()
            throw error
        }
    },
}

module.exports = movimientoService
