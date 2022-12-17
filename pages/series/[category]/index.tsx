import { CameraIcon, FilmIcon } from "@heroicons/react/24/outline";
import { capitalize } from "lodash";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import slugify from "slugify";
import 'video.js/dist/video-js.css';

import { NextPageWithLayout } from "../../_app";

import { useCategoriesContext } from "../../../app/contexts/categories";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Status from "../../../app/types/status";
import SeriesStreamType from "../../../app/types/series/stream";
import StreamCategoryType from "../../../app/types/stream_category";

import Layout, { Head } from "../../../components/frontend/navigation/Layout";
import SeriesStream from "../../../components/frontend/ui/blocks/player/series/stream";
import PageError from "../../../components/frontend/ui/page/error";
import PageLoader from "../../../components/frontend/ui/page/loader";
import PageTitle from "../../../components/frontend/ui/page/title";

import { seriesStreams, selectPlayer } from "../../../features/player/playerSlice";

const renderSeriesStream = (seriesStream: SeriesStreamType, index: number) => <SeriesStream key={`seriesStream-${seriesStream.id}-${index}`} {...seriesStream} />

const SeriesStreamsPage: NextPageWithLayout = () => {
    const [name, setName] = useState('')
    const [search, setSearch] = useState('')

    const { seriesCategories } = useCategoriesContext()
    const { query: { category } } = useRouter()

    const dispatch = useAppDispatch()
    const { series: { streams: { data, status } } } = useAppSelector(selectPlayer)

    useEffect(() => {
        const { category_name, id } = seriesCategories?.find(c => slugify(c.category_name, { lower: true }) === category) as StreamCategoryType
        dispatch(seriesStreams(id))
        setName(capitalize(category_name.toLocaleLowerCase()))
    }, [])

    const seriesStreamsContent = data !== null && data.map(renderSeriesStream)

    const params = {
        link: `/series/${category}`,
        title: `Séries | ${name} | Hiala TV`,
        description: "Hiala TV: TV, sports, séries, films en streaming en direct live | Hiala TV Cameroun."
    }

    return <>
        <Head {...params} />
        {status === Status.LOADING ? <PageLoader /> : <main>
            <PageTitle icon={CameraIcon} title="Séries" subtitle="Retrouvez toutes vos séries préférées." search={search} setSearch={setSearch} />

            {status === Status.FAILED ? <PageError /> : <section id="series" aria-label='Series' className='landing-layer'>
                <div className="container">
                    <div className="px-5 grid gap-x-1 gap-y-6 grid-cols-3 md:gap-x-4 md:grid-cols-5 lg:gap-y-8 lg:grid-cols-6 xl:grid-cols-8">
                        {seriesStreamsContent}
                    </div>
                </div>
            </section>}
        </main>}
    </>
}

SeriesStreamsPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

export default SeriesStreamsPage