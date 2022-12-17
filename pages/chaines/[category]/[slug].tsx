import { capitalize } from "lodash";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import slugify from "slugify";

import { NextPageWithLayout } from "../../_app";

import { useCategoriesContext } from "../../../app/contexts/categories";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Status from "../../../app/types/status";
import StreamType from "../../../app/types/stream";

import Layout, { Head } from "../../../components/frontend/navigation/Layout";
import Video from "../../../components/frontend/ui/blocks/player/ui/video";
import PageError from "../../../components/frontend/ui/page/error";
import PageLoader from "../../../components/frontend/ui/page/loader";

import { liveStreams as streams, selectPlayer } from "../../../features/player/playerSlice";

import 'video.js/dist/video-js.css';

const LiveStreamPage: NextPageWithLayout = () => {
    const dispatch = useAppDispatch()
    const { live: { streams: { data, status } } } = useAppSelector(selectPlayer)
    const { liveCategories: categories } = useCategoriesContext()
    const { query: { category: categorySlug, slug } } = useRouter()

    const [name, setName] = useState('')
    const [info, setInfo] = useState<StreamType | null>(null)

    const params = {
        link: `/chaines/${categorySlug}/${slug}`,
        title: `${info ? `${info.stream_display_name} | ` : ''}Chaînes | ${name} | Hiala TV`,
        description: "Hiala TV: TV, sports, séries, films en streaming en direct live | Hiala TV Cameroun."
    }

    const category = categories?.find(_category => slugify(_category.category_name, { lower: true }) === categorySlug)!
    const { category_name, id } = category

    useEffect(() => {
        setName(capitalize(category_name.toLocaleLowerCase()))
        dispatch(streams(id))
    }, [])

    useEffect(() => {
        if (data !== null && info === null) {
            const info = data.find(stream => slugify(stream.stream_display_name, { lower: true }) === slug)!
            setInfo(info)
        }
    }, [data, info])

    return <>
        <Head {...params} />
        {status === Status.LOADING ? <PageLoader /> : status === Status.FAILED ? <PageError /> : info !== null ? <Video live category={category} info={info} /> : null}
    </>
}

LiveStreamPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

export default LiveStreamPage