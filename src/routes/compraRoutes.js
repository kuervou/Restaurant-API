// src/routes/compraRoutes.js

const express = require('express')
const router = express.Router()
const compraController = require('../controllers/compraController')
const auth = require('../middleware/auth')
const { ROLES } = require('../constants/roles/roles')
const { compraSchema, querySchema } = require('./validations/compraValidation')
const validate = require('../middleware/validate')

router.post(
    '/compras',
    auth([ROLES.ADMIN]),
    validate(compraSchema),
    compraController.crearCompra
)

router.get(
    '/compras',
    auth([ROLES.ADMIN]),
    validate(querySchema),
    compraController.getCompras
)

router.get('/compras/:id', auth([ROLES.ADMIN]), compraController.getCompraById)

router.delete(
    '/compras/:id',
    auth([ROLES.ADMIN]),
    compraController.deleteCompra
)

module.exports = router
