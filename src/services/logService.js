const logRepository = require('../repositories/logRepository')
const empleadoLogRepository = require('../repositories/empleadoLogRepository')
const itemInventarioRepository = require('../repositories/itemInventarioRepository')
const ordenRepository = require('../repositories/ordenRepository')
const { HttpError, HttpCode } = require('../error-handling/http_error')
const db = require('../models')
const sequelize = db.sequelize

const logService = {
    abrirBotella: async (itemInventarioId, empleadoId) => {
        const transaction = await sequelize.transaction()

        //primero validamos que el itemInventarioId exista
        const itemInventario = await db.ItemInventario.findOne({
            where: {
                id: itemInventarioId,
            },
        })

        if (!itemInventario) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'No se encontró un item de inventario con el id especificado. ( ItemInventarioId: ' +
                    itemInventarioId +
                    ' ))'
            )
        }

        //luego validamos que el empleadoId exista
        const empleado = await db.Empleado.findOne({
            where: {
                id: empleadoId,
            },
        })

        if (!empleado) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'No se encontró un empleado con el id especificado. ( EmpleadoId: ' +
                    empleadoId +
                    ' ))'
            )
        }

        //luego validamos que el itemInventario tenga su atributo "porUnidad" en false, si esta true o null no se puede abrir
        if (
            itemInventario.porUnidad === true ||
            itemInventario.porUnidad === null
        ) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El item de inventario especificado no es de venta por trago. ( ItemInventarioId: ' +
                    itemInventarioId +
                    ' ))'
            )
        }

        //si no alcanza el stock para abrir la botella, no se puede abrir
        if (itemInventario.stock < 1) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'No hay stock suficiente para abrir la botella. ( ItemInventarioId: ' +
                    itemInventarioId +
                    ' ))'
            )
        }

        //si ambos existen y se vende por tragos, primero debemos validar que no exista un log abierto para el itemInventarioId
        const openLog =
            await logRepository.findOpenLogByItemInventarioId(itemInventarioId)
        if (openLog) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'Ya existe un registro de botella abierta para el item de inventario especificado. ( ItemInventarioId: ' +
                    itemInventarioId +
                    ' ))'
            )
        }

        try {
            //descontar el stock del itemInventario
            await itemInventarioRepository.descontarStock(
                itemInventario,
                1,
                transaction
            )
            // Crear el log
            const log = await logRepository.createLog(
                {
                    fechaHoraAbierta: new Date(),
                    itemInventarioId,
                },
                transaction
            )

            // Crear la relación en la tabla intermedia
            await empleadoLogRepository.createEmpleadoLog(
                {
                    empleadoId,
                    logId: log.id,
                },
                transaction
            )

            await transaction.commit()
            return log
        } catch (error) {
            await transaction.rollback()
            throw new HttpError(HttpCode.INTERNAL_SERVER, error.message)
        }
    },

    cerrarBotella: async (itemInventarioId, empleadoId) => {
        const transaction = await sequelize.transaction()

        //primero validamos que el itemInventarioId exista
        const itemInventario = await db.ItemInventario.findOne({
            where: {
                id: itemInventarioId,
            },
        })

        if (!itemInventario) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'No se encontró un item de inventario con el id especificado. ( ItemInventarioId: ' +
                    itemInventarioId +
                    ' ))'
            )
        }

        //luego validamos que el empleadoId exista
        const empleado = await db.Empleado.findOne({
            where: {
                id: empleadoId,
            },
        })

        if (!empleado) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'No se encontró un empleado con el id especificado. ( EmpleadoId: ' +
                    empleadoId +
                    ' ))'
            )
        }

        //luego validamos que el itemInventario tenga su atributo "porUnidad" en false, si esta true o null no se puede cerrar
        if (
            itemInventario.porUnidad === true ||
            itemInventario.porUnidad === null
        ) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El item de inventario especificado no es de venta por trago. ( ItemInventarioId: ' +
                    itemInventarioId +
                    ' ))'
            )
        }

        //si ambos existen y se vende por tragos, primero debemos validar que exista un log abierto para el itemInventarioId
        const openLog =
            await logRepository.findOpenLogByItemInventarioId(itemInventarioId)

        if (!openLog) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'No se encontró un registro de botella abierta para cerrar, para el item de inventario especificado. ( ItemInventarioId: ' +
                    itemInventarioId +
                    ' ))'
            )
        }

        try {
            // Cerrar el log
            const closedLog = await logRepository.closeLog(
                openLog.id,
                new Date(),
                transaction
            )

            // Crear o actualizar la relación en la tabla intermedia si es necesario
            await empleadoLogRepository.createEmpleadoLog(
                {
                    empleadoId,
                    logId: openLog.id,
                },
                transaction
            )

            await transaction.commit()
            return closedLog
        } catch (error) {
            await transaction.rollback()
            throw new HttpError(HttpCode.INTERNAL_SERVER, error.message)
        }
    },

    getLogs: async (itemInventarioId, page = 1, limit = 10) => {
        let transaction
        const itemInventario = await db.ItemInventario.findOne({
            where: {
                id: itemInventarioId,
            },
        })

        if (!itemInventario) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'No se encontró un item de inventario con el id especificado. ( ItemInventarioId: ' +
                    itemInventarioId +
                    ' ))'
            )
        }

        //luego validamos que el itemInventario tenga su atributo "porUnidad" en false, si esta true o null no se puede cerrar
        if (
            itemInventario.porUnidad === true ||
            itemInventario.porUnidad === null
        ) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El item de inventario especificado no es de venta por trago. ( ItemInventarioId: ' +
                    itemInventarioId +
                    ' ))'
            )
        }

        const logs = await logRepository.getLogs(itemInventarioId, page, limit)

        transaction = await sequelize.transaction()

        try {
            // usamos la funcion  getItemsMenuByItemInventarioId: async (itemInventarioId, transaction)  para obtener los itemsmenu del item inventario
            const itemMenu =
                await itemInventarioRepository.getItemsMenuByItemInventarioId(
                    itemInventarioId,
                    transaction
                )

            // Obtenemos los IDs de los ItemMenu relacionados con el ItemInventario
            const itemMenusRelacionados = itemMenu.itemMenus.map(
                (itemMenu) => itemMenu.id
            )

            // Recorrer cada log y obtener las ordenes con items en el rango de fechas
            for (const log of logs.rows) {
                //NOTA IMPORTANTE:
                //PRIMERO:
                //Los logs tienen fechaHoraAbierta y fechaHoraCerrada en formato UTC, pero las ordenes tienen fecha y hora por separado
                //Por lo tanto, para obtener las ordenes con items en el rango de fechas y hora, debemos convertir las fechas de los logs a fecha y hora por separado
                //SEGUNDO:
                //Los logs guardan en zona horaria UTC, es decir 3 horas mas que montevideo.
                //Por lo tanto, para obtener las ordenes con items en el rango de fechas y hora, debemos restar 3 horas a las fechas de los logs
                //Las ordenes siempre tendrán la hora local porque se guardan con la fecha y hora que provee el cliente

                let fechaHoraAbierta = new Date(log.fechaHoraAbierta)
                let fechaHoraCerrada = new Date(log.fechaHoraCerrada)

                // Ajuste para la zona horaria de Montevideo
                // Restamos tres horas en milisegundos (3 horas * 60 minutos * 60 segundos * 1000 milisegundos)
                fechaHoraAbierta = new Date(
                    fechaHoraAbierta.getTime() - 3 * 60 * 60 * 1000
                )
                fechaHoraCerrada = new Date(
                    fechaHoraCerrada.getTime() - 3 * 60 * 60 * 1000
                )

                const fechaAbierta = fechaHoraAbierta
                    .toISOString()
                    .split('T')[0] // formato "2023-11-07"
                const horaAbierta = fechaHoraAbierta
                    .toISOString()
                    .split('T')[1]
                    .slice(0, 8) // formato "16:59:00"

                const fechaCerrada = fechaHoraCerrada
                    .toISOString()
                    .split('T')[0] // formato "2023-11-07"
                const horaCerrada = fechaHoraCerrada
                    .toISOString()
                    .split('T')[1]
                    .slice(0, 8) // formato "16:59:00"

                const ordenesConItems =
                    await ordenRepository.getOrdenesConItemsEntreFechas(
                        fechaAbierta,
                        horaAbierta,
                        fechaCerrada,
                        horaCerrada,
                        transaction
                    )
                let cantTragos = 0 // Esta será la suma de los tragos vendidos

                // Filtrar items y sumar cantidades
                for (const orden of ordenesConItems) {
                    // Filtramos solo los items que pertenecen a los itemMenus relacionados
                    const itemsRelacionados = orden.items.filter((item) =>
                        itemMenusRelacionados.includes(item.itemMenuId)
                    )

                    // Sumamos las cantidades de los items relacionados
                    for (const item of itemsRelacionados) {
                        cantTragos += item.cantidad
                    }
                }

                // Agregar cantTragos al log actual
                log.dataValues.cantTragos = cantTragos
                log.dataValues.fechaAbiertaUy = fechaAbierta // Añade la fecha ajustada a UTC-3
                log.dataValues.horaAbiertaUy = horaAbierta // Añade la hora ajustada a UTC-3
                log.dataValues.fechaCerradaUy = fechaCerrada // Añade la fecha ajustada a UTC-3 (si existe)
                log.dataValues.horaCerradaUy = horaCerrada // Añade la hora ajustada a UTC-3 (si existe)
            }

            await transaction.commit()
            // Devolver los logs actualizados
            return logs
        } catch (error) {
            await transaction.rollback()
            throw new HttpError(HttpCode.INTERNAL_SERVER, error.message)
        }
    },
}

module.exports = logService
