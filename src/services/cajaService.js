const cajaRepository = require('../repositories/cajaRepository')

const cajaService = {
    crearCaja: async (total) => {
        return await cajaRepository.create(total)
    },
    getCajas: async function () {
        return await cajaRepository.findAll()
    },

    getCajaById: async (id) => {
        return await cajaRepository.getCajaById(id)
    },

    updateCaja: async (id, total) => {
        return await cajaRepository.update(id, total)
    },
    deleteCaja: async (id) => {
        return await cajaRepository.deleteCaja(id)
    },
}

module.exports = cajaService
