import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import slugify from 'slugify';

import sequelize from '../../lib/mysql';

class UserOutput extends Model<InferAttributes<UserOutput>, InferCreationAttributes<UserOutput>> {
    declare id: CreationOptional<number>
    declare user_id: number
    declare access_output_id: number
}

UserOutput.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
    },
    access_output_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
    },
}, {
    sequelize,
    timestamps: false,
    tableName: 'user_output',
    underscored: true,
});

export default UserOutput