import { capitalize } from "lodash";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import 'video.js/dist/video-js.css';

import { NextPageWithLayout } from "../../../_app";

import { useCategoriesContext } from "../../../../app/contexts/categories";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import Status from "../../../../app/types/status";
import SeriesEpisodeType from "../../../../app/types/series/episode";

import Layout, { Head } from "../../../../components/frontend/navigation/layout";
import Video from "../../../../components/frontend/ui/blocks/player/ui/video";
import PageError from "../../../../components/frontend/ui/page/error";
import PageLoader from "../../../../components/frontend/ui/page/loader";

import { seriesInfo, selectPlayer, seriesStreams } from "../../../../features/player/playerSlice";

const SeriesEpisodeStreamPage: NextPageWithLayout = () => {
    const { seriesCategories: categories } = useCategoriesContext()
    const { query: { category: categorySlug, series, slug } } = useRouter()

    const [categoryName, setCategoryName] = useState('')
    const [seriesName, setSeriesName] = useState('')
    const [info, setInfo] = useState<SeriesEpisodeType | null>(null)

    const dispatch = useAppDispatch()
    const { series: { streams, info: { data, status } } } = useAppSelector(selectPlayer)

    const params = {
        link: `/series/${categorySlug}/${series}/${slug}`,
        title: `${info ? `${info.stream.stream_display_name} | ` : ''}${seriesName} | Séries | ${categoryName} | Hiala TV`,
        description: "Hiala TV: TV, sports, séries, films en streaming en direct live | Hiala TV Cameroun."
    }

    const category = categories?.find(c => c.slug === categorySlug)!
    const { category_name, id } = category

    useEffect(() => {
        setCategoryName(capitalize(category_name.toLocaleLowerCase()))
        dispatch(seriesStreams(id))
    }, [])

    useEffect(() => {
        if (streams.data && seriesName === '') {
            const { title, id } = streams.data.find(s => s.slug === series)!
            setSeriesName(title)
            dispatch(seriesInfo(id))
        }
    }, [streams])

    useEffect(() => {
        if (data !== null && info === null) {
            const info = data.find(episode => episode.stream.slug === slug)!
            setInfo(info)
        }
    }, [data, info])

    return <>
        <Head {...params} />
        {status === Status.LOADING ? <PageLoader /> : status === Status.FAILED ? <PageError /> : info !== null ? <Video category={category} info={info} /> : null}
    </>
}

SeriesEpisodeStreamPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout videoPage>{page}</Layout>
}

export default SeriesEpisodeStreamPage