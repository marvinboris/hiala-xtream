import { ArrowLeftIcon, HeartIcon } from '@heroicons/react/24/outline'
import { capitalize } from 'lodash'
import { useRouter } from "next/router"
import { ReactNode, useEffect, useRef } from 'react'
import videojs, { VideoJsPlayer, VideoJsPlayerPluginOptions } from 'video.js'

import { useAppSelector } from '../../../../../../app/hooks'
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

export default function Video({ live, info, category, children }: VideoProps) {
    const { back, push } = useRouter()

    const { data: account } = useAppSelector(selectAuth)

    const type = 'stream_source' in info ? 'stream' : 'serie'
    const condition = account === null || !account.bouquet || !account.bouquet.find(bouquet => (type === 'stream' && bouquet.bouquet_channels.find(stream => stream === (info as StreamType).id)) || (type === 'serie' && bouquet.bouquet_series.find(serie => serie === (info as SeriesEpisodeType).series_id)))

    useEffect(() => {
        if (condition) push('/bouquets')
    }, [])

    const videoRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<VideoJsPlayer & {
        landscapeFullscreen?: ({ }) => void
    } | null>(null);

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

    useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
            const videoElement = document.createElement("video-js");

            videoElement.classList.add('vjs-big-play-centered');
            videoRef.current?.appendChild(videoElement);

            const player = playerRef.current = videojs(videoElement, options, () => {
                videojs.log('player is ready');
            });

            // You could update an existing player in the `else` block here
            // on prop change, for example:
        } else {
            const player = playerRef.current;

            player.autoplay(options.autoplay);
            player.src(options.sources);
        }
    }, [options, videoRef]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <main>
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

                <div data-vjs-player className="flex-1">
                    <div ref={videoRef} className="h-full flex flex-col" />
                </div>
            </div>
        </main>
    );
}