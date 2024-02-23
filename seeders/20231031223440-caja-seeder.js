// src/seeders/20231031223440-caja-seeder.js

'use strict'

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'Cajas',
            [
                {
                    id: 1,
                    total: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        )
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Cajas', null, {})
    },
}
