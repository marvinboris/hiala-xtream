import { useRouter } from "next/router";
import { ReactElement, useEffect, useRef, useState } from "react";
import slugify from "slugify";
import videojs, { VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.css';

import { NextPageWithLayout } from "../_app";
import { useCategoriesContext } from "../../app/contexts/categories";
import Layout, { Head } from "../../components/frontend/navigation/Layout";
import LiveStream from "../../components/frontend/ui/blocks/player/live/stream";
import PageError from "../../components/frontend/ui/page/error";
import PageLoader from "../../components/frontend/ui/page/loader";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Status from "../../app/types/status";
import StreamCategoryType from "../../app/types/stream_category";
import StreamType from "../../app/types/stream";

import { liveStreams, selectPlayer } from "../../features/player/playerSlice";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const params = {
    link: '/chaines',
    title: "Chaînes | TV+",
    description: "TV+: TV, sports, séries, films en streaming en direct live ou replay | TV+ Cameroun."
}

const renderLiveStream = (liveStream: StreamType, index: number) => <LiveStream key={`liveStream-${liveStream.stream_display_name}-${index}`} {...liveStream} />

const LiveStreamsPage: NextPageWithLayout = () => {
    const { liveCategories } = useCategoriesContext()
    const { query: { slug }, back } = useRouter()

    const dispatch = useAppDispatch()
    const { live: { streams: { data, status } } } = useAppSelector(selectPlayer)

    useEffect(() => {
        if (slug !== undefined) {
            const { id } = liveCategories?.find(c => slugify(c.category_name) === slug[0]) as StreamCategoryType

            if (status === Status.IDLE) dispatch(liveStreams(id))
        }
    }, [])

    const videoRef = useRef(null);
    const playerRef = useRef<VideoJsPlayer | null>(null);
    const options = {
        mpegtsjs: {
            mediaDataSource: {
                isLive: true,
                cors: false,
                withCredentials: false,
            },
        },
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
            src: '/path/to/video.mp4',
            type: 'video/mp4'
        }]
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
            options.sources = info.stream_source.map(src => ({ src, type: 'application/x-mpegURL' }))

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
            if (player) {
                player.dispose();
                playerRef.current = null;
                videoRef.current = null
            }
        };
    }, [playerRef]);

    let content
    if (slug !== undefined) {
        if (slug.length === 1) {
            const liveStreamsContent = data !== null && data.map(renderLiveStream)

            content = <main>
                <header className="container">
                    <h1 className="page-title">Chaînes</h1>
                </header>

                <section id="lives" aria-label='Lives' className='landing-layer'>
                    <div className="container">
                        <div className="grid gap-x-1 gap-y-6 grid-cols-3 md:gap-x-2.5 md:grid-cols-5 lg:gap-y-2.5 lg:grid-cols-6 xl:grid-cols-7">
                            {liveStreamsContent}
                        </div>
                    </div>
                </section>
            </main>
        } else if (data) {
            const info = data.find(l => slugify(l.stream_display_name) === slug[1])!
            const { category_name } = liveCategories?.find(c => slugify(c.category_name) === slug[0]) as StreamCategoryType

            const liveStream = <div className="h-screen flex flex-col">
                <header className="container flex items-center h-[133px]">
                    <div className="mr-6 md:mr-12"><div onClick={back} className="cursor-pointer w-12 h-12 rounded-full flex items-center justify-center bg-white/30 text-white"><ArrowLeftIcon className="w-6" /></div></div>
                    <div>
                        <div className="text-xl font-bold text-white">{info.stream_display_name}</div>
                        <div className="text-sm">{category_name}</div>
                    </div>
                    <div className="ml-auto"><img src={`/api/assets?src=${info.stream_icon}`} alt="Stream Icon" className="h-12 object-center" /></div>
                </header>

                <div data-vjs-player>
                    <video ref={videoRef} className='video-js vjs-default-skin vjs-big-play-centered' />
                </div>
            </div>

            content = <main>
                {liveStream}
            </main>
        } else content = <></>
    }

    return <>
        <Head {...params} />
        {status === Status.LOADING ? <PageLoader /> : status === Status.FAILED ? <PageError /> : content}
    </>
}

LiveStreamsPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

export default LiveStreamsPage