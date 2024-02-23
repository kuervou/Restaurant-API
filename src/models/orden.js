'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class Orden extends Model {
        static associate(models) {
            Orden.belongsTo(models.Cliente, {
                foreignKey: 'clienteId',
                as: 'cliente',
            })

            Orden.belongsToMany(models.Mesa, {
                through: 'OrdenMesa',
                foreignKey: 'ordenId',
                as: 'mesas',
            })

            Orden.belongsTo(models.Empleado, {
                foreignKey: 'empleadoId',
                as: 'empleado',
            })

            // Relación uno-a-muchos con Item
            Orden.hasMany(models.Item, {
                foreignKey: 'ordenId',
                as: 'items',
            })

            // Relación uno-a-muchos con Pago
            Orden.hasMany(models.Pago, {
                foreignKey: 'ordenId',
                as: 'pagos',
            })
        }
    }

    Orden.init(
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
            responsable: {
                type: DataTypes.STRING,
            },
            estado: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            ocupacion: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            observaciones: {
                type: DataTypes.STRING,
            },
            paga: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            clienteId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Clientes',
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
            modelName: 'Orden',
            tableName: 'Ordenes',
            timestamps: true,
        }
    )

    return Orden
}
