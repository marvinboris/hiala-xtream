import StreamType from "../stream"

export default interface SeriesEpisodeType {
    id: string
    season_num: number
    series_id: number
    stream_id: number
    sort: number
    stream: StreamType
}