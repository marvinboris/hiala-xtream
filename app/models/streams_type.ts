import { DataTypes, InferAttributes, InferCreationAttributes, Model, CreationOptional } from 'sequelize';
import slugify from 'slugify';

import sequelize from '../../lib/mysql';
import Stream from './stream';

class StreamsType extends Model<InferAttributes<StreamsType>, InferCreationAttributes<StreamsType>> {
    declare type_id: CreationOptional<number>
    declare type_name: string
    declare type_key: string
    declare type_output: string
    declare live: number
    declare slug: string
}

StreamsType.init({
    // Model attributes are defined here
    type_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    type_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    type_key: {
        type: DataTypes.STRING(255),
        allowNull: false,
        key: "type_key",
    },
    type_output: {
        type: DataTypes.STRING(255),
        allowNull: false,
        key: "type_output",
    },
    live: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        key: "live",
    },
    slug: {
        type: DataTypes.VIRTUAL,
        get() {
            return slugify(this.getDataValue('type_name'));
        },
        set(value) {
            throw new Error('Do not try to set the `slug` value!');
        }
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'streams_types',
    underscored: true,
});

export default StreamsType