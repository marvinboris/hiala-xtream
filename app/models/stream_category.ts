import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import slugify from 'slugify';

import sequelize from '../../lib/mysql';

class StreamCategory extends Model<InferAttributes<StreamCategory>, InferCreationAttributes<StreamCategory>> {
    declare id: CreationOptional<number>
    declare category_type: string
    declare category_name: string
    declare parent_id: number
    declare cat_order: number
    declare slug: string
}

StreamCategory.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    category_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
        key: "category_type",
    },
    category_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        key: "category_name",
    },
    parent_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: 0,
        key: "parent_id",
    },
    cat_order: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: 0,
    },
    slug: {
        type: DataTypes.VIRTUAL,
        get() {
            return slugify(this.getDataValue('category_name'));
        },
        set(value) {
            throw new Error('Do not try to set the `slug` value!');
        }
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'stream_categories',
    underscored: true,
});

export default StreamCategory