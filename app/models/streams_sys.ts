import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  CreationOptional,
} from "sequelize";

import sequelize from "../../lib/mysql";

class StreamsSys extends Model<
  InferAttributes<StreamsSys>,
  InferCreationAttributes<StreamsSys>
> {
  declare server_stream_id: CreationOptional<number>;
  declare stream_id: number;
  declare server_id: number;
  declare parent_id: number | null;
  declare pid: number | null;
  declare to_analyze: number;
  declare stream_status: number;
  declare stream_started: number | null;
  declare stream_info: string;
  declare monitor_pid: number | null;
  declare current_source: string | null;
  declare bitrate: number | null;
  declare progress_info: string;
  declare on_demand: number;
  declare delay_pid: number | null;
  declare delay_available_at: number | null;
}

StreamsSys.init(
  {
    // Model attributes are defined here
    server_stream_id: {
      type: DataTypes.INTEGER({ length: 11 }),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    stream_id: {
      type: DataTypes.INTEGER({ length: 11 }),
      allowNull: false,
    },
    server_id: {
      type: DataTypes.INTEGER({ length: 11 }),
      allowNull: false,
    },
    parent_id: DataTypes.INTEGER({ length: 11 }),
    pid: DataTypes.INTEGER({ length: 11 }),
    to_analyze: {
      type: DataTypes.TINYINT({ length: 4 }),
      allowNull: false,
      defaultValue: 0,
    },
    stream_status: {
      type: DataTypes.INTEGER({ length: 11 }),
      allowNull: false,
      defaultValue: 0,
    },
    stream_started: DataTypes.INTEGER({ length: 11 }),
    stream_info: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
    },
    monitor_pid: DataTypes.INTEGER({ length: 11 }),
    current_source: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
    },
    bitrate: DataTypes.INTEGER({ length: 11 }),
    progress_info: {
      type: DataTypes.TEXT(),
      allowNull: false,
    },
    on_demand: {
      type: DataTypes.TINYINT({ length: 4 }),
      allowNull: false,
      defaultValue: 0,
    },
    delay_pid: DataTypes.INTEGER({ length: 11 }),
    delay_available_at: DataTypes.INTEGER({ length: 11 }),
  },
  {
    sequelize,
    timestamps: false,
    tableName: "streams_sys",
    underscored: true,
  }
);

export default StreamsSys;
