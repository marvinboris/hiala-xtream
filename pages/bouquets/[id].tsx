import { useRouter } from 'next/router'
import { ReactElement, useEffect } from 'react'

import { NextPageWithLayout } from '../_app'
import Layout, { Head } from '../../components/frontend/navigation/Layout'
import PageError from '../../components/frontend/ui/page/error'
import PageLoader from '../../components/frontend/ui/page/loader'
import BouquetAccordion from '../../components/frontend/bouquets/accordion'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useCategoriesContext } from '../../app/contexts/categories'
import Status from '../../app/types/status'
import { selectPlayer, bouquets, resetBouquets } from '../../features/player/playerSlice'
import View from '../../components/ui/View'
import Button from '../../components/ui/button'
import BouquetSubscribe from '../../components/frontend/bouquets/subscribe'

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

    const channelsContent = data && liveCategories && liveCategories.map(category => {
        const category_channels = data.channels.filter(channel => channel.category_id === category.id).map(channel => <div key={`channel-${channel.id}`} className='rounded-sm bg-secondary-900 shadow-sm flex items-center space-x-2 p-2'>
            <div><img src={`/api/assets?src=${channel.stream_icon}`} alt={channel.stream_display_name} className="w-10 h-10 object-contain" /></div>

            <div>{channel.stream_display_name}</div>
        </div>)

        return <div key={`bouquet-page-live-category-${category.id}`}>
            <div>{category.category_name}</div>

            <div className='grid grid-cols-3 gap-4'>{category_channels}</div>
        </div>
    })

    return <>
        <Head {...{
            link: `/bouquets/${data && data.id}`,
            title: `${data && (`${data.bouquet_name} | `)}Les bouquets Hiala TV`,
            description: "Hiala TV: TV, sports, séries, films en streaming en direct live | Hiala TV Cameroun."
        }} />
        {status === Status.LOADING ? <PageLoader /> : <main>
            <header className="container flex items-center space-x-5">
                <h1 className="page-title">{data && data.bouquet_name}</h1>
                {data && <div>
                    <View title={`Souscrire au bouquet ${data.bouquet_name}`} action={<Button color='primary'>Souscrire</Button>}>
                        <BouquetSubscribe amount={100} name={data.bouquet_name} id={data.id} />
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