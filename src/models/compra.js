'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class Compra extends Model {
        static associate(models) {
            Compra.belongsTo(models.Empleado, {
                foreignKey: 'empleadoId',
                as: 'empleado',
            })

            Compra.belongsTo(models.ItemInventario, {
                foreignKey: 'itemInventarioId',
                as: 'itemInventario',
            })
        }
    }

    Compra.init(
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
            cantidadxCasillero: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            cantidad: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            total: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },

            itemInventarioId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'ItemsInventario',
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
            modelName: 'Compra',
            timestamps: true,
        }
    )

    return Compra
}
