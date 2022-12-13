import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

import sequelize from '../../lib/mysql';

class SeriesEpisode extends Model<InferAttributes<SeriesEpisode>, InferCreationAttributes<SeriesEpisode>> {
    declare id: CreationOptional<number>
    declare season_num: number
    declare series_id: number
    declare stream_id: number
    declare sort: number
}

SeriesEpisode.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    season_num: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        key: "season_num",
    },
    series_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        key: "series_id",
    },
    stream_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        key: "stream_id",
    },
    sort: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        key: "sort",
    },
}, {
    sequelize,
    timestamps: false,
    tableName: 'series_episodes',
    underscored: true,
});

export default SeriesEpisode