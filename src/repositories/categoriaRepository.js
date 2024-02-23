const { Categoria } = require('../models')
const { Op } = require('sequelize')

const categoriaRepository = {
    create: async (nombre) => {
        const nuevaCategoria = await Categoria.create({
            nombre,
        })
        return nuevaCategoria
    },
    findAll: async (options = {}) => {
        const { page = 1, limit = 10, nombre } = options

        const offset = (page - 1) * limit

        const whereConditions = {}
        if (nombre) {
            whereConditions.nombre = {
                [Op.like]: `%${nombre}%`, // Búsqueda insensible a mayúsculas/minúsculas
            }
        }

        //si page o limit son -1, no se aplica paginación
        if (page === -1 || limit === -1) {
            const result = await Categoria.findAndCountAll({
                where: whereConditions,
                order: [['nombre', 'ASC']],
            })

            return {
                total: result.count,
                items: result.rows,
            }
        }

        const result = await Categoria.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            order: [['nombre', 'ASC']],
        })

        return {
            total: result.count,
            items: result.rows,
        }
    },

    update: async (id, nombre) => {
        return await Categoria.update({ nombre }, { where: { id: id } })
    },

    getCategoriaById: async (id) => {
        return await Categoria.findByPk(id)
    },

    deleteCategoria: async (id) => {
        return await Categoria.destroy({
            where: { id: id },
        })
    },

    findByNombre: async (nombre) => {
        return await Categoria.findOne({
            where: { nombre: nombre.toLowerCase() },
        })
    },
}

module.exports = categoriaRepository
