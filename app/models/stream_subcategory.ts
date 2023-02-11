import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import slugify from 'slugify';

import sequelize from '../../lib/mysql';

class StreamSubcategory extends Model<InferAttributes<StreamSubcategory>, InferCreationAttributes<StreamSubcategory>> {
    declare sub_id: CreationOptional<number>
    declare parent_id: number
    declare subcategory_name: string
    declare slug: string
}

StreamSubcategory.init({
    // Model attributes are defined here
    sub_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    parent_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: 0,
        key: "parent_id",
    },
    subcategory_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    slug: {
        type: DataTypes.VIRTUAL,
        get() {
            return slugify(this.getDataValue('subcategory_name'), { lower: true });
        },
        set(value) {
            throw new Error('Do not try to set the `slug` value!');
        }
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'stream_subcategories',
    underscored: true,
});

export default StreamSubcategory