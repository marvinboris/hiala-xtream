import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import slugify from 'slugify';

import sequelize from '../../lib/mysql';
import SeriesEpisode from './series_episode';
import StreamCategory from './stream_category';

class Stream extends Model<InferAttributes<Stream>, InferCreationAttributes<Stream>> {
    declare id: CreationOptional<number>
    declare type: number
    declare category_id: number
    declare stream_display_name: string
    declare stream_source: string
    declare stream_icon: string
    declare notes: string | null
    declare created_channel_location: number
    declare enable_transcode: number
    declare transcode_attributes: string
    declare custom_ffmpeg: string
    declare movie_propeties: string
    declare movie_subtitles: string
    declare read_native: number
    declare target_container: string | string[]
    declare stream_all: number
    declare remove_subtitles: number
    declare custom_sid: string | null
    declare epg_id: number
    declare channel_id: string
    declare epg_lang: string | null
    declare order: number
    declare auto_restart: string
    declare transcode_profile_id: number
    declare pids_create_channel: string
    declare cchannel_rsources: string
    declare gen_timestamps: number
    declare added: number
    declare series_no: number
    declare direct_source: number
    declare tv_archive_duration: number
    declare tv_archive_server_id: number
    declare tv_archive_pid: number
    declare movie_symlink: number
    declare redirect_stream: number
    declare rtmp_output: number
    declare number: number
    declare allow_record: number
    declare probesize_ondemand: number
    declare custom_map: string
    declare external_push: string
    declare delay_minutes: number
    declare slug: string
}

Stream.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        key: "type",
    },
    category_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        key: "category_id",
    },
    stream_display_name: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
    },
    stream_source: {
        type: DataTypes.TEXT('medium'),
        get() {
            const rawValue = this.getDataValue('stream_source')
            let result
            if (rawValue) {
                const parsed = JSON.parse(rawValue) as string[]
                // result = parsed.map(source => `${process.env.XTREAM_HOSTNAME!}/movie/camtel/camtel/${this.id}.${this.target_container[0]}`)
                result = parsed.map(source => `/api/player/${this.type === 1 ? 'live' : this.type === 2 ? 'vod' : 'series'}/streams/${this.id}`)
            }
            return rawValue ? result : null
        }
    },
    stream_icon: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
    },
    notes: DataTypes.TEXT('medium'),
    created_channel_location: {
        type: DataTypes.INTEGER({ length: 11 }),
        key: "created_channel_location",
    },
    enable_transcode: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
        key: "enable_transcode",
    },
    transcode_attributes: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('transcode_attributes')
            return rawValue ? JSON.parse(rawValue) : null
        },
    },
    custom_ffmpeg: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
    },
    movie_propeties: {
        type: DataTypes.TEXT('medium'),
        get() {
            const rawValue = this.getDataValue('movie_propeties')
            return rawValue ? JSON.parse(rawValue) : null
        },
    },
    movie_subtitles: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
    },
    read_native: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
        key: "read_native",
    },
    target_container: {
        type: DataTypes.TEXT,
        get() {
            const rawValue = this.getDataValue('target_container')
            return rawValue ? JSON.parse(<string>rawValue) : null
        },
    },
    stream_all: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
    },
    remove_subtitles: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
    },
    custom_sid: DataTypes.STRING(150),
    epg_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        key: "epg_id",
    },
    channel_id: {
        type: DataTypes.STRING(255),
        key: "channel_id",
    },
    epg_lang: DataTypes.STRING(255),
    order: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: 0,
        key: "order",
    },
    auto_restart: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('auto_restart')
            return rawValue ? JSON.parse(rawValue) : null
        },
    },
    transcode_profile_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: 0,
        key: "transcode_profile_id",
    },
    pids_create_channel: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
    },
    cchannel_rsources: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
    },
    gen_timestamps: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 1,
    },
    added: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
    },
    series_no: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: 0,
    },
    direct_source: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
        key: "direct_source",
    },
    tv_archive_duration: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: 0,
    },
    tv_archive_server_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: 0,
    },
    tv_archive_pid: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: 0,
    },
    movie_symlink: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
    },
    redirect_stream: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
    },
    rtmp_output: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
        key: "rtmp_output",
    },
    number: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
    },
    allow_record: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
    },
    probesize_ondemand: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: 128000,
    },
    custom_map: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    external_push: {
        type: DataTypes.TEXT("medium"),
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('external_push')
            return rawValue ? JSON.parse(rawValue) : null
        },
    },
    delay_minutes: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: 0,
    },
    slug: {
        type: DataTypes.VIRTUAL,
        get() {
            return slugify(this.getDataValue('stream_display_name'), { lower: true });
        },
        set(value) {
            throw new Error('Do not try to set the `slug` value!');
        }
    }
}, {
    sequelize,
    timestamps: false,
    tableName: 'streams',
    underscored: true,
});

export default Stream