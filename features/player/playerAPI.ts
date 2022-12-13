import axios from 'axios'

import BouquetType from '../../app/types/bouquet'
import LiveStreamType from '../../app/types/live/stream'
import SeriesInfoType from '../../app/types/series/info'
import SeriesStreamType from '../../app/types/series/stream'
import StreamCategoryType from '../../app/types/stream_category'
import VodInfoType from '../../app/types/vod/info'
import VodStreamType from '../../app/types/vod/stream'


// Live
export const getLiveCategories = async () => {
    const res = await axios.get<StreamCategoryType[]>('/api/player/live/categories')
    return res.data
}

export const getLiveStreams = async (category_id?: number) => {
    const res = await axios.get<LiveStreamType[]>('/api/player/live/streams', { params: { category_id } })
    return res.data
}

// Series
export const getSeriesCategories = async () => {
    const res = await axios.get<StreamCategoryType[]>('/api/player/series/categories')
    return res.data
}

export const getSeriesStreams = async (category_id?: number) => {
    const res = await axios.get<SeriesStreamType[]>('/api/player/series/streams', { params: { category_id } })
    return res.data
}

export const getSeriesInfo = async (series_id: number) => {
    const res = await axios.get<SeriesInfoType>('/api/player/series/info', { params: { series_id } })
    return res.data
}

// VOD
export const getVodCategories = async () => {
    const res = await axios.get<StreamCategoryType[]>('/api/player/vod/categories')
    return res.data
}

export const getVodStreams = async (category_id?: number) => {
    const res = await axios.get<VodStreamType[]>('/api/player/vod/streams', { params: { category_id } })
    return res.data
}

export const getVodInfo = async (vod_id: number) => {
    const res = await axios.get<VodInfoType>('/api/player/vod/info', { params: { vod_id } })
    return res.data
}

// Bouquets
export const getBouquets = async (id?: number) => {
    const res = await axios.get<BouquetType[]>(`/api/player/bouquets${id ? `/${id}` : ''}`)
    return res.data
}
