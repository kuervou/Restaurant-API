// src/controllers/ordenController.js
const ordenService = require('../services/ordenService')
const cajaService = require('../services/cajaService')
const empleadoService = require('../services/empleadoService')
const asyncHandler = require('express-async-handler')
const { HttpError, HttpCode } = require('../error-handling/http_error')
const jwt = require('jsonwebtoken')
const { ROLES } = require('../constants/roles/roles')
const { ESTADOS } = require('../constants/estados/estados')

const ordenController = {
    crearOrden: asyncHandler(async (req, res) => {
        const data = req.body
        //Analizar el token para determinar que rol tiene el usuario que hace la peticion
        const token = req.header('Authorization')
            ? req.header('Authorization').replace('Bearer ', '')
            : null

        if (token) {
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            const rol = decoded.rol

            if (rol === ROLES.ADMIN || rol === ROLES.MOZO) {
                if (data.estado && data.estado == ESTADOS.ENTREGADA) {
                    data.estado = ESTADOS.ENTREGADA
                    data.paga = false
                } else {
                    data.estado = ESTADOS.EN_COCINA
                    data.paga = false
                }
            } else {
                data.estado = ESTADOS.POR_CONFIRMAR
                data.paga = false
            }
        } else {
            data.estado = ESTADOS.POR_CONFIRMAR
            data.paga = false
        }

        const newOrden = await ordenService.crearOrden(data)

        const io = req.io // Socket.io
        io.emit('fetchOrdenes', { message: 'Orden creada' }) // Emitir evento para actualizar la lista de ordenes

        res.status(HttpCode.CREATED).json({
            message: 'Orden creada',
            newOrden,
        })
    }),

    pagarTodo: asyncHandler(async (req, res) => {
        // Primero obtenemos el array de Ids de las ordenes a pagar del body
        const ordenes = req.body.ordenes

        //tambien debemos obtener la cajaId y el empleadoId
        const cajaId = req.body.cajaId
        const empleadoId = req.body.empleadoId

        //Por ultimo obtenemos metodoPago del body
        const metodoPago = req.body.metodoPago

        //validamos que la caja exista
        const caja = await cajaService.getCajaById(cajaId)

        if (!caja) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Caja no encontrada')
        }

        //validamos que el empleado exista
        const empleado = await empleadoService.getEmpleadoById(empleadoId)

        if (!empleado) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Empleado no encontrado')
        }

        //validamos que las ordenes existan
        const ordenesExistentes = await ordenService.getOrdenesByIds(ordenes)

        if (ordenesExistentes.length !== ordenes.length) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'Alguna de las ordenes no existe'
            )
        }

        //filtramos aquellas ordenes que ya esten pagadas, y nos quedamos con las que no
        const ordenesNoPagadas = ordenesExistentes.filter(
            (orden) => orden.paga === false
        )

        //si no hay ordenes para pagar, devolvemos un error
        if (ordenesNoPagadas.length === 0) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'No hay ordenes para pagar'
            )
        }

        //Fecha y hora actual

        const ahora = new Date()

        const fecha = `${ahora.getFullYear()}-${String(
            ahora.getMonth() + 1
        ).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`

        const hora = `${String(ahora.getHours()).padStart(2, '0')}:${String(
            ahora.getMinutes()
        ).padStart(2, '0')}:${String(ahora.getSeconds()).padStart(2, '0')}`

        //Enviamos a una funcion de orden Service toda la informacion dentro de un objeto

        const pagoData = {
            fecha,
            hora,
            metodoPago,
            cajaId,
            empleadoId,
            ordenesNoPagadas,
        }

        const pagos = await ordenService.pagarTodo(pagoData)

        const io = req.io // Socket.io

        io.emit('fetchOrdenes', { message: 'Pagos realizados' }) // Emitir evento para actualizar la lista de ordenes

        res.status(HttpCode.OK).json({
            message: 'Pagos realizados',
            pagos,
        })
    }),

    getOrdenes: asyncHandler(async (req, res) => {
        const { page, limit, empleadoId, clienteId, estado, mesaId, fecha } =
            req.query

        const options = {}
        if (page) options.page = +page
        if (limit) options.limit = +limit
        if (empleadoId) options.empleadoId = +empleadoId
        if (clienteId) options.clienteId = +clienteId
        if (estado) options.estado = estado
        if (mesaId) options.mesaId = +mesaId
        if (fecha) options.fecha = fecha

        const ordenes = await ordenService.getOrdenes(options)

        res.json(ordenes)
    }),

    getOrdenesCaja: asyncHandler(async (req, res) => {
        const { mesaId } = req.query

        const options = {}

        if (mesaId) options.mesaId = +mesaId

        const ordenes = await ordenService.getOrdenesCaja(options)

        res.json(ordenes)
    }),

    getOrdenesMozo: asyncHandler(async (req, res) => {
        const { mesaId } = req.query

        const options = {}

        if (mesaId) options.mesaId = +mesaId

        const ordenes = await ordenService.getOrdenesMozo(options)

        res.json(ordenes)
    }),

    getOrdenesHistorial: asyncHandler(async (req, res) => {
        const { mesaId } = req.query

        const options = {}

        if (mesaId) options.mesaId = +mesaId

        const ordenes = await ordenService.getOrdenesHistorial(options)

        res.json(ordenes)
    }),

    getOrdenById: asyncHandler(async (req, res) => {
        const id = req.params.id

        const orden = await ordenService.getOrdenById(id)

        if (!orden) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada')
        }

        res.status(HttpCode.OK).json(orden)
    }),

    getCountOcupacion: asyncHandler(async (req, res) => {
        const ocupacion = await ordenService.getCountOcupacion()
        res.status(HttpCode.OK).json(ocupacion)
    }),

    getEstadoPagos: asyncHandler(async (req, res) => {
        const id = req.params.id
        const estadoPagos = await ordenService.getEstadoPagos(id)
        res.status(HttpCode.OK).json(estadoPagos)
    }),

    infoPagosOrdenes: asyncHandler(async (req, res) => {
        let ids = req.query.Ids

        // Si es una cadena, divídela y convierte cada elemento en un número
        if (typeof ids === 'string') {
            ids = ids.split(',').map((id) => {
                const parsedId = parseInt(id, 10)
                if (isNaN(parsedId)) {
                    // Maneja el caso de que el ID no sea un número válido
                    throw new HttpError(
                        HttpCode.BAD_REQUEST,
                        'ID de orden no válido'
                    )
                }
                return parsedId
            })
        }
        const estadosPagos = await ordenService.infoPagosOrdenes(ids)
        res.status(HttpCode.OK).json(estadosPagos)
    }),

    getEstadisticasVentas: asyncHandler(async (req, res) => {
        //obtener parametros de la query
        const { dia, mes, anio } = req.query

        //crear objeto con los parametros
        const options = {}
        if (dia) options.dia = dia
        if (mes) options.mes = mes
        if (anio) options.anio = anio

        //Validamos que haya enviado al menos un parametro
        if (!dia && !mes && !anio) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'Debe enviar al menos un parametro'
            )
        }

        //Validamos que solo haya enviado un parametro, sino es bad request
        if (
            (dia && mes) ||
            (dia && anio) ||
            (mes && anio) ||
            (dia && mes && anio)
        ) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'Solo puede enviar un parametro'
            )
        }
        //mes debe ser un numero entre 1 y 12
        if (mes && (mes < 1 || mes > 12)) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El mes debe ser un numero entre 1 y 12'
            )
        }

        //anio debe ser un numero entre 2020 y 2050
        if (anio && (anio < 2020 || anio > 2050)) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El año debe ser un numero entre 2020 y 2050'
            )
        }

        //obtener estadisticas
        const estadisticas = await ordenService.getEstadisticasVentas(options)
        res.status(HttpCode.OK).json(estadisticas)
    }),

    getCantOrdenesProcesadas: asyncHandler(async (req, res) => {
        //obtener parametros de la query
        const { dia, mes, anio } = req.query

        //crear objeto con los parametros
        const options = {}
        if (dia) options.dia = dia
        if (mes) options.mes = mes
        if (anio) options.anio = anio

        //Validamos que haya enviado al menos un parametro
        if (!dia && !mes && !anio) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'Debe enviar al menos un parametro'
            )
        }

        //Validamos que solo haya enviado un parametro, sino es bad request
        if (
            (dia && mes) ||
            (dia && anio) ||
            (mes && anio) ||
            (dia && mes && anio)
        ) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'Solo puede enviar un parametro'
            )
        }

        //mes debe ser un numero entre 1 y 12
        if (mes && (mes < 1 || mes > 12)) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El mes debe ser un numero entre 1 y 12'
            )
        }

        //anio debe ser un numero entre 2020 y 2050
        if (anio && (anio < 2020 || anio > 2050)) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El año debe ser un numero entre 2020 y 2050'
            )
        }

        //obtener estadisticas
        const estadisticas =
            await ordenService.getCantOrdenesProcesadas(options)
        res.status(HttpCode.OK).json(estadisticas)
    }),

    getConsumoPorClienteId: asyncHandler(async (req, res) => {
        //obtener parametros de la query
        const { dia, mes, anio } = req.query
        const id = req.params.id

        //crear objeto con los parametros
        const options = {}

        if (dia) options.dia = dia
        if (mes) options.mes = mes
        if (anio) options.anio = anio

        //Validamos que haya enviado al menos un parametro
        if (!dia && !mes && !anio) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'Debe enviar al menos un parametro'
            )
        }

        //Validamos que solo haya enviado un parametro, sino es bad request
        if (
            (dia && mes) ||
            (dia && anio) ||
            (mes && anio) ||
            (dia && mes && anio)
        ) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'Solo puede enviar un parametro'
            )
        }

        //mes debe ser un numero entre 1 y 12
        if (mes && (mes < 1 || mes > 12)) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El mes debe ser un numero entre 1 y 12'
            )
        }

        //anio debe ser un numero entre 2020 y 2050
        if (anio && (anio < 2020 || anio > 2050)) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El año debe ser un numero entre 2020 y 2050'
            )
        }

        //obtener estadisticas
        const estadisticas = await ordenService.getConsumoPorClienteId(
            id,
            options
        )
        res.status(HttpCode.OK).json(estadisticas)
    }),

    getConsumoClientes: asyncHandler(async (req, res) => {
        //obtener parametros de la query
        const { dia, mes, anio } = req.query

        //crear objeto con los parametros
        const options = {}

        if (dia) options.dia = dia
        if (mes) options.mes = mes
        if (anio) options.anio = anio

        //Validamos que haya enviado al menos un parametro
        if (!dia && !mes && !anio) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'Debe enviar al menos un parametro'
            )
        }

        //Validamos que solo haya enviado un parametro, sino es bad request
        if (
            (dia && mes) ||
            (dia && anio) ||
            (mes && anio) ||
            (dia && mes && anio)
        ) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'Solo puede enviar un parametro'
            )
        }

        //mes debe ser un numero entre 1 y 12
        if (mes && (mes < 1 || mes > 12)) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El mes debe ser un numero entre 1 y 12'
            )
        }

        //anio debe ser un numero entre 2020 y 2050
        if (anio && (anio < 2020 || anio > 2050)) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El año debe ser un numero entre 2020 y 2050'
            )
        }

        //obtener estadisticas
        const estadisticas = await ordenService.getConsumoClientes(options)
        res.status(HttpCode.OK).json(estadisticas)
    }),

    getTop5Clientes: asyncHandler(async (req, res) => {
        //obtener parametros de la query
        const { dia, mes, anio } = req.query

        //crear objeto con los parametros
        const options = {}

        if (dia) options.dia = dia
        if (mes) options.mes = mes
        if (anio) options.anio = anio

        //Validamos que haya enviado al menos un parametro
        if (!dia && !mes && !anio) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'Debe enviar al menos un parametro'
            )
        }

        //Validamos que solo haya enviado un parametro, sino es bad request
        if (
            (dia && mes) ||
            (dia && anio) ||
            (mes && anio) ||
            (dia && mes && anio)
        ) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'Solo puede enviar un parametro'
            )
        }

        //mes debe ser un numero entre 1 y 12
        if (mes && (mes < 1 || mes > 12)) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El mes debe ser un numero entre 1 y 12'
            )
        }

        //anio debe ser un numero entre 2020 y 2050
        if (anio && (anio < 2020 || anio > 2050)) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El año debe ser un numero entre 2020 y 2050'
            )
        }

        //obtener estadisticas
        const estadisticas = await ordenService.getTop5Clientes(options)

        res.status(HttpCode.OK).json(estadisticas)
    }),

    getTop5ItemsMenu: asyncHandler(async (req, res) => {
        //obtener parametros de la query
        const { dia, mes, anio } = req.query

        //crear objeto con los parametros
        const options = {}

        if (dia) options.dia = dia
        if (mes) options.mes = mes
        if (anio) options.anio = anio

        //Validamos que haya enviado al menos un parametro
        if (!dia && !mes && !anio) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'Debe enviar al menos un parametro'
            )
        }

        //Validamos que solo haya enviado un parametro, sino es bad request
        if (
            (dia && mes) ||
            (dia && anio) ||
            (mes && anio) ||
            (dia && mes && anio)
        ) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'Solo puede enviar un parametro'
            )
        }

        //mes debe ser un numero entre 1 y 12
        if (mes && (mes < 1 || mes > 12)) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El mes debe ser un numero entre 1 y 12'
            )
        }

        //anio debe ser un numero entre 2020 y 2050
        if (anio && (anio < 2020 || anio > 2050)) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El año debe ser un numero entre 2020 y 2050'
            )
        }

        //obtener estadisticas
        const estadisticas = await ordenService.getTop5ItemsMenu(options)
        res.status(HttpCode.OK).json(estadisticas)
    }),

    getHorasPico: asyncHandler(async (req, res) => {
        //obtener parametros de la query
        const { dia } = req.query

        //crear objeto con los parametros
        const options = {}

        if (dia) options.dia = dia

        //obtener estadisticas
        const estadisticas = await ordenService.getHorasPico(options)
        res.status(HttpCode.OK).json(estadisticas)
    }),

    getIngresoEnMes: asyncHandler(async (req, res) => {
        //obtener parametros de la query
        const { mes } = req.query

        //crear objeto con los parametros
        const options = {}

        if (mes) options.mes = mes

        //validamos que el mes sea un numero entre 1 y 12
        if (mes && (mes < 1 || mes > 12)) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El mes debe ser un numero entre 1 y 12'
            )
        }

        //obtener estadisticas
        const estadisticas = await ordenService.getIngresoEnMes(options)
        res.status(HttpCode.OK).json(estadisticas)
    }),

    getIngresoEnAnio: asyncHandler(async (req, res) => {
        //obtener parametros de la query
        const { anio } = req.query

        //crear objeto con los parametros
        const options = {}

        if (anio) options.anio = anio

        //validamos que el anio sea un numero entre 2020 y 2050
        if (anio && (anio < 2020 || anio > 2050)) {
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                'El año debe ser un numero entre 2020 y 2050'
            )
        }

        //obtener estadisticas
        const estadisticas = await ordenService.getIngresoEnAnio(options)
        res.status(HttpCode.OK).json(estadisticas)
    }),

    updateOrden: asyncHandler(async (req, res) => {
        const id = req.params.id
        const data = req.body

        const result = await ordenService.updateOrden(id, data)

        if (result[0] === 0) {
            // Si la cantidad de registros actualizados es 0
            throw new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada')
        }
        const io = req.io // Socket.io
        io.emit('fetchOrdenes', { message: 'Orden actualizada' })
        res.status(HttpCode.OK).json({ message: 'Orden actualizada' })
    }),

    addMesas: asyncHandler(async (req, res) => {
        const id = req.params.id
        const mesas = req.body.mesas

        const orden = await ordenService.addMesas(id, mesas)

        if (!orden) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada')
        }

        const io = req.io // Socket.io
        io.emit('fetchOrdenes', { message: 'Orden actualizada' }) // Emitir evento para actualizar la lista de ordenes

        res.status(HttpCode.OK).json({ message: 'Mesas agregadas' })
    }),

    removeMesas: asyncHandler(async (req, res) => {
        const id = req.params.id
        const mesas = req.body.mesas

        const orden = await ordenService.removeMesas(id, mesas)

        if (!orden) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada')
        }

        const io = req.io // Socket.io
        io.emit('fetchOrdenes', { message: 'Orden actualizada' }) // Emitir evento para actualizar la lista de ordenes

        res.status(HttpCode.OK).json({ message: 'Mesas removidas' })
    }),

    addItems: asyncHandler(async (req, res) => {
        const id = req.params.id
        const data = req.body

        const orden = await ordenService.addItems(id, data)

        if (!orden) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada')
        }

        const io = req.io // Socket.io
        io.emit('fetchOrdenes', { message: 'Orden actualizada' }) // Emitir evento para actualizar la lista de ordenes

        res.status(HttpCode.OK).json({ message: 'Items agregados' })
    }),

    removeItems: asyncHandler(async (req, res) => {
        const id = req.params.id
        const items = req.body.items

        const orden = await ordenService.removeItems(id, items)

        if (!orden) {
            throw new HttpError(
                HttpCode.NOT_FOUND,
                'Algo salió mal, revisa los valores enviados'
            )
        }

        const io = req.io // Socket.io
        io.emit('fetchOrdenes', { message: 'Orden actualizada' }) // Emitir evento para actualizar la lista de ordenes

        res.status(HttpCode.OK).json({ message: 'Items removidos' })
    }),

    deleteOrden: asyncHandler(async (req, res) => {
        const id = req.params.id

        const resultado = await ordenService.deleteOrden(id)

        if (resultado === 0) {
            throw new HttpError(HttpCode.NOT_FOUND, 'Orden no encontrada')
        }

        const io = req.io // Socket.io
        io.emit('fetchOrdenes', { message: 'Orden eliminada' }) // Emitir evento para actualizar la lista de ordenes

        res.status(HttpCode.OK).json({ message: 'Orden eliminada' })
    }),
}

module.exports = ordenController
