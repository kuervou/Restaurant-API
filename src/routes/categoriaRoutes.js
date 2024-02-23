const express = require('express')
const router = express.Router()
const categoriaController = require('../controllers/categoriaController')
const validate = require('../middleware/validate')
const {
    querySchema,
    categoriaSchema,
} = require('./validations/categoriaValidation')
const auth = require('../middleware/auth')
const { ROLES } = require('../constants/roles/roles')

router.post(
    '/categorias',
    [auth([ROLES.ADMIN]), validate(categoriaSchema)],
    categoriaController.crearCategoria
)
router.get(
    '/categorias',
    auth([ROLES.ADMIN]),
    validate(querySchema, 'query'),
    categoriaController.getCategorias
)
router.get(
    '/categorias/:id',
    auth([ROLES.ADMIN]),
    categoriaController.getCategoriaById
)
router.put(
    '/categorias/:id',
    [auth([ROLES.ADMIN]), validate(categoriaSchema)],
    categoriaController.updateCategoria
)
router.delete(
    '/categorias/:id',
    auth([ROLES.ADMIN]),
    categoriaController.deleteCategoria
)

module.exports = router
