const express = require('express')
const router = express.Router()
const clienteController = require('../controllers/clienteController')
const validate = require('../middleware/validate')
const {
    querySchema,
    clienteSchema,
    updateClienteSchema,
} = require('./validations/clienteValidation')
const auth = require('../middleware/auth')
const { ROLES } = require('../constants/roles/roles')

router.post(
    '/clientes',
    auth([ROLES.ADMIN]),
    validate(clienteSchema),
    clienteController.crearCliente
)
router.get(
    '/clientes',
    auth([ROLES.ADMIN, ROLES.MOZO]),
    validate(querySchema, 'query'),
    clienteController.getClientes
)
router.get(
    '/clientes/:id',
    auth([ROLES.ADMIN]),
    clienteController.getClienteById
)
router.put(
    '/clientes/:id',
    [auth([ROLES.ADMIN]), validate(updateClienteSchema)],
    clienteController.updateCliente
)
router.delete(
    '/clientes/:id',
    auth([ROLES.ADMIN]),
    clienteController.deleteCliente
)

module.exports = router
