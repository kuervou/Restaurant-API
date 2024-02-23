'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Pagos', {
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
            ordenId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Ordenes',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            metodoPago: {
                type: Sequelize.STRING,
            },
            empleadoId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Empleados',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            cajaId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Cajas',
                    key: 'id',
                },
                onDelete: 'CASCADE',
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
        await queryInterface.dropTable('Pagos')
    },
}
