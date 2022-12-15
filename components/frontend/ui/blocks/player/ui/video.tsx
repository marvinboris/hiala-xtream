import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { AsyncThunk } from '@reduxjs/toolkit'
import { ReactNode, useEffect, useRef } from 'react'
import { useRouter } from "next/router"
import slugify from 'slugify'
import videojs, { VideoJsPlayer, VideoJsPlayerOptions, VideoJsPlayerPluginOptions } from 'video.js'

import { useAppDispatch } from '../../../../../../app/hooks'

import LiveStreamType from '../../../../../../app/types/live/stream'
import Status from "../../../../../../app/types/status"
import StreamType from '../../../../../../app/types/stream'
import StreamCategoryType from '../../../../../../app/types/stream_category'
import VodStreamType from '../../../../../../app/types/vod/stream'

import 'video.js/dist/video-js.css';

type VideoProps = {
    title: ReactNode
    live?: boolean
    data: StreamType[] | null
    status: Status
    categories: StreamCategoryType[] | null
    streams: AsyncThunk<LiveStreamType[], number | undefined, {}>
    render: (stream: StreamType, index: number) => JSX.Element
}

export default function Video({ title, live, data, status, categories, streams, render }: VideoProps) {
    const dispatch = useAppDispatch()

    const { query: { slug }, back } = useRouter()

    useEffect(() => {
        if (slug !== undefined) {
            const { id } = categories?.find(c => slugify(c.category_name) === slug[0]) as StreamCategoryType

            if (status === Status.IDLE) dispatch(streams(id))
        }
    }, [])

    const videoRef = useRef(null);
    const playerRef = useRef<VideoJsPlayer | null>(null);
    const options: VideoJsPlayerPluginOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
            src: '/path/to/video.mp4',
            type: 'video/mp4'
        }]
    }
    if (live) options.mpegtsjs = {
        mediaDataSource: {
            isLive: true,
            cors: false,
            withCredentials: false,
        },
    }

    const onReady = (player: VideoJsPlayer) => {
        playerRef.current = player;

        // You can handle player events here, for example:
        player.on('waiting', () => {
            videojs.log('player is waiting');
        });

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

    useEffect(() => {
        if (slug !== undefined && slug.length > 1 && data) {
            const info = data.find(l => slugify(l.stream_display_name) === slug[1])!
            options.sources = info.stream_source.map(src => ({ src, type: live ? 'application/x-mpegURL' : `video/${info.target_container[0]}` }))

            // Make sure Video.js player is only initialized once
            if (!playerRef.current) {
                const videoElement = videoRef.current;
                if (!videoElement) return;

                const player = playerRef.current = videojs(videoElement, options, () => {
                    videojs.log('player is ready');
                    onReady(player);
                });
            } else {
                const player = playerRef.current;

                player.autoplay(options.autoplay);
                player.src(options.sources);
            }
        }
    }, [slug, data]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                videojs.log('player disposed');

                player.dispose();
                playerRef.current = null;
                videoRef.current = null
            }
        };
    }, [playerRef]);

    let content = null
    if (slug !== undefined) {
        if (slug.length === 1) {
            const streamsContent = data !== null && data.map(render)

            content = <main>
                <header className="container">
                    <h1 className="page-title">{title}</h1>
                </header>

                <section id="streams" aria-label='Streams' className='landing-layer'>
                    <div className="container">
                        <div className="grid gap-x-1 gap-y-6 grid-cols-3 md:gap-x-2.5 md:grid-cols-5 lg:gap-y-2.5 lg:grid-cols-6 xl:grid-cols-7">
                            {streamsContent}
                        </div>
                    </div>
                </section>
            </main>
        } else if (data) {
            const info = data.find(l => slugify(l.stream_display_name) === slug[1])!
            const { category_name } = categories?.find(c => slugify(c.category_name) === slug[0]) as StreamCategoryType

            const stream = <div className="h-screen flex flex-col">
                <header className="container flex items-center h-20 lg:h-[133px]">
                    <div className="mr-6 md:mr-12"><div onClick={back} className="cursor-pointer w-12 h-12 rounded-full flex items-center justify-center bg-white/30 text-white"><ArrowLeftIcon className="w-6" /></div></div>
                    <div>
                        <div className="text-xl font-bold text-white">{info.stream_display_name}</div>
                        <div className="text-sm">{category_name}</div>
                    </div>
                    {live ? <div className="ml-auto"><img src={`/api/assets?src=${info.stream_icon}`} alt="Stream Icon" className="h-12 object-center" /></div> : null}
                </header>

                <div data-vjs-player>
                    <video ref={videoRef} className='video-js vjs-default-skin vjs-big-play-centered' />
                </div>
            </div>

            content = <main>
                {stream}
            </main>
        } else content = <></>
    }

    return content
}