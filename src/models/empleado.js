// src/models/empleado.js
'use strict'
const { Model, DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = (sequelize) => {
    class Empleado extends Model {
        static associate(models) {
            Empleado.belongsToMany(models.Log, {
                through: 'EmpleadoLog',
                foreignKey: 'empleadoId',
            })
            Empleado.hasMany(models.Pago, {
                foreignKey: 'empleadoId',
            })
            Empleado.hasMany(models.Movimiento, {
                foreignKey: 'empleadoId',
            })
            Empleado.hasMany(models.Compra, {
                foreignKey: 'empleadoId',
            })
            Empleado.hasMany(models.Orden, {
                foreignKey: 'empleadoId',
            })
        }
    }
    Empleado.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            apellido: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            telefono: DataTypes.STRING,
            nick: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            rol: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            activo: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'Empleado',
            hooks: {
                beforeSave: async (empleado) => {
                    //Hook para encriptar password antes de guardar un empleado
                    if (empleado.password) {
                        const salt = await bcrypt.genSalt(10)
                        empleado.password = await bcrypt.hash(
                            empleado.password,
                            salt
                        )
                    }
                },
            },
            timestamps: true,
        }
    )
    return Empleado
}
