'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Compras', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            fecha: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            hora: {
                type: Sequelize.TIME,
                allowNull: false,
            },
            cantidadxCasillero: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            cantidad: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            total: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            itemInventarioId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'ItemsInventario',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            empleadoId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Empleados',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        })
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('Compras')
    },
}
