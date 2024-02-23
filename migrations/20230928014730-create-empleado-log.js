'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('EmpleadoLogs', {
            // Se agrega la nueva columna 'id' como clave primaria y autoincremental
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            // 'empleadoId' ahora es solo una clave foránea
            empleadoId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Empleados', // Nombre de la tabla en la base de datos
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            // 'logId' también es solo una clave foránea
            logId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Logs', // Nombre de la tabla en la base de datos
                    key: 'id',
                },
                onUpdate: 'CASCADE',
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
        await queryInterface.dropTable('EmpleadoLogs')
    },
}
