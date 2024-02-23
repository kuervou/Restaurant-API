// src/models/movimiento.js

'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class Movimiento extends Model {
        static associate(models) {
            Movimiento.belongsTo(models.Caja, {
                foreignKey: 'cajaId',
                as: 'caja',
            })
            Movimiento.belongsTo(models.Empleado, {
                foreignKey: 'empleadoId',
                as: 'empleado',
            })
        }
    }

    Movimiento.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            fecha: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            hora: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            total: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            tipo: DataTypes.STRING,
            observacion: DataTypes.STRING,
            cajaId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Cajas',
                    key: 'id',
                },
            },
            empleadoId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Empleados',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'Movimiento',
            timestamps: true,
        }
    )

    return Movimiento
}
