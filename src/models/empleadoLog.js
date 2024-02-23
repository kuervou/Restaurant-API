// src/models/empleadoLog.js

'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class EmpleadoLog extends Model {
        static associate(models) {
            // Asociación con Empleado
            EmpleadoLog.belongsTo(models.Empleado, {
                foreignKey: 'empleadoId',
                as: 'empleado',
            })

            // Asociación con Log
            EmpleadoLog.belongsTo(models.Log, {
                foreignKey: 'logId',
                as: 'log',
            })
        }
    }

    EmpleadoLog.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            empleadoId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Empleados',
                    key: 'id',
                },
            },
            logId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Logs',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'EmpleadoLog',
            timestamps: true,
        }
    )

    return EmpleadoLog
}
