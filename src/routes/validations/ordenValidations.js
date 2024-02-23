const Joi = require('joi')
const { METODOSPAGO } = require('../../constants/metodosPago/metodosPago')

const ESTADOS = require('../../constants/estados/estados')
/*
Una entrada tipica para el create puede ser:

{
    "fecha": "2023-10-16",
    "hora": "14:30",
    "responsable": "John Doe",
    "estado": "En Proceso",
    "ocupacion": 4,
    "observaciones": "Sin especias",
    "paga": true,
    "clienteId": 5,
    "empleadoId": 3,
    "items": [
        {
            "itemMenuId": 1,
            "cantidad": 2,
            "precio": 20.50
        },
        {
            "itemMenuId": 2,
            "cantidad": 1,
            "precio": 10.00
        }
    ],
    "mesas": [1, 4, 5]
}
*/

const ordenSchema = Joi.object({
    fecha: Joi.date().required(),
    hora: Joi.string().required(),
    total: Joi.number().optional(),
    responsable: Joi.string().optional(),
    //estado es opcional y debe pertenecer a ESTADOS
    estado: Joi.string()
        .valid(...Object.values(ESTADOS.ESTADOS))
        .optional(),
    ocupacion: Joi.number().required(),
    //observaciones, puede ser un string vacio y es opcional
    observaciones: Joi.string().allow('').optional(),
    paga: Joi.bool().optional(),
    clienteId: Joi.number().allow(null).optional(),
    empleadoId: Joi.number().optional(),
    items: Joi.array()
        .items(
            Joi.object({
                itemMenuId: Joi.number().required(),
                cantidad: Joi.number().required(),
                precio: Joi.number().required(),
            })
        )
        .required(),
    mesas: Joi.array().items(Joi.number()).optional(),
})

const updateOrdenSchema = Joi.object({
    fecha: Joi.date().optional(),
    hora: Joi.string().optional(),
    responsable: Joi.string().optional(),
    //estado es opcional y debe pertenecer a ESTADOS
    estado: Joi.string()
        .valid(...Object.values(ESTADOS.ESTADOS))
        .optional(),
    ocupacion: Joi.number().optional(),
    observaciones: Joi.string().optional(),
    paga: Joi.bool().optional(),
    clienteId: Joi.number().optional(),
    empleadoId: Joi.number().optional(),
})

const querySchema = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    empleadoId: Joi.number().optional(),
    clienteId: Joi.number().optional(),
    //estado es opcional y debe pertenecer a ESTADOS
    estado: Joi.string()
        .valid(...Object.values(ESTADOS.ESTADOS))
        .optional(),
    mesaId: Joi.number().optional(),
    fecha: Joi.date().iso().optional(),
})

const addOrRemoveMesaSchema = Joi.object({
    mesas: Joi.array().items(Joi.number()).required(),
})

const addItemsSchema = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                itemMenuId: Joi.number().required(),
                cantidad: Joi.number().required(),
                precio: Joi.number().required(),
            })
        )
        .required(),
})

const removeItemsSchema = Joi.object({
    items: Joi.array().items(Joi.number()).required(),
})

const porMesaSchema = Joi.object({
    mesaId: Joi.number().optional(),
})

const pagarTodoSchema = Joi.object({
    ordenes: Joi.array().items(Joi.number()).required(),
    metodoPago: Joi.string()
        .valid(...Object.values(METODOSPAGO))
        .required(),
    cajaId: Joi.number().required(),
    empleadoId: Joi.number().required(),
})

const ordenIdsSchema = Joi.object({
    Ids: [
        Joi.number().integer().positive().optional(),
        Joi.string()
            .pattern(/^\d+(,\d+)*$/)
            .optional(),
    ],
})

module.exports = {
    ordenSchema,
    querySchema,
    updateOrdenSchema,
    addOrRemoveMesaSchema,
    addItemsSchema,
    removeItemsSchema,
    porMesaSchema,
    pagarTodoSchema,
    ordenIdsSchema,
}
