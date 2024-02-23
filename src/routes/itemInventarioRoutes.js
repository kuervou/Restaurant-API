const express = require('express')
const router = express.Router()
const itemInventarioController = require('../controllers/itemInventarioController')
const validate = require('../middleware/validate')
const {
    itemInventarioSchema,
    updateItemInventarioSchema,
    querySchema,
    updateStockSchema,
} = require('./validations/itemInventarioValidation')
const auth = require('../middleware/auth')
const { ROLES } = require('../constants/roles/roles')

router.post(
    '/itemsInventario',
    [auth([ROLES.ADMIN]), validate(itemInventarioSchema)],
    itemInventarioController.crearItemInventario
)
router.get(
    '/itemsInventario',
    auth([ROLES.ADMIN]),
    validate(querySchema, 'query'),
    itemInventarioController.getItemsInventario
)
router.get(
    '/itemsInventario/:id',
    auth([ROLES.ADMIN]),
    itemInventarioController.getItemInventarioById
)
router.put(
    '/itemsInventario/:id',
    [auth([ROLES.ADMIN]), validate(updateItemInventarioSchema)],
    itemInventarioController.updateItemInventario
)
router.delete(
    '/itemsInventario/:id',
    auth([ROLES.ADMIN]),
    itemInventarioController.deleteItemInventario
)
router.put(
    '/itemsInventario/:id/stock',
    [auth([ROLES.ADMIN]), validate(updateStockSchema)], // Asumiendo que defines un esquema de validación
    itemInventarioController.updateStock
)

module.exports = router
