import { capitalize } from 'lodash'
import { useRouter } from 'next/router'
import { ReactElement, useEffect } from 'react'

import { NextPageWithLayout } from '../_app'

import { useCategoriesContext } from '../../app/contexts/categories'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Status from '../../app/types/status'

import BouquetAccordion from '../../components/frontend/bouquets/accordion'
import BouquetSubscribe from '../../components/frontend/bouquets/subscribe'
import Layout, { Head } from '../../components/frontend/navigation/layout'
import PageError from '../../components/frontend/ui/page/error'
import PageLoader from '../../components/frontend/ui/page/loader'
import Button from '../../components/ui/button'
import View from '../../components/ui/view'

import { selectPlayer, bouquets, resetBouquets } from '../../features/player/playerSlice'

const BouquetPage: NextPageWithLayout = () => {
    const { liveCategories } = useCategoriesContext()

    const { query } = useRouter()
    const id = query.id as string

    const dispatch = useAppDispatch()
    const { bouquets: { data: rawData, status } } = useAppSelector(selectPlayer)

    useEffect(() => {
        if (status === Status.IDLE) dispatch(bouquets(+id))

        return () => {
            dispatch(resetBouquets())
        }
    }, [])

    const data = rawData !== null && 'id' in rawData && rawData

    const categories = data && liveCategories && liveCategories.map(category => ({
        ...category,
        channels: data.channels.filter(channel => channel.category_id === category.id)
    }))

    const channelsContent = data && liveCategories && [...liveCategories].sort((a, b) => a.category_name.localeCompare(b.category_name)).map(category => {
        const category_channels = data.channels.filter(channel => channel.category_id === category.id).map(channel => <div key={`channel-${channel.id}`} className='rounded-2xl bg-white shadow-sm flex items-center space-x-2'>
            <div className="aspect-square w-16 rounded-2xl rounded-r-none relative p-4 flex items-center justify-center overflow-hidden z-0">
                <img src={`/api/assets?src=${channel.stream_icon}`} alt={channel.stream_display_name} className="w-full h-full object-contain" />
                <img src={`/api/assets?src=${channel.stream_icon}`} alt={channel.stream_display_name} className="w-full h-full object-cover absolute inset-0 -z-10 blur-3xl scale-150" />
            </div>

            <div className='truncate text-secondary-700' title={channel.stream_display_name}>{capitalize(channel.stream_display_name.toLocaleLowerCase())}</div>
        </div>)

        return category_channels.length > 0 ? <div key={`bouquet-page-live-category-${category.id}`}>
            <div className='text-xl font-semibold mb-4'>{category.category_name}</div>

            <div className='grid grid-cols-3 gap-2'>{category_channels}</div>
        </div> : null
    })

    return <>
        <Head {...{
            link: `/bouquets/${data && data.id}`,
            title: `${data && (`${data.bouquet_name} | `)}Bouquets | Hiala TV`,
            description: "Hiala TV: TV, sports, séries, films en streaming en direct live | Hiala TV Cameroun."
        }} />
        {status === Status.LOADING ? <PageLoader /> : <main>
            <header className="container flex items-center space-x-5">
                <h1 className="page-title">{data && data.bouquet_name}</h1>
                {data && <div>
                    <View title={`Souscrire au bouquet ${data.bouquet_name}`} action={<Button color='primary'>Souscrire</Button>}>
                        <BouquetSubscribe amount={2} name={data.bouquet_name} id={data.id} />
                    </View>
                </div>}
            </header>

            {status === Status.FAILED ? <PageError /> : <section id="bouquets" aria-label='Bouquets' className='landing-layer'>
                <div className="container">
                    <div className="grid gap-4 grid-cols-2">
                        {channelsContent}
                    </div>
                    {/* {data && categories && <BouquetAccordion categories={categories} />} */}
                </div>
            </section>}
        </main>}
    </>
}

BouquetPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

export default BouquetPage