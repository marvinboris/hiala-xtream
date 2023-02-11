import { capitalize } from "lodash";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import 'video.js/dist/video-js.css';

import { NextPageWithLayout } from "../../_app";

import { useCategoriesContext } from "../../../app/contexts/categories";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Status from "../../../app/types/status";
import StreamType from "../../../app/types/stream";

import Layout, { Head } from "../../../components/frontend/navigation/layout";
import Video from "../../../components/frontend/ui/blocks/player/ui/video";
import PageError from "../../../components/frontend/ui/page/error";
import PageLoader from "../../../components/frontend/ui/page/loader";

import { vodStreams as streams, selectPlayer } from "../../../features/player/playerSlice";

const VodStreamPage: NextPageWithLayout = () => {
    const { vodCategories: categories } = useCategoriesContext()
    const { query: { category: categorySlug, slug } } = useRouter()

    const [name, setName] = useState('')
    const [info, setInfo] = useState<StreamType | null>(null)

    const dispatch = useAppDispatch()
    const { vod: { streams: { data, status } } } = useAppSelector(selectPlayer)

    const params = {
        link: `/films/${categorySlug}/${slug}`,
        title: `${info ? `${info.stream_display_name} | ` : ''}Films | ${name} | Hiala TV`,
        description: "Hiala TV: TV, sports, séries, films en streaming en direct live | Hiala TV Cameroun."
    }

    const category = categories?.find(c => c.slug === categorySlug)!
    const { category_name, id } = category

    useEffect(() => {
        setName(capitalize(category_name.toLocaleLowerCase()))
        dispatch(streams(id))
    }, [])

    useEffect(() => {
        if (data !== null && info === null) {
            const info = data.find(stream => stream.slug === slug)!
            setInfo(info)
        }
    }, [data, info])

    return <>
        <Head {...params} />
        {status === Status.LOADING ? <PageLoader /> : status === Status.FAILED ? <PageError /> : info !== null ? <Video category={category} info={info} /> : null}
    </>
}

VodStreamPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout videoPage>{page}</Layout>
}

export default VodStreamPage