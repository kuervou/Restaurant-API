// migrations/xxxx-xx-xx-create-log.js
'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Logs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            fechaHoraAbierta: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            fechaHoraCerrada: {
                allowNull: true,
                type: Sequelize.DATE,
            },
            itemInventarioId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'ItemsInventario',
                    key: 'id',
                },
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('Logs')
    },
}
