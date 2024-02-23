'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Movimientos', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            fecha: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            hora: {
                type: Sequelize.TIME,
                allowNull: false,
            },
            total: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            tipo: {
                type: Sequelize.STRING,
            },
            observacion: {
                type: Sequelize.STRING,
            },
            cajaId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Cajas',
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
        await queryInterface.dropTable('Movimientos')
    },
}
