import { capitalize } from "lodash";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import 'video.js/dist/video-js.css';

import { NextPageWithLayout } from "../../../_app";

import { useCategoriesContext } from "../../../../app/contexts/categories";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import SeriesEpisodeType from "../../../../app/types/series/episode";
import SeriesStreamType from "../../../../app/types/series/stream";
import Status from "../../../../app/types/status";
import StreamCategoryType from "../../../../app/types/stream_category";

import Layout, { Head } from "../../../../components/frontend/navigation/layout";
import Video from "../../../../components/frontend/ui/blocks/player/ui/video";
import SerieView from "../../../../components/frontend/ui/blocks/player/ui/view/serie";
import PageError from "../../../../components/frontend/ui/page/error";
import PageLoader from "../../../../components/frontend/ui/page/loader";

import { seriesInfo, selectPlayer, seriesStreams } from "../../../../features/player/playerSlice";

const SeriesEpisodeStreamPage: NextPageWithLayout = () => {
    const { seriesCategories: categories } = useCategoriesContext()
    const { query: { category: categorySlug, series: seriesSlug, slug: episodeSlug }, push } = useRouter()

    const [category, setCategory] = useState<StreamCategoryType | null>(null)
    const [series, setSeries] = useState<SeriesStreamType | null>(null)
    const [info, setInfo] = useState<SeriesEpisodeType | null>(null)

    const dispatch = useAppDispatch()
    const { series: { streams, info: { data, status } } } = useAppSelector(selectPlayer)

    const params = {
        link: `/series/${categorySlug}/${seriesSlug}/${episodeSlug}`,
        title: `${info ? `${info.stream.stream_display_name} | ` : ''}${series ? series.title : ''} | Séries | ${category ? `${capitalize(category.category_name.toLocaleLowerCase())} |` : ''} | Hiala TV`,
        description: "Hiala TV: TV, sports, séries, films en streaming en direct live | Hiala TV Cameroun."
    }

    useEffect(() => {
        dispatch(seriesStreams())
    }, [])

    useEffect(() => {
        const category = categories?.find(category => category.slug === categorySlug)!
        setCategory(category)
    }, [categorySlug])

    useEffect(() => {
        if (streams.data !== null) {
            const series = streams.data.find(series => series.slug === seriesSlug)!
            setSeries(series)
            dispatch(seriesInfo(series.id))
        }
    }, [streams.data, seriesSlug])

    useEffect(() => {
        if (data !== null) {
            const info = data.find(episode => episode.stream.slug === episodeSlug)!
            setInfo(info)
        }
    }, [data, episodeSlug])

    return <>
        <Head {...params} />
        {status === Status.LOADING ? <PageLoader /> : status === Status.FAILED ? <PageError /> : (info !== null && category !== null && data !== null) ? <Video category={category} info={info} onEnded={() => {
            const episode = data.find(episode => episode.sort === info.sort + 1 && episode.season_num === info.season_num)
            if (episode) push(`/series/${categorySlug}/${seriesSlug}/${episode.stream.slug}`)
            else {
                const episode = data.find(episode => episode.sort === 1 && episode.season_num === info.season_num + 1)
                if (episode) push(`/series/${categorySlug}/${seriesSlug}/${episode.stream.slug}`)
            }
        }}>
            <SerieView />
        </Video> : null}
    </>
}

SeriesEpisodeStreamPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout videoPage>{page}</Layout>
}

export default SeriesEpisodeStreamPage