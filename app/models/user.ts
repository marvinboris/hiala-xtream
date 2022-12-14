import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

import sequelize from '../../lib/mysql';

import Bouquet from './bouquet';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>
    declare member_id: number
    declare username: string
    declare password: string
    declare exp_date: CreationOptional<number>
    declare admin_enabled: CreationOptional<number>
    declare enabled: CreationOptional<number>
    declare admin_notes: CreationOptional<string>
    declare reseller_notes: CreationOptional<string>
    declare bouquet: CreationOptional<string | number[] | Bouquet[]>
    declare max_connections: CreationOptional<number>
    declare is_restreamer: CreationOptional<number>
    declare allowed_ips: CreationOptional<string>
    declare allowed_ua: CreationOptional<string>
    declare is_trial: CreationOptional<number>
    declare created_at: CreationOptional<number>
    declare created_by: CreationOptional<number>
    declare pair_id: CreationOptional<number>
    declare is_mag: CreationOptional<number>
    declare is_e2: CreationOptional<number>
    declare force_server_id: CreationOptional<number>
    declare is_isplock: CreationOptional<number>
    declare as_number: CreationOptional<string | null>
    declare isp_desc: CreationOptional<string>
    declare forced_country: CreationOptional<string>
    declare is_stalker: CreationOptional<number>
    declare bypass_ua: CreationOptional<number>
    declare play_token: CreationOptional<string>
}

User.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        key: "member_id",
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        key: "username",
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        key: "password",
    },
    exp_date: {
        type: DataTypes.INTEGER({ length: 11 }),
        key: "exp_date",
    },
    admin_enabled: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: 1,
        key: "admin_enabled",
    },
    enabled: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: 1,
        key: "enabled",
    },
    admin_notes: {
        type: DataTypes.TEXT('medium'),
        get() {
            const rawValue = this.getDataValue('admin_notes') as string
            return rawValue ? JSON.parse(rawValue) : null
        },
    },
    reseller_notes: DataTypes.TEXT('medium'),
    bouquet: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('bouquet') as string
            return rawValue ? JSON.parse(rawValue) : null
        },
    },
    max_connections: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: 1,
    },
    is_restreamer: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
        key: "is_restreamer"
    },
    allowed_ips: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
        defaultValue: '[]'
    },
    allowed_ua: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
        defaultValue: '[]'
    },
    is_trial: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
        key: "is_trial",
    },
    created_at: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        key: "created_at",
        defaultValue: DataTypes.NOW(),
    },
    created_by: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        key: "created_by",
        defaultValue: 1,
    },
    pair_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        key: "pair_id",
    },
    is_mag: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
        key: "is_mag",
    },
    is_e2: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
        key: "is_e2",
    },
    force_server_id: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
    },
    is_isplock: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
    },
    as_number: DataTypes.STRING(30),
    isp_desc: DataTypes.TEXT('medium'),
    forced_country: DataTypes.STRING(3),
    is_stalker: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
    },
    bypass_ua: {
        type: DataTypes.TINYINT({ length: 4 }),
        allowNull: false,
        defaultValue: 0,
    },
    play_token: DataTypes.TEXT,
}, {
    sequelize,
    timestamps: false,
    tableName: 'users',
    underscored: true,
});

export default User