const { Grupo } = require('../models')
const { Op } = require('sequelize')

const grupoRepository = {
    create: async (nombre, esBebida) => {
        const nuevoGrupo = await Grupo.create({
            nombre,
            esBebida,
        })
        return nuevoGrupo
    },
    findAll: async (options = {}) => {
        const { page = 1, limit = 10, nombre, esBebida } = options

        const offset = (page - 1) * limit

        const whereConditions = {}
        if (nombre) {
            whereConditions.nombre = {
                [Op.like]: `%${nombre}%`, // Búsqueda insensible a mayúsculas/minúsculas
            }
        }

        if (esBebida !== undefined) {
            whereConditions.esBebida = esBebida === 'true' || esBebida === true // true si esBebida es 'true' o true
            if (esBebida === 'false' || esBebida === false) {
                whereConditions.esBebida = false // false si esBebida es 'false' o false
            }
        }

        //Si page o limit son -1, no se aplica paginado

        if (page === -1 || limit === -1) {
            const result = await Grupo.findAndCountAll({
                where: whereConditions,
                order: [['nombre', 'ASC']],
            })

            return {
                total: result.count,
                items: result.rows,
            }
        }

        const result = await Grupo.findAndCountAll({
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

    update: async (id, nombre, esBebida) => {
        return await Grupo.update({ nombre, esBebida }, { where: { id: id } })
    },

    getGrupoById: async (id) => {
        return await Grupo.findByPk(id)
    },

    deleteGrupo: async (id) => {
        return await Grupo.destroy({
            where: { id: id },
        })
    },
    findByNombre: async (nombre) => {
        return await Grupo.findOne({ where: { nombre: nombre.toLowerCase() } })
    },
}

module.exports = grupoRepository
