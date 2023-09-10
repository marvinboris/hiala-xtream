import Serie from "./serie";
import SeriesEpisode from "./series_episode";
import Stream from "./stream";
import StreamCategory from "./stream_category";
import StreamsSys from "./streams_sys";
import StreamsType from "./streams_type";

// SeriesEpisode.belongsTo(Serie)
// Serie.hasMany(SeriesEpisode, { foreignKey: 'series_id' })

// SeriesEpisode.belongsTo(Stream)
// Stream.hasOne(SeriesEpisode, { foreignKey: 'stream_id' })

// Stream.belongsTo(StreamCategory)
// StreamCategory.hasMany(Stream, { foreignKey: 'category_id' })

// Stream.belongsTo(StreamsType)
// StreamsType.hasMany(Stream, { foreignKey: 'type' })

export {
  Serie,
  SeriesEpisode,
  Stream,
  StreamCategory,
  StreamsSys,
  StreamsType,
};
