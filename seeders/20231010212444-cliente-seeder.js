// src/seeders/20231010212444-cliente-seeder.js

'use strict'

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'Clientes',
            [
                {
                    nombre: 'Roberto',
                    apellido: 'Díaz',
                    telefono: '98796543',
                    cuenta: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    nombre: 'Luisa',
                    apellido: 'Morales',
                    telefono: '21094321',
                    cuenta: 10.5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    nombre: 'Felipe',
                    apellido: 'Carrasco',
                    telefono: '56497890',
                    cuenta: 20.75,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        )
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Clientes', null, {})
    },
}
