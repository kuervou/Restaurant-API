// src/routes/itemMenuRoutes.js
const express = require('express')
const router = express.Router()
const itemMenuController = require('../controllers/itemMenuController')
const validate = require('../middleware/validate')
const {
    itemMenuSchema,
    updateItemMenuSchema,
    querySchema,
    updateItemsMenuInventarioSchema,
} = require('./validations/itemMenuValidations')
const auth = require('../middleware/auth')
const { ROLES } = require('../constants/roles/roles')

router.post(
    '/itemsMenu',
    [auth([ROLES.ADMIN]), validate(itemMenuSchema)],
    itemMenuController.crearItemMenu
)

router.get(
    '/itemsMenu',
    validate(querySchema, 'query'),
    itemMenuController.getItemsMenu
)

//ruta para obtener los itemsMenu activos
router.get(
    '/itemsMenu/activos',
    validate(querySchema, 'query'),
    itemMenuController.getItemsMenuActivos
)

//ruta para obtener los itemsMenu activos con datos basicos
router.get(
    '/itemsMenu/activos/basic',
    validate(querySchema, 'query'),
    itemMenuController.getItemsMenuActivosBasic
)

router.get('/itemsMenu/:id', itemMenuController.getItemMenuById)

router.get(
    '/itemsMenu/:id/itemsMenuInventario',
    auth([ROLES.ADMIN]),
    itemMenuController.getItemMenuInventarioById
)

router.put(
    '/itemsMenu/:id',
    [auth([ROLES.ADMIN]), validate(updateItemMenuSchema)],
    itemMenuController.updateItemMenu
)

router.delete(
    '/itemsMenu/:id',
    auth([ROLES.ADMIN]),
    itemMenuController.deleteItemMenu
)

router.put(
    '/itemsMenu/:id/addItemsInventario',
    auth([ROLES.ADMIN]),
    validate(updateItemsMenuInventarioSchema),
    itemMenuController.addItemsInventario
)

router.put(
    '/itemsMenu/:id/removeItemsInventario',
    auth([ROLES.ADMIN]),
    validate(updateItemsMenuInventarioSchema),
    itemMenuController.removeItemsInventario
)

router.patch(
    '/itemsMenu/:id/activate',
    auth([ROLES.ADMIN]),
    itemMenuController.activateItemMenu
)

module.exports = router
