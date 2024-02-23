// src/repositories/ordenRepository.js
const { Orden, Item, Mesa, ItemMenu, Grupo, Cliente } = require('../models')
const { Op, literal, fn, col } = require('sequelize')
const db = require('../models')
const { EXCLUDED_GROUPS } = require('../constants/grupos/grupos')
const { ESTADOS } = require('../constants/estados/estados')

const ordenRepository = {
    createOrden: async (data, transaction) => {
        return await Orden.create(
            {
                fecha: data.fecha,
                hora: data.hora,
                total: data.total,
                responsable: data.responsable,
                estado: data.estado,
                ocupacion: data.ocupacion,
                observaciones: data.observaciones,
                paga: data.paga,
                clienteId: data.clienteId,
                empleadoId: data.empleadoId,
            },
            { transaction }
        )
    },

    handleMesas: async (data, order, transaction) => {
        if (data.mesas) {
            // si se envian mesas, se crean las relaciones con las mesas
            await order.addMesas(data.mesas, { transaction }) //
            //Si el estado de la orden es distinto de ESTADOS.POR_CONFIRMAR hacemos el handle de las mesas
            if (order.estado !== ESTADOS.POR_CONFIRMAR) {
                await Mesa.update(
                    { libre: false },
                    { where: { id: data.mesas }, transaction }
                )
            }
        }
    },

    addMesas: async (orderId, mesas, transaction) => {
        // agregar mesas a la orden y retornar la orden
        const orden = await Orden.findByPk(orderId)
        if (orden) {
            await orden.addMesas(mesas, { transaction })
            await Mesa.update(
                { libre: false },
                { where: { id: mesas }, transaction }
            )
        }

        return orden
    },

    //desvincularMesas, es como removeMesas pero sin cambiar el estado de las mesas
    desvincularMesas: async (orderId, mesas, transaction) => {
        const orden = await Orden.findByPk(orderId)
        if (orden) {
            await orden.removeMesas(mesas, { transaction })
        }

        return orden
    },

    removeMesas: async (orderId, mesas, transaction) => {
        const orden = await Orden.findByPk(orderId)
        if (orden) {
            await orden.removeMesas(mesas, { transaction })
            await Mesa.update(
                { libre: true },
                { where: { id: mesas }, transaction }
            )
        }

        return orden
    },

    getEstadisticasVentasPorDia: async (dia) => {
        //Debemos devolver la suma de los totales de las ordenes cuyo atributo paga sea true
        const totalVentas = await Orden.sum('total', {
            where: {
                fecha: dia,
                paga: true,
            },
        })

        return totalVentas
    },

    getEstadisticasVentas: async (options) => {
        const { fechaInicio, fechaFin } = options

        const totalVentas = await Orden.sum('total', {
            where: {
                fecha: {
                    [Op.between]: [fechaInicio, fechaFin],
                },
                paga: true,
            },
        })

        return totalVentas
    },

    getCantOrdenesProcesadasPorDia: async (dia) => {
        //Debemos devolver la cantidad de ordenes cuyo estado sea ENTREGADA, PARA_ENTREGAR, EN_COCINA, MODIFICADA, FINALIZADA
        const cantOrdenes = await Orden.count({
            where: {
                fecha: dia,
                estado: {
                    [Op.in]: [
                        ESTADOS.ENTREGADA,
                        ESTADOS.PARA_ENTREGAR,
                        ESTADOS.EN_COCINA,
                        ESTADOS.MODIFICADA,
                        ESTADOS.FINALIZADA,
                    ],
                },
            },
        })

        return cantOrdenes
    },

    getCantOrdenesProcesadas: async (options) => {
        const { fechaInicio, fechaFin } = options

        const cantOrdenes = await Orden.count({
            where: {
                fecha: {
                    [Op.between]: [fechaInicio, fechaFin],
                },
                estado: {
                    [Op.in]: [
                        ESTADOS.ENTREGADA,
                        ESTADOS.PARA_ENTREGAR,
                        ESTADOS.EN_COCINA,
                        ESTADOS.MODIFICADA,
                        ESTADOS.FINALIZADA,
                    ],
                },
            },
        })

        return cantOrdenes
    },

    getConsumoPorClienteIdPorDia: async (clienteId, dia) => {
        //Debemos devolver la suma de los totales de las ordenes cuyo atributo paga sea true y el clienteId sea el pasado por parámetro
        const totalConsumo = await Orden.sum('total', {
            where: {
                fecha: dia,
                paga: true,
                clienteId: clienteId,
            },
        })

        return totalConsumo
    },

    getConsumoPorClienteId: async (clienteId, options) => {
        const { fechaInicio, fechaFin } = options

        const totalConsumo = await Orden.sum('total', {
            where: {
                fecha: {
                    [Op.between]: [fechaInicio, fechaFin],
                },
                paga: true,
                clienteId: clienteId,
            },
        })

        return totalConsumo
    },

    getConsumoClientesPorDia: async (dia) => {
        //Debemos devolver la suma de los totales de las ordenes cuyo atributo paga sea true y tengan algun clienteId asociado
        const totalConsumo = await Orden.sum('total', {
            where: {
                fecha: dia,
                paga: true,
                clienteId: {
                    [Op.ne]: null,
                },
            },
        })

        return totalConsumo
    },

    getConsumoClientes: async (options) => {
        const { fechaInicio, fechaFin } = options

        const totalConsumo = await Orden.sum('total', {
            where: {
                fecha: {
                    [Op.between]: [fechaInicio, fechaFin],
                },
                paga: true,
                clienteId: {
                    [Op.ne]: null,
                },
            },
        })

        return totalConsumo
    },

    getTop5ClientesPorDia: async (dia) => {
        const top5Clientes = await Orden.findAll({
            attributes: [
                'clienteId',
                [literal('SUM(`Orden`.`total`)'), 'totalConsumo'],
                [literal('COUNT(`Orden`.`id`)'), 'cantidadOrdenes'],
                [literal('`cliente`.`nombre`'), 'nombreCliente'],
                [literal('`cliente`.`apellido`'), 'apellidoCliente'],
            ],
            include: [
                {
                    model: Cliente,
                    as: 'cliente',
                    attributes: [],
                },
            ],
            where: {
                fecha: dia,
                paga: true,
            },
            group: [
                'clienteId',
                'cliente.id',
                'cliente.nombre',
                'cliente.apellido',
            ],
            order: [[fn('SUM', col('total')), 'DESC']],
            limit: 5,
            subQuery: false,
        })

        return top5Clientes.map((result) => {
            const {
                clienteId,
                totalConsumo,
                cantidadOrdenes,
                nombreCliente,
                apellidoCliente,
            } = result.get({ plain: true })
            return {
                clienteId,
                totalConsumo,
                cantidadOrdenes,
                nombreCliente,
                apellidoCliente,
            }
        })
    },

    getTop5Clientes: async (options) => {
        const { fechaInicio, fechaFin } = options

        const top5Clientes = await Orden.findAll({
            attributes: [
                'clienteId',
                [literal('SUM(`Orden`.`total`)'), 'totalConsumo'],
                [literal('COUNT(`Orden`.`id`)'), 'cantidadOrdenes'],
                [literal('`cliente`.`nombre`'), 'nombreCliente'],
                [literal('`cliente`.`apellido`'), 'apellidoCliente'],
            ],
            include: [
                {
                    model: Cliente,
                    as: 'cliente',
                    attributes: [],
                },
            ],
            where: {
                clienteId: { [Op.ne]: null },
                fecha: {
                    [Op.between]: [fechaInicio, fechaFin],
                },
                paga: true,
            },
            group: [
                'clienteId',
                'cliente.id',
                'cliente.nombre',
                'cliente.apellido',
            ],
            order: [[fn('SUM', col('total')), 'DESC']],
            limit: 5,
            subQuery: false,
        })

        return top5Clientes.map((result) => {
            const {
                clienteId,
                totalConsumo,
                cantidadOrdenes,
                nombreCliente,
                apellidoCliente,
            } = result.get({ plain: true })
            return {
                clienteId,
                totalConsumo,
                cantidadOrdenes,
                nombreCliente,
                apellidoCliente,
            }
        })
    },

    getHorasPico: async (options) => {
        const { dia } = options
        const horasPico = await Orden.findAll({
            attributes: ['hora', [literal('COUNT(hora)'), 'cantidadOrdenes']],
            where: {
                fecha: dia,
                estado: {
                    [Op.in]: [
                        ESTADOS.ENTREGADA,
                        ESTADOS.PARA_ENTREGAR,
                        ESTADOS.EN_COCINA,
                        ESTADOS.MODIFICADA,
                        ESTADOS.FINALIZADA,
                    ],
                },
            },
            group: ['hora'],
            order: [['hora', 'ASC']],
        })

        return horasPico
    },

    getIngresoEnMes: async (options) => {
        const { fechaInicio, fechaFin } = options

        //La idea es que la respuesta mapee los dias del mes con el total de ingresos de ese dia (El total de ingresos es la suma de los totales de las ordenes cuyo atributo paga sea true)

        const ingresoEnMes = await Orden.findAll({
            attributes: [
                'fecha',
                [literal('SUM(total)'), 'totalIngresos'],
                [literal('COUNT(id)'), 'cantidadOrdenes'],
            ],
            where: {
                fecha: {
                    [Op.between]: [fechaInicio, fechaFin],
                },
                paga: true,
            },
            group: ['fecha'],
            order: [['fecha', 'ASC']],
        })

        return ingresoEnMes
    },

    getIngresoEnAnio: async (options) => {
        const { fechaInicio, fechaFin } = options

        //La idea es que la respuesta mapee los meses del año con el total de ingresos de ese mes (El total de ingresos es la suma de los totales de las ordenes cuyo atributo paga sea true)

        const ingresoEnAnio = await Orden.findAll({
            attributes: [
                [literal('MONTH(fecha)'), 'mes'],
                [literal('SUM(total)'), 'totalIngresos'],
                [literal('COUNT(id)'), 'cantidadOrdenes'],
            ],
            where: {
                fecha: {
                    [Op.between]: [fechaInicio, fechaFin],
                },
                paga: true,
            },
            group: ['mes'],
            order: [['mes', 'ASC']],
        })

        return ingresoEnAnio
    },

    getCountOrdenesEnCocinayParaEntregarPorMesaId: async (mesaId) => {
        //Debemos devolver la cantidad de ordenes cuyo estado sea EN_COCINA o PARA_ENTREGAR y que tengan asociada la mesaId pasada por parámetro
        const cantOrdenes = await Orden.count({
            where: {
                estado: {
                    [Op.in]: [ESTADOS.EN_COCINA, ESTADOS.PARA_ENTREGAR],
                },
            },
            include: [
                {
                    model: Mesa,
                    as: 'mesas',
                    where: { id: mesaId },
                    through: { attributes: [] },
                },
            ],
        })

        return cantOrdenes
    },
       


    findAll: async (options = {}) => {
        const {
            page = 1,
            limit = 10,
            fecha,
            empleadoId,
            estado,
            mesaId,
        } = options
        const offset = (page - 1) * limit
        const whereConditions = {}
        if (fecha) {
            whereConditions.fecha = {
                [Op.like]: `%${fecha}%`,
            }
        }
        if (empleadoId) {
            whereConditions.empleadoId = empleadoId
        }
        if (estado) {
            whereConditions.estado = estado
        }

        const include = [
            {
                model: Item,
                as: 'items',
                include: [
                    {
                        model: ItemMenu,
                        as: 'itemMenu',
                        attributes: ['nombre'], // Si sólo quieres el nombre y grupo, si quieres más campos, simplemente agrégales aquí.
                        include: [
                            {
                                model: Grupo,
                                as: 'grupo',
                                attributes: ['nombre', 'esBebida'], // Asumiendo que el campo se llama 'nombre' en el modelo Grupo.
                            },
                        ],
                    },
                ],
            },
            {
                model: db.Cliente,
                as: 'cliente',
            },
            {
                model: db.Empleado,
                as: 'empleado',
            },
        ]

        if (mesaId) {
            include.push({
                model: Mesa,
                as: 'mesas',
                where: { id: mesaId },
                through: { attributes: [] },
            })
        } else {
            include.push({
                model: Mesa,
                as: 'mesas',
                through: { attributes: [] },
            })
        }

        const result = await Orden.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            order: [['fecha', 'DESC']],
            distinct: true,
            include: include,
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },

    findAllCaja: async (options) => {
        const { mesaId } = options
        const whereConditions = {}

        //agregar a la condicion que el estado sea ESTADOS.EN_COCINA, PARA_ENTREGAR, POR_CONFIRMAR
        whereConditions[Op.or] = [
            {
                estado: {
                    [Op.in]: [
                        ESTADOS.EN_COCINA,
                        ESTADOS.PARA_ENTREGAR,
                        ESTADOS.POR_CONFIRMAR,
                    ],
                },
            },
            { estado: ESTADOS.ENTREGADA, paga: false },
        ]

        const include = [
            {
                model: Item,
                as: 'items',
                order: [
                    literal(`CASE 
                        WHEN grupo.nombre = '${EXCLUDED_GROUPS.BEBIDAS}' THEN 1
                        WHEN grupo.nombre = '${EXCLUDED_GROUPS.TRAGOS}' THEN 2
                        ELSE 3 END ASC`),
                ],
                include: [
                    {
                        model: ItemMenu,
                        as: 'itemMenu',
                        attributes: ['nombre'], // Si sólo quieres el nombre y grupo, si quieres más campos, simplemente agrégales aquí.
                        include: [
                            {
                                model: Grupo,
                                as: 'grupo',
                                attributes: ['nombre', 'esBebida'], // Asumiendo que el campo se llama 'nombre' en el modelo Grupo.
                            },
                        ],
                    },
                ],
            },
            {
                model: Mesa,
                as: 'mesas',
            },
            {
                model: db.Cliente,
                as: 'cliente',
            },
            {
                model: db.Empleado,
                as: 'empleado',
            },
        ]

        if (mesaId) {
            include.push({
                model: Mesa,
                as: 'mesas',
                where: { id: mesaId },
                through: { attributes: [] },
            })
        }

        const result = await Orden.findAndCountAll({
            where: whereConditions,
            order: [
                [
                    literal(`
                    CASE 
                        WHEN estado = '${ESTADOS.POR_CONFIRMAR}' THEN 1 
                        WHEN estado = '${ESTADOS.PARA_ENTREGAR}' THEN 2 
                        ELSE 3 
                    END
                `),
                    'ASC',
                ],
                ['fecha', 'DESC'],
            ],
            distinct: true,
            include: include,
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },

    findAllMozo: async (options) => {
        const { mesaId } = options

        const whereConditions = {}

        //agregar a la condicion que el estado sea ESTADOS.EN_COCINA, PARA_ENTREGAR, MODIFICADA
        whereConditions[Op.or] = [
            {
                estado: {
                    [Op.in]: [
                        ESTADOS.EN_COCINA,
                        ESTADOS.PARA_ENTREGAR,
                        ESTADOS.MODIFICADA,
                    ],
                },
            },
        ]

        const include = [
            {
                model: Item,
                as: 'items',
                include: [
                    {
                        model: ItemMenu,
                        as: 'itemMenu',
                        attributes: ['nombre'], // Si sólo quieres el nombre y grupo, si quieres más campos, simplemente agrégales aquí.
                        include: [
                            {
                                model: Grupo,
                                as: 'grupo',
                                attributes: ['nombre', 'esBebida'], // Asumiendo que el campo se llama 'nombre' en el modelo Grupo.
                            },
                        ],
                    },
                ],
            },
            {
                model: db.Cliente,
                as: 'cliente',
            },
            {
                model: db.Empleado,
                as: 'empleado',
            },
        ]

        if (mesaId) {
            include.push({
                model: Mesa,
                as: 'mesas',
                where: { id: mesaId },
                through: { attributes: [] },
            })
        }

        const result = await Orden.findAndCountAll({
            where: whereConditions,
            order: [
                [
                    literal(`
                    CASE 
                        WHEN estado = '${ESTADOS.PARA_ENTREGAR}' THEN 1
                        WHEN estado = '${ESTADOS.EN_COCINA}' THEN 2 
                        WHEN estado = '${ESTADOS.MODIFICADA}' THEN 3
                        ELSE 4
                    END
                `),
                    'ASC',
                ],
                ['fecha', 'DESC'],
            ],
            distinct: true,
            include: include,
        })
        return {
            total: result.count,
            items: result.rows,
        }
    },

    findAllHistorial: async (options) => {
        const { mesaId } = options
        const whereConditions = {}

        whereConditions[Op.or] = [
            {
                estado: {
                    [Op.in]: [
                        ESTADOS.FINALIZADA,
                        ESTADOS.CANCELADA,
                        ESTADOS.MODIFICADA,
                    ],
                },
            },
            { estado: ESTADOS.ENTREGADA, paga: true },
        ]

        const include = [
            {
                model: Item,
                as: 'items',
                order: [
                    literal(`CASE 
                        WHEN grupo.nombre = '${EXCLUDED_GROUPS.BEBIDAS}' THEN 1
                        WHEN grupo.nombre = '${EXCLUDED_GROUPS.TRAGOS}' THEN 2
                        ELSE 3 END ASC`),
                ],
                include: [
                    {
                        model: ItemMenu,
                        as: 'itemMenu',
                        attributes: ['nombre'], // Si sólo quieres el nombre y grupo, si quieres más campos, simplemente agrégales aquí.
                        include: [
                            {
                                model: Grupo,
                                as: 'grupo',
                                attributes: ['nombre', 'esBebida'], // Asumiendo que el campo se llama 'nombre' en el modelo Grupo.
                            },
                        ],
                    },
                ],
            },
            {
                model: Mesa,
                as: 'mesas',
            },
            {
                model: db.Cliente,
                as: 'cliente',
            },
            {
                model: db.Empleado,
                as: 'empleado',
            },
        ]

        if (mesaId) {
            include.push({
                model: Mesa,
                as: 'mesas',
                where: { id: mesaId },
                through: { attributes: [] },
            })
        }

        const result = await Orden.findAndCountAll({
            where: whereConditions,
            order: [
                [
                    literal(`
                    CASE 
                        WHEN estado = '${ESTADOS.POR_CONFIRMAR}' THEN 1 
                        WHEN estado = '${ESTADOS.PARA_ENTREGAR}' THEN 2 
                        ELSE 3 
                    END
                `),
                    'ASC',
                ],
                ['fecha', 'DESC'],
            ],
            distinct: true,
            include: include,
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },

    update: async (orderId, data, transaction) => {
        return await Orden.update(data, {
            where: {
                id: orderId,
            },
            transaction,
        })
    },

    countOcupacion: async () => {
        // Obteniendo la suma de ocupación para los estados deseados
        const totalOcupacion = await Orden.sum('ocupacion', {
            where: {
                estado: {
                    [Op.in]: [
                        ESTADOS.ENTREGADA,
                        ESTADOS.PARA_ENTREGAR,
                        ESTADOS.EN_COCINA,
                    ],
                },
            },
        })

        return totalOcupacion
    },

    deleteOrden: async (id) => {
        //la orden se elimina logicamente, es decir se cambia el estado a ESTADOS.CANCELADA
        return await Orden.update(
            { estado: ESTADOS.CANCELADA },
            { where: { id: id } }
        )
    },
    findById: async (id, transaction) => {
        return await Orden.findByPk(id, { transaction })
    },
    getOrdenById: async (id) => {
        return await Orden.findByPk(id, {
            include: [
                {
                    model: Item,
                    as: 'items',
                },
            ],
        })
    },

    getOrdenesByIds: async (ids) => {
        return await Orden.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
        })
    },

    getItemsOrden: async (id) => {
        return await Orden.findByPk(id, {
            include: [
                {
                    model: Item,
                    as: 'items',
                },
            ],
        })
    },

    updatePaga: async (id, paga, transaction) => {
        return await Orden.update(
            { paga: paga },
            {
                where: {
                    id: id,
                },
                transaction,
            }
        )
    },

    //función getOrdenesConItemsEntreFechas
    getOrdenesConItemsEntreFechas: async (
        fechaDesde,
        horaDesde,
        fechaHasta,
        horaHasta,
        transaction
    ) => {
        return await Orden.findAll({
            where: {
                fecha: {
                    [Op.between]: [fechaDesde, fechaHasta],
                },
                hora: {
                    [Op.gte]: horaDesde,
                    [Op.lte]: horaHasta,
                },
                estado: {
                    [Op.in]: [
                        ESTADOS.FINALIZADA,
                        ESTADOS.ENTREGADA,
                        ESTADOS.PARA_ENTREGAR,
                    ],
                },
            },
            include: [
                {
                    model: Item,
                    as: 'items',
                },
            ],
            transaction,
        })
    },
}

module.exports = ordenRepository
