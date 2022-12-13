import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import slugify from 'slugify';

import sequelize from '../../lib/mysql';

class Bouquet extends Model<InferAttributes<Bouquet>, InferCreationAttributes<Bouquet>> {
    declare id: CreationOptional<number>
    declare bouquet_name: string
    declare bouquet_channels: string | number[]
    declare bouquet_series: string | number[]
    declare bouquet_order: number
    declare slug: string
}

Bouquet.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    bouquet_name: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
    },
    bouquet_channels: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('bouquet_channels') as string
            return rawValue ? JSON.parse(rawValue) : null
        }
    },
    bouquet_series: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('bouquet_series') as string
            return rawValue ? JSON.parse(rawValue) : null
        }
    },
    bouquet_order: {
        type: DataTypes.INTEGER({ length: 16 }),
        allowNull: false,
        defaultValue: 0,
    },
    slug: {
        type: DataTypes.VIRTUAL,
        get() {
            return slugify(this.getDataValue('bouquet_name'));
        },
        set(value) {
            throw new Error('Do not try to set the `slug` value!');
        }
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'bouquets',
    underscored: true,
});

export default Bouquet