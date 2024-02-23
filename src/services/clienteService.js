const clienteRepository = require('../repositories/clienteRepository')
const { HttpError, HttpCode } = require('../error-handling/http_error')

//Función auxiliar para chequear unicidad de nombre + apellido
const checkNombreApellidoUnique = async (
    nombre,
    apellido,
    excludeId = null
) => {
    const formattedNombre = nombre.toLowerCase()
    const formattedApellido = apellido.toLowerCase()
    const existingCliente = await clienteRepository.findByNombreAndApellido(
        formattedNombre,
        formattedApellido
    )
    if (existingCliente && (!excludeId || existingCliente.id !== excludeId)) {
        throw new HttpError(
            HttpCode.CONFLICT,
            'Ya existe un cliente con esa combinación de nombre y apellido'
        )
    }
}

const clienteService = {
    crearCliente: async (nombre, apellido, telefono) => {
        await checkNombreApellidoUnique(nombre, apellido)
        return await clienteRepository.create(nombre, apellido, telefono)
    },

    getClientes: async function (options = {}) {
        return await clienteRepository.findAll(options)
    },

    getClienteById: async (id) => {
        return await clienteRepository.getClienteById(id)
    },

    updateCliente: async (id, nombre, apellido, telefono, cuenta) => {
        if (nombre && apellido) {
            await checkNombreApellidoUnique(nombre, apellido, id)
        }

        return await clienteRepository.update(
            id,
            nombre,
            apellido,
            telefono,
            cuenta
        )
    },

    deleteCliente: async (id) => {
        return await clienteRepository.deleteCliente(id)
    },
}

module.exports = clienteService
