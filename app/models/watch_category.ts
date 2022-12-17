import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import slugify from 'slugify';

import sequelize from '../../lib/mysql';

class WatchCategory extends Model<InferAttributes<WatchCategory>, InferCreationAttributes<WatchCategory>> {
    declare id: CreationOptional<number>
    declare type: number
    declare genre_id: number
    declare genre: string
    declare category_id: number
    declare bouquets: string | number[]
    declare slug: string
}

WatchCategory.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: DataTypes.INTEGER({ length: 1 }),
        allowNull: false,
        defaultValue: 0,
    },
    genre_id: {
        type: DataTypes.INTEGER({ length: 8 }),
        allowNull: false,
        defaultValue: 0,
    },
    genre: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "",
    },
    category_id: {
        type: DataTypes.INTEGER({ length: 8 }),
        allowNull: false,
        defaultValue: 0,
    },
    bouquets: {
        type: DataTypes.STRING(4096),
        allowNull: false,
        defaultValue: '[]',
        get() {
            const rawValue = this.getDataValue('bouquets') as string
            return rawValue ? JSON.parse(rawValue) : null
        },
    },
    slug: {
        type: DataTypes.VIRTUAL,
        get() {
            return slugify(this.getDataValue('genre'), { lower: true });
        },
        set(value) {
            throw new Error('Do not try to set the `slug` value!');
        }
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'watch_categories',
    underscored: true,
});

export default WatchCategory