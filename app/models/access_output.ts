import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import slugify from 'slugify';

import sequelize from '../../lib/mysql';

class AccessOutput extends Model<InferAttributes<AccessOutput>, InferCreationAttributes<AccessOutput>> {
    declare access_output_id: CreationOptional<number>
    declare output_name: string
    declare output_key: string
    declare output_ext: string
}

AccessOutput.init({
    // Model attributes are defined here
    access_output_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    output_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    output_key: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    output_ext: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    sequelize,
    timestamps: false,
    tableName: 'access_output',
    underscored: true,
});

export default AccessOutput