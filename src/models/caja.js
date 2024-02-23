'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class Caja extends Model {
        static associate(models) {
            // Relación uno-a-muchos
            Caja.hasMany(models.Pago, {
                foreignKey: 'cajaId',
            })

            // Relación uno-a-muchos
            Caja.hasMany(models.Movimiento, {
                foreignKey: 'cajaId',
            })
        }
    }

    Caja.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            total: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: 'Caja',
            timestamps: true,
        }
    )

    return Caja
}
