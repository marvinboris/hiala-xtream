import SeriesEpisodeType from "./episode"

export default interface SeriesInfoType {
    seasons: []
    info: {
        name: string
        cover: string
        plot: string
        cast: string
        director: string
        genre: string
        releaseDate: string
        last_modified: string
        rating: string
        rating_5based: number
        backdrop_path: []
        youtube_trailer: string
        episode_run_time: string
        category_id: string
    }
    episodes: {
        [key: string]: SeriesEpisodeType[] 
    }
}