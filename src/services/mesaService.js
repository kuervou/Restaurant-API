const { HttpError, HttpCode } = require('../error-handling/http_error')
const mesaRepository = require('../repositories/mesaRepository')
const ordenesRepository = require('../repositories/ordenRepository')

// Función auxiliar para chequear la unicidad del nroMesa
const checkNroMesaUnique = async (nroMesa, excludeId = null) => {
    const existingMesa = await mesaRepository.findByNroMesa(nroMesa)
    if (existingMesa && (!excludeId || existingMesa.id !== excludeId)) {
        throw new HttpError(
            HttpCode.CONFLICT,
            'Ya existe una mesa con ese número'
        )
    }
}

const mesaService = {
    crearMesa: async (nroMesa, libre) => {
        await checkNroMesaUnique(nroMesa)
        return await mesaRepository.create(nroMesa, libre)
    },

    getMesas: async function () {
        return await mesaRepository.findAll()
    },

    getMesasOcupadas: async function () {
        return await mesaRepository.findAllOcupadas()
    },

    getMesasLibres: async function () {
        return await mesaRepository.findAllLibres()
    },

    getMesaById: async (id) => {
        return await mesaRepository.getMesaById(id)
    },

    updateMesa: async (id, nroMesa, libre) => {
        //validamos que nroMesa no sea null o undefined
        if (nroMesa) {
            await checkNroMesaUnique(nroMesa, id)
        }
        //Si se quiere actualizar el estado "libre" de la mesa, se debe validar que no haya un pedido asociado a la misma con estado "pendiente" o "en cocina"
        if (libre === true) {
           //usamos el ordenes repository y su funcion getCountOrdenesEnCocinayParaEntregarPorMesaId
              const countOrdenes = await ordenesRepository.getCountOrdenesEnCocinayParaEntregarPorMesaId(id)
                if (countOrdenes > 0) {
                    throw new HttpError(
                        HttpCode.CONFLICT,
                        'No se puede cambiar el estado de la mesa porque tiene pedidos pendientes o en cocina'
                    )
                }
           
                
        }


        return await mesaRepository.update(id, nroMesa, libre)
    },

    deleteMesa: async (id) => {
        return await mesaRepository.deleteMesa(id)
    },
}

module.exports = mesaService
