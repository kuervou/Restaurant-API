const Joi = require('joi')

const itemMenuSchema = Joi.object({
    nombre: Joi.string().min(4).required(),
    descripcion: Joi.string().min(4).optional(),
    precio: Joi.number().required(),
    imagen: Joi.string().base64().required(), // Valida que sea base64
    grupoId: Joi.number().required(),
    itemsInventario: Joi.array()
        .items(
            Joi.object({
                id: Joi.number().required(),
            })
        )
        .optional(), // Asumo que puede ser opcional, si no lo es, elimina .optional()
    porUnidad: Joi.boolean().optional(),
})

const updateItemMenuSchema = Joi.object({
    nombre: Joi.string().min(4).optional(),
    descripcion: Joi.string().min(4).optional(),
    precio: Joi.number().optional(),
    imagen: Joi.string().base64().optional(), // Valida que sea base64
    grupoId: Joi.number().optional(),
})

const querySchema = Joi.object({
    page: Joi.number().min(-1).optional(),
    limit: Joi.number().min(-1).optional(),
    nombre: Joi.string().max(255).optional(),
    grupoId: [
        Joi.number().integer().positive().optional(),
        Joi.string()
            .pattern(/^\d+(,\d+)*$/)
            .optional(),
    ],
})

const updateItemsMenuInventarioSchema = Joi.object({
    itemsInventario: Joi.array()
        .items(
            Joi.object({
                id: Joi.number().required(),
            })
        )
        .required(),
    porUnidad: Joi.boolean().optional().allow(null),
})

module.exports = {
    itemMenuSchema,
    updateItemMenuSchema,
    querySchema,
    updateItemsMenuInventarioSchema,
}
