// src/seeders/20231010211219-mesa-seeder.js

'use strict'

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'Mesas',
            [
                {
                    nroMesa: 1,
                    libre: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    nroMesa: 2,
                    libre: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    nroMesa: 3,
                    libre: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        )
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Mesas', null, {})
    },
}
