import { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../../../../../../../../app/hooks';

import Status from '../../../../../../../../app/types/status';
import SeriesStreamType from "../../../../../../../../app/types/series/stream";
import SeriesEpisodeType from '../../../../../../../../app/types/series/episode';

import { selectPlayer, seriesInfo } from '../../../../../../../../features/player/playerSlice';

import Switch from './switch';

interface ViewSeriesProps {
    series: SeriesStreamType
}

const classNames = (...c: string[]) => c.join(' ')

const EpisodePlot = ({ episodes }: { episodes: SeriesEpisodeType[] }) => <div className='space-y-4'>
    {episodes.map(episode => <div key={`series-info-episode-${episode.id}`} className='flex'>
        <div className='mr-2 w-1/4 hidden md:block'>
            <div className="ratio-16by9 bg-secondary-800">
                <img src={episode.stream.movie_propeties.movie_image} alt={episode.stream.stream_display_name} className="image-cover absolute inset-0" />
            </div>
        </div>

        <div className='flex-1'>
            <div className='text-white mb-4'>
                <div className="mt-2 font-semibold md:font-normal text-base md:text-lg">Épisode {episode.sort}</div>

                <div className='text-base'>{episode.stream.stream_display_name}</div>
            </div>

            <div className='text-base'>{episode.stream.movie_propeties.plot}</div>
        </div>
    </div>)}
</div>

const NoEpisodePlot = ({ episodes }: { episodes: SeriesEpisodeType[] }) => <div className='grid gap-x-2 gap-y-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
    {episodes.map(episode => <div key={`series-info-episode-${episode.id}`}>
        <div className="ratio-16by9 bg-secondary-800">
            <img src={episode.stream.movie_propeties.movie_image} alt={episode.stream.stream_display_name} className="image-cover absolute inset-0" />
        </div>

        <div className="mt-2 text-white text-sm md:text-lg">Épisode {episode.sort}</div>

        <div className="mt-1 text-sm md:text-base">{episode.stream.stream_display_name}</div>
    </div>)}
</div>

export default function ViewSeries({ series: info }: ViewSeriesProps) {
    const dispatch = useAppDispatch()
    const { series } = useAppSelector(selectPlayer)

    useEffect(() => {
        if (series.info.status === Status.IDLE) dispatch(seriesInfo(info.id))
    }, [])

    const allEpisodes = series.info.data || []

    function onlyUnique(value: number, index: number, self: number[]) {
        return self.indexOf(value) === index;
    }
    const seasons = series.info.data !== null && allEpisodes.map(episode => episode.season_num).filter(onlyUnique).sort()

    const [season, setSeason] = useState(!!seasons && seasons[0])
    const [episodePlot, setEpisodePlot] = useState(false)

    const episodes = allEpisodes.filter(episode => episode.season_num === season)

    useEffect(() => {
        if (!season && seasons && seasons.length > 0) setSeason(seasons[0])
    }, [season, seasons])


    const seasonsContent = !!seasons && seasons.map((s, index) => <div key={`series-info-season-${index}`} onClick={() => setSeason(s)} className={classNames("h-10 w-[56px] flex items-center justify-center text-white cursor-pointer", s === season ? 'bg-primary-600' : 'bg-secondary-700')}>{s}</div>)

    return <>
        <div className="mb-12 md:mb-5">
            <div className="md:w-3/4">
                <div className="mb-3 flex items-center space-x-2">
                    <div>Saison</div>
                    {seasonsContent}
                </div>

                <div className="mb-5 capitalize">{info.genre}, {info.releaseDate}</div>

                <div className="mb-3">{info.plot}</div>

                <div className="text-white">
                    <div>De: {info.cast}</div>
                    <div>Avec: {info.director}</div>
                </div>
            </div>
        </div>

        <div>
            <div className="md:flex justify-between mb-3">
                <div className="text-2xl">Épisodes</div>

                <div className='flex items-center space-x-4'>
                    <span className="text-primary-600">Résumés des épisodes</span>

                    <div>
                        <Switch checked={episodePlot} toggle={() => setEpisodePlot(!episodePlot)} />
                    </div>
                </div>
            </div>

            {episodePlot ? <EpisodePlot episodes={episodes} /> : <NoEpisodePlot episodes={episodes} />}
        </div>
    </>
}