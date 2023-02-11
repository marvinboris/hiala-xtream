import { DataTypes, InferAttributes, InferCreationAttributes, Model, CreationOptional } from 'sequelize';
import slugify from 'slugify';

import sequelize from '../../lib/mysql';

class StreamsSeason extends Model<InferAttributes<StreamsSeason>, InferCreationAttributes<StreamsSeason>> {
    declare season_id: CreationOptional<number>
    declare season_name: string
    declare stream_id: number
    declare slug: string
}

StreamsSeason.init({
    // Model attributes are defined here
    season_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    season_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    stream_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
    },
    slug: {
        type: DataTypes.VIRTUAL,
        get() {
            return slugify(this.getDataValue('season_name'), { lower: true });
        },
        set(value) {
            throw new Error('Do not try to set the `slug` value!');
        }
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'streams_seasons',
    underscored: true,
});

export default StreamsSeason