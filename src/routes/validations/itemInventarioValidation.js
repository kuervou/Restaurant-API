const Joi = require('joi')

const itemInventarioSchema = Joi.object({
    nombre: Joi.string().min(4).required(),
    descripcion: Joi.string().min(4).optional(),
    costo: Joi.number().required(),
    stock: Joi.number().optional(),
    cantxCasillero: Joi.number().allow(null).optional(),
    porUnidad: Joi.bool().optional(),
    categoriaId: Joi.number().required(),
})

const updateItemInventarioSchema = Joi.object({
    nombre: Joi.string().min(4).optional(),
    descripcion: Joi.string().min(4).optional(),
    costo: Joi.number().optional(),
    stock: Joi.number().optional(),
    cantxCasillero: Joi.number().optional(),
    porUnidad: Joi.bool().optional(),
    categoriaId: Joi.number().optional(),
})

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    nombre: Joi.string().max(255).optional(),
    categoriaId: Joi.number().integer().positive().optional(),
    porUnidad: Joi.bool().optional(),
})

const updateStockSchema = Joi.object({
    amount: Joi.number().required(),
})

module.exports = {
    itemInventarioSchema,
    updateItemInventarioSchema,
    querySchema,
    updateStockSchema,
}
