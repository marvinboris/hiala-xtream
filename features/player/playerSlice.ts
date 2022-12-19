import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import type { AppState } from '../../app/store'
import BouquetType from '../../app/types/bouquet'
import LiveStreamType from '../../app/types/live/stream'
import SeriesEpisodeType from '../../app/types/series/episode'
import SeriesInfoType from '../../app/types/series/info'
import SeriesStreamType from '../../app/types/series/stream'
import Status from '../../app/types/status'
import StreamType from '../../app/types/stream'
import StreamCategoryType from '../../app/types/stream_category'
import VodInfoType from '../../app/types/vod/info'

import { getBouquets, getLiveCategories, getLiveStreams, getSeriesCategories, getSeriesInfo, getSeriesStreams, getVodCategories, getVodInfo, getVodStreams } from './playerAPI'

export interface PlayerState {
    live: {
        categories: {
            data: StreamCategoryType[] | null
            status: Status
        }
        streams: {
            data: StreamType[] | null
            status: Status
        }
    }
    series: {
        categories: {
            data: StreamCategoryType[] | null
            status: Status
        }
        streams: {
            data: SeriesStreamType[] | null
            status: Status
        }
        info: {
            data: SeriesEpisodeType[] | null
            status: Status
        }
    }
    vod: {
        categories: {
            data: StreamCategoryType[] | null
            status: Status
        }
        streams: {
            data: StreamType[] | null
            status: Status
        }
        info: {
            data: VodInfoType | null
            status: Status
        }
    }
    bouquets: {
        data: BouquetType[] | (BouquetType & { channels: StreamType[], series: SeriesStreamType[] }) | null
        status: Status
    }
}

const initialState: PlayerState = {
    live: {
        categories: { data: null, status: Status.IDLE },
        streams: { data: null, status: Status.IDLE },
    },
    series: {
        categories: { data: null, status: Status.IDLE },
        streams: { data: null, status: Status.IDLE },
        info: { data: null, status: Status.IDLE },
    },
    vod: {
        categories: { data: null, status: Status.IDLE },
        streams: { data: null, status: Status.IDLE },
        info: { data: null, status: Status.IDLE },
    },
    bouquets: { data: null, status: Status.IDLE },
}

// Lives
export const liveCategories = createAsyncThunk('player/live/categories', async () => await getLiveCategories())
export const liveStreams = createAsyncThunk('player/live/streams', async (category_id?: number) => await getLiveStreams(category_id))

// Series
export const seriesCategories = createAsyncThunk('player/series/categories', async () => await getSeriesCategories())
export const seriesStreams = createAsyncThunk('player/series/streams', async (category_id?: number) => await getSeriesStreams(category_id))
export const seriesInfo = createAsyncThunk('player/series/info', async (series_id: number) => await getSeriesInfo(series_id))

// Vod
export const vodCategories = createAsyncThunk('player/vod/categories', async () => await getVodCategories())
export const vodStreams = createAsyncThunk('player/vod/streams', async (category_id?: number) => await getVodStreams(category_id))
export const vodInfo = createAsyncThunk('player/vod/info', async (vod_id: number) => await getVodInfo(vod_id))

// Bouquets
export const bouquets = createAsyncThunk('player/bouquets', async (id?: number) => await getBouquets(id))

const dataPending = (category: 'live' | 'series' | 'vod' | 'bouquets', list?: 'categories' | 'streams' | 'info') => (state: any) => {
    if (list) {
        state[category][list].data = null
        state[category][list].status = Status.LOADING
    } else {
        state[category].data = null
        state[category].status = Status.LOADING
    }
}

const dataFulfilled = (category: 'live' | 'series' | 'vod' | 'bouquets', list?: 'categories' | 'streams' | 'info') => (state: any, action: any) => {
    if (list) {
        state[category][list].status = Status.IDLE
        if (!(category === 'live' && list === 'info')) state[category][list].data = action.payload
    } else {
        state[category].status = Status.IDLE
        state[category].data = action.payload
    }
}

const dataRejected = (category: 'live' | 'series' | 'vod' | 'bouquets', list?: 'categories' | 'streams' | 'info') => (state: any) => {
    if (list) {
        state[category][list].data = null
        state[category][list].status = Status.FAILED
    } else {
        state[category].data = null
        state[category].status = Status.FAILED
    }
}

const reset = (category: 'live' | 'series' | 'vod' | 'bouquets', list?: 'categories' | 'streams' | 'info') => (state: any) => {
    if (list) {
        state[category][list].data = null
        state[category][list].status = Status.IDLE
    } else {
        state[category].data = null
        state[category].status = Status.IDLE
    }
}

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        resetLiveCategories: reset('live', 'categories'),
        resetLiveStreams: reset('live', 'streams'),

        resetSeriesCategories: reset('series', 'categories'),
        resetSeriesStreams: reset('series', 'streams'),
        resetSeriesInfo: reset('series', 'info'),

        resetVodCategories: reset('vod', 'categories'),
        resetVodStreams: reset('vod', 'streams'),
        resetVodInfo: reset('vod', 'info'),

        resetBouquets: reset('bouquets'),
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        builder
            .addCase(liveCategories.pending, dataPending('live', 'categories'))
            .addCase(liveCategories.fulfilled, dataFulfilled('live', 'categories'))
            .addCase(liveCategories.rejected, dataRejected('live', 'categories'))

            .addCase(liveStreams.pending, dataPending('live', 'streams'))
            .addCase(liveStreams.fulfilled, dataFulfilled('live', 'streams'))
            .addCase(liveStreams.rejected, dataRejected('live', 'streams'))


            .addCase(seriesCategories.pending, dataPending('series', 'categories'))
            .addCase(seriesCategories.fulfilled, dataFulfilled('series', 'categories'))
            .addCase(seriesCategories.rejected, dataRejected('series', 'categories'))

            .addCase(seriesStreams.pending, dataPending('series', 'streams'))
            .addCase(seriesStreams.fulfilled, dataFulfilled('series', 'streams'))
            .addCase(seriesStreams.rejected, dataRejected('series', 'streams'))

            .addCase(seriesInfo.pending, dataPending('series', 'info'))
            .addCase(seriesInfo.fulfilled, dataFulfilled('series', 'info'))
            .addCase(seriesInfo.rejected, dataRejected('series', 'info'))



            .addCase(vodCategories.pending, dataPending('vod', 'categories'))
            .addCase(vodCategories.fulfilled, dataFulfilled('vod', 'categories'))
            .addCase(vodCategories.rejected, dataRejected('vod', 'categories'))

            .addCase(vodStreams.pending, dataPending('vod', 'streams'))
            .addCase(vodStreams.fulfilled, dataFulfilled('vod', 'streams'))
            .addCase(vodStreams.rejected, dataRejected('vod', 'streams'))

            .addCase(vodInfo.pending, dataPending('vod', 'info'))
            .addCase(vodInfo.fulfilled, dataFulfilled('vod', 'info'))
            .addCase(vodInfo.rejected, dataRejected('vod', 'info'))



            .addCase(bouquets.pending, dataPending('bouquets'))
            .addCase(bouquets.fulfilled, dataFulfilled('bouquets'))
            .addCase(bouquets.rejected, dataRejected('bouquets'))
    },
})

export const { resetBouquets, resetLiveCategories, resetLiveStreams, resetSeriesCategories, resetSeriesInfo, resetSeriesStreams, resetVodCategories, resetVodInfo, resetVodStreams } = playerSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.player.value)`
export const selectPlayer = (state: AppState) => state.player

export default playerSlice.reducer