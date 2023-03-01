import { ReactNode, useEffect, useState } from 'react'
import NextHead from 'next/head'
import { useRouter } from 'next/router'

import CategoriesContext from '../../../../app/contexts/categories'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import Status from '../../../../app/types/status'

import Toolbar from '../toolbar'
import Footer from '../footer'
import LayoutError from './error'
import LayoutLoader from './loader'

import { liveCategories, selectPlayer, seriesCategories, vodCategories } from '../../../../features/player/playerSlice'

interface LayoutProps {
    videoPage?: boolean
    white?: boolean
    children: ReactNode
}

export default function Layout({ videoPage, white, children }: LayoutProps) {
    const router = useRouter()

    const dispatch = useAppDispatch()
    const { live, series, vod } = useAppSelector(selectPlayer)

    useEffect(() => {
        if (live.categories.status === Status.IDLE) dispatch(liveCategories())
        if (series.categories.status === Status.IDLE) dispatch(seriesCategories())
        if (vod.categories.status === Status.IDLE) dispatch(vodCategories())
    }, [])

    const loading = live.categories.status === Status.LOADING || series.categories.status === Status.LOADING || vod.categories.status === Status.LOADING
    const failed = live.categories.status === Status.FAILED || series.categories.status === Status.FAILED || vod.categories.status === Status.FAILED

    return loading ? <LayoutLoader /> : failed ? <LayoutError /> : (live.categories.data && series.categories.data && vod.categories.data) ? <CategoriesContext.Provider value={{ liveCategories: live.categories.data, seriesCategories: series.categories.data, vodCategories: vod.categories.data }}>
        {videoPage ? children : <div className='min-h-screen flex flex-col'>
            <Toolbar white={white} />

            <div className="main-wrapper">
                {children}
            </div>

            <Footer />
        </div>}
    </CategoriesContext.Provider> : null
}

export interface PageParams {
    link: string
    title: string
    description: string
}

export const Head = ({ link, title, description }: PageParams) => <NextHead>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={link} />

    <meta property='og:title' content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={link} />

    <meta property='twitter:title' content={title} />
    <meta property="twitter:description" content={description} />
</NextHead>