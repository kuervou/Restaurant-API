// src/models/pago.js

'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class Pago extends Model {
        static associate(models) {
            Pago.belongsTo(models.Orden, {
                foreignKey: 'ordenId',
                as: 'orden',
            })
            Pago.belongsTo(models.Empleado, {
                foreignKey: 'empleadoId',
                as: 'empleado',
            })
            Pago.belongsTo(models.Caja, {
                foreignKey: 'cajaId',
                as: 'caja',
            })
        }
    }

    Pago.init(
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
            metodoPago: DataTypes.STRING,
            ordenId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Ordenes',
                    key: 'id',
                },
            },
            cajaId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Cajas',
                    key: 'id',
                },
            },
            EmpleadoId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Empleados',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'Pago',
            timestamps: true,
        }
    )

    return Pago
}
