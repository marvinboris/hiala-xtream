import { capitalize } from 'lodash'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { useCategoriesContext } from '../../../../../../../app/contexts/categories'
import { useAppSelector } from '../../../../../../../app/hooks'
import SeriesEpisodeType from '../../../../../../../app/types/series/episode'

import { selectPlayer } from '../../../../../../../features/player/playerSlice'

import VideoView from './video'

export default function SerieView() {
    const { push } = useRouter()
    const { series: { streams, info: { data } } } = useAppSelector(selectPlayer)
    const { seriesCategories: categories } = useCategoriesContext()

    let [isOpen, setIsOpen] = useState<boolean>(false)
    const [search, setSearch] = useState('')

    const renderStream = (episode: SeriesEpisodeType) => <div key={`series-episode-${episode.id}`} onClick={() => {
        const series = streams.data?.find(series => series.id === episode.series_id)!
        const category = categories?.find(category => category.id === series.category_id)!
        const stream = data?.find(_episode => _episode.id === episode.id)!

        setIsOpen(false)
        setSearch('')
        push(`/series/${category.slug}/${series.slug}/${stream.stream.slug}`, undefined, { shallow: true })
    }} className='cursor-pointer flex items-center px-2.5 h-14 bg-secondary-900 hover:bg-secondary-700 transition-all duration-200 text-sm'>
        <div className='truncate text-secondary-400' title={episode.stream.stream_display_name}>{capitalize(episode.stream.stream_display_name.toLocaleLowerCase())}</div>
    </div>

    const episodesContent = data !== null && data.filter(episode => episode.stream.stream_display_name.toLowerCase().includes(search.toLowerCase())).map(renderStream)

    return <VideoView isOpen={isOpen} setIsOpen={setIsOpen} search={search} setSearch={setSearch} placeholder="Rechercher une série...">
        <div className="divide-y divide-secondary-500">
            {episodesContent}
        </div>
    </VideoView>
}