const { Mesa } = require('../models')

const mesaRepository = {
    create: async (nroMesa, libre) => {
        const nuevaMesa = await Mesa.create({
            nroMesa,
            libre,
        })
        return nuevaMesa
    },
    findAll: async () => {
        return await Mesa.findAll()
    },

    //funcion para verificar si un array de ids de mesas existe
    checkMesas: async (mesas) => {
        const mesasExistentes = await Mesa.findAll({
            where: {
                id: mesas,
            },
        })

        if (mesasExistentes.length !== mesas.length) {
            return false
        }

        return true
    },

    findAllOcupadas: async () => {
        //findandcountall devuelve un array con dos elementos, el primero es el array de mesas y el segundo es la cantidad de mesas
        const result = await Mesa.findAndCountAll({
            where: {
                libre: false,
            },
        })

        //contar el total de mesas
        const total = await Mesa.count()

        //calcular el numero de mesas libres
        const libres = total - result.count

        return {
            mesas: result.rows,
            totalCount: total,
            libreCount: libres,
            ocupadasCount: result.count,
        }
    },

    findAllLibres: async () => {
        //findandcountall devuelve un array con dos elementos, el primero es el array de mesas y el segundo es la cantidad de mesas
        const result = await Mesa.findAndCountAll({
            where: {
                libre: true,
            },
        })

        //contar el total de mesas
        const total = await Mesa.count()

        //calcular el numero de mesas ocupadas
        const ocupadas = total - result.count

        return {
            mesas: result.rows,
            totalCount: total,
            libreCount: result.count,
            ocupadasCount: ocupadas,
        }
    },

    update: async (id, nroMesa, libre) => {
        return await Mesa.update({ nroMesa, libre }, { where: { id: id } })
    },

    getMesaById: async (id) => {
        return await Mesa.findByPk(id)
    },

    deleteMesa: async (id) => {
        return await Mesa.destroy({
            where: { id: id },
        })
    },
    findByNroMesa: async (nroMesa) => {
        return await Mesa.findOne({
            where: {
                nroMesa: nroMesa,
            },
        })
    },
}

module.exports = mesaRepository
