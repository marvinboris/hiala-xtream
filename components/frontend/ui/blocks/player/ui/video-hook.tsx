import { ArrowLeftIcon, HeartIcon } from '@heroicons/react/24/outline'
import { capitalize } from 'lodash'
import { useRouter } from "next/router"
import { ReactNode, useEffect } from 'react'
import { VideoJsPlayerPluginOptions } from 'video.js'

import { useAppSelector, usePlayer } from '../../../../../../app/hooks'
import SeriesEpisodeType from '../../../../../../app/types/series/episode'
import StreamType from '../../../../../../app/types/stream'
import StreamCategoryType from '../../../../../../app/types/stream_category'

import { selectAuth } from '../../../../../../features/auth/authSlice'

import 'video.js/dist/video-js.css';

type VideoProps = {
    live?: boolean
    info: StreamType | SeriesEpisodeType
    category: StreamCategoryType
    children?: ReactNode
}

export function VideoJS({ live, info, category, children }: VideoProps) {
    const { back, push } = useRouter()

    const { data: account } = useAppSelector(selectAuth)

    const type = 'stream_source' in info ? 'stream' : 'serie'
    const condition = account === null || !account.bouquet || !account.bouquet.find(bouquet => (type === 'stream' && bouquet.bouquet_channels.find(stream => stream === (info as StreamType).id)) || (type === 'serie' && bouquet.bouquet_series.find(serie => serie === (info as SeriesEpisodeType).series_id)))

    useEffect(() => {
        if (condition) push('/bouquets')
    }, [])

    useEffect(() => {

    }, [info])

    let content = null
    if (!condition) {
        const name = capitalize(category.category_name.toLocaleLowerCase())
        const sources = ('stream_source' in info ? info : info.stream).stream_source.map(src => ({ src, type: live ? 'application/x-mpegURL' : 'video/webm' }))

        const options: VideoJsPlayerPluginOptions = {
            autoplay: true,
            controls: true,
            responsive: true,
            fluid: true,
            sources
        }
        if (live) options.mpegtsjs = {
            mediaDataSource: {
                isLive: true,
                cors: false,
                withCredentials: false,
            },
        }
        const playerRef = usePlayer({ ...options });
        content = <main>
            <div className="h-screen flex flex-col">
                <header className="container flex items-center h-20 lg:h-[133px]">
                    <div className="mr-6 md:mr-12"><div onClick={back} className="cursor-pointer w-12 h-12 rounded-full flex items-center justify-center bg-white/30 text-white"><ArrowLeftIcon className="w-6" /></div></div>
                    {live ? <img src={`/api/assets?src=${('stream_source' in info ? info : info.stream).stream_icon}`} alt="Stream Icon" className="h-12 object-center mr-3" /> : null}
                    <div>
                        <div className="text-xl font-bold text-white">{('stream_source' in info ? info : info.stream).stream_display_name}</div>
                        <div className="text-sm">{name}</div>
                    </div>
                    <div className="ml-auto">{live ? children : <HeartIcon className="w-14 text-white" />}</div>
                </header>

                <div data-vjs-player>
                    <video ref={playerRef} className='video-js vjs-default-skin vjs-big-play-centered' />
                </div>
            </div>
        </main>
    }

    return content
}