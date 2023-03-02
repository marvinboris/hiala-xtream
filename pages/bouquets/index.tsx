import { ReactElement, useEffect } from 'react'

import { NextPageWithLayout } from '../_app'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import BouquetType from '../../app/types/bouquet'
import Status from '../../app/types/status'

import Layout, { Head } from '../../components/frontend/navigation/layout'
import PageError from '../../components/frontend/ui/page/error'
import PageLoader from '../../components/frontend/ui/page/loader'
import Bouquet from '../../components/frontend/ui/blocks/player/bouquets/bouquet'

import { selectPlayer, bouquets, resetBouquets } from '../../features/player/playerSlice'

const params = {
  link: '/bouquets',
  title: "Bouquets | Hiala TV",
  description: "Hiala TV: TV, sports, séries, films en streaming en direct live | Hiala TV Cameroun."
}

const BouquetsPage: NextPageWithLayout = () => {
  const dispatch = useAppDispatch()
  const { bouquets: { data, status } } = useAppSelector(selectPlayer)

  useEffect(() => {
    if (status === Status.IDLE) dispatch(bouquets())

    return () => {
      dispatch(resetBouquets())
    }
  }, [])

  const maxBouquetNumber = data !== null && 'length' in data && Math.max(...data.map(bouquet => bouquet.bouquet_channels.length))

  const renderBouquet = (bouquet: BouquetType, index: number) => {
    const bouquet_name = bouquet.bouquet_name.toLocaleLowerCase()
    return <div key={`bouquet-${bouquet.id}-${index}`} className='inline-block w-[220px] md:w-auto'>
      <Bouquet
        {...bouquet}
        favorite={maxBouquetNumber === bouquet.bouquet_channels.length}
        price={bouquet_name === 'passion' ? 3000 : bouquet_name === 'magic' ? 5000 : bouquet_name === 'charme' ? 2000 : bouquet_name === 'canal+' ? 12000 : 2} />
    </div>
  }

  const bouquetsContent = data !== null && 'length' in data && data.map(renderBouquet)

  return <>
    <Head {...params} />
    {status === Status.LOADING ? <PageLoader /> : <main className='relative overflow-hidden z-0'>
      <div className="hidden md:block w-[540px] h-[540px] -z-10 rounded-full bg-gradient-to-b from-green/10 to-transparent absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 p-[50px]">
        <div className="rounded-full w-full h-full bg-secondary-700" />
      </div>
      {status === Status.FAILED ? <PageError /> : <section id="bouquets" aria-label='Bouquets' className='landing-layer'>
        <div className="md:hidden carousel bouquets space-x-5">{bouquetsContent}</div>
        <div className="container hidden md:grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{bouquetsContent}</div>
      </section>}
    </main>}
  </>
}

BouquetsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default BouquetsPage