// src/models/log.js
'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class Log extends Model {
        static associate(models) {
            Log.belongsToMany(models.Empleado, {
                through: 'EmpleadoLog',
                foreignKey: 'logId',
            })
            Log.belongsTo(models.ItemInventario, {
                foreignKey: 'itemInventarioId',
            })
        }
    }
    Log.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            fechaHoraAbierta: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            fechaHoraCerrada: DataTypes.DATE,
            itemInventarioId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'ItemsInventario',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'Log',
        }
    )
    return Log
}
