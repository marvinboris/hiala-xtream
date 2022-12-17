import { TvIcon } from "@heroicons/react/24/outline";
import { capitalize } from 'lodash'
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import slugify from "slugify";
import 'video.js/dist/video-js.css';

import { NextPageWithLayout } from "../../_app";

import { useCategoriesContext } from "../../../app/contexts/categories";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Status from "../../../app/types/status";
import StreamType from "../../../app/types/stream";
import StreamCategoryType from "../../../app/types/stream_category";

import Layout, { Head } from "../../../components/frontend/navigation/Layout";
import LiveStream from "../../../components/frontend/ui/blocks/player/live/stream";
import PageError from "../../../components/frontend/ui/page/error";
import PageLoader from "../../../components/frontend/ui/page/loader";
import PageTitle from "../../../components/frontend/ui/page/title";

import { liveStreams, selectPlayer } from "../../../features/player/playerSlice";

const renderLiveStream = (liveStream: StreamType, index: number) => <LiveStream key={`liveStream-${liveStream.stream_display_name}-${index}`} {...liveStream} />

const LiveStreamsPerCategoryPage: NextPageWithLayout = () => {
    const [name, setName] = useState('')
    const [search, setSearch] = useState('')

    const { liveCategories } = useCategoriesContext()
    const { query: { category } } = useRouter()

    const dispatch = useAppDispatch()
    const { live: { streams: { data, status } } } = useAppSelector(selectPlayer)

    useEffect(() => {
        const { category_name, id } = liveCategories?.find(c => slugify(c.category_name, { lower: true }) === category) as StreamCategoryType
        dispatch(liveStreams(id))
        setName(capitalize(category_name.toLocaleLowerCase()))
    }, [])

    const liveStreamsContent = data !== null && data.filter(stream => stream.stream_display_name.toLowerCase().includes(search.toLowerCase())).map(renderLiveStream)

    const params = {
        link: `/chaines/${category}`,
        title: `Chaînes | ${name} | Hiala TV`,
        description: "Hiala TV: TV, sports, séries, films en streaming en direct live | Hiala TV Cameroun."
    }

    return <>
        <Head {...params} />
        {status === Status.LOADING ? <PageLoader /> : <main>
            <PageTitle icon={TvIcon} title={`Chaînes | ${name}`} subtitle={`Retrouvez toutes vos chaînes ${name} préférées.`} search={search} setSearch={setSearch} />

            {status === Status.FAILED ? <PageError /> : <section id="lives" aria-label='Lives' className='landing-layer'>
                <div className="container">
                    <div className="px-5 grid gap-x-1 gap-y-6 grid-cols-3 md:gap-x-4 md:grid-cols-5 lg:gap-y-8 lg:grid-cols-6 xl:grid-cols-8">
                        {liveStreamsContent}
                    </div>
                </div>
            </section>}
        </main>}
    </>
}

LiveStreamsPerCategoryPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

export default LiveStreamsPerCategoryPage