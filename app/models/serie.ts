import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import slugify from 'slugify';

import sequelize from '../../lib/mysql';

class Serie extends Model<InferAttributes<Serie>, InferCreationAttributes<Serie>> {
    declare id: CreationOptional<number>
    declare title: string
    declare category_id: number | null
    declare cover: string
    declare cover_big: string
    declare genre: string
    declare plot: string
    declare cast: string
    declare rating: number
    declare director: string
    declare releaseDate: string
    declare last_modified: number
    declare tmdb_id: number
    declare seasons: string
    declare episode_run_time: number
    declare backdrop_path: string
    declare youtube_trailer: string
    declare slug: string
}

Serie.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    category_id: DataTypes.INTEGER({ length: 11 }),
    cover: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    cover_big: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    genre: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    plot: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    cast: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
    },
    director: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    releaseDate: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    last_modified: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        key: 'last_modified',
    },
    tmdb_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        key: 'tmdb_id',
    },
    seasons: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
    },
    episode_run_time: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: 0,
    },
    backdrop_path: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    youtube_trailer: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    slug: {
        type: DataTypes.VIRTUAL,
        get() {
            return slugify(this.getDataValue('title'), { lower: true });
        },
        set(value) {
            throw new Error('Do not try to set the `slug` value!');
        }
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'series',
});

export default Serie