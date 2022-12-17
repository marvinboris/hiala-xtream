import { ArrowLeftIcon, HeartIcon } from '@heroicons/react/24/outline'
import { capitalize } from 'lodash'
import { useRouter } from "next/router"
import { VideoJsPlayerPluginOptions } from 'video.js'

import { usePlayer } from '../../../../../../app/hooks'
import SeriesEpisodeType from '../../../../../../app/types/series/episode'
import StreamType from '../../../../../../app/types/stream'
import StreamCategoryType from '../../../../../../app/types/stream_category'

import 'video.js/dist/video-js.css';

type VideoProps = {
    live?: boolean
    info: StreamType | SeriesEpisodeType
    category: StreamCategoryType
}

export default function Video({ live, info, category }: VideoProps) {
    const { back } = useRouter()
    
    const name = capitalize(category.category_name.toLocaleLowerCase())

    const options: VideoJsPlayerPluginOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: ('stream_source' in info ? info : info.stream).stream_source.map(src => ({ src, type: 'application/x-mpegURL' }))
    } 
    if (live) options.mpegtsjs = {
        mediaDataSource: {
            isLive: true,
            cors: false,
            withCredentials: false,
        },
    }
    const playerRef = usePlayer(options);

    return <main>
        <div className="h-screen flex flex-col">
            <header className="container flex items-center h-20 lg:h-[133px]">
                <div className="mr-6 md:mr-12"><div onClick={back} className="cursor-pointer w-12 h-12 rounded-full flex items-center justify-center bg-white/30 text-white"><ArrowLeftIcon className="w-6" /></div></div>
                <div>
                    <div className="text-xl font-bold text-white">{('stream_source' in info ? info : info.stream).stream_display_name}</div>
                    <div className="text-sm">{name}</div>
                </div>
                <div className="ml-auto">{live ? <img src={`/api/assets?src=${('stream_source' in info ? info : info.stream).stream_icon}`} alt="Stream Icon" className="h-12 object-center" /> : <HeartIcon className="w-14 text-white" />}</div>
            </header>

            <div data-vjs-player>
                <video ref={playerRef} className='video-js vjs-default-skin vjs-big-play-centered' />
            </div>
        </div>
    </main>
}