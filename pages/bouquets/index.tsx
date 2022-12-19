import { ReactElement, useEffect } from 'react'

import { NextPageWithLayout } from '../_app'
import Layout, { Head } from '../../components/frontend/navigation/layout'
import PageError from '../../components/frontend/ui/page/error'
import PageLoader from '../../components/frontend/ui/page/loader'
import Bouquet from '../../components/frontend/ui/blocks/player/bouquets/bouquet'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectPlayer, bouquets, resetBouquets } from '../../features/player/playerSlice'
import Status from '../../app/types/status'
import BouquetType from '../../app/types/bouquet'

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
    return <Bouquet
      {...bouquet}
      key={`bouquet-${bouquet.id}-${index}`}
      favorite={maxBouquetNumber === bouquet.bouquet_channels.length}
      price={bouquet_name === 'passion' ? 3000 : bouquet_name === 'magic' ? 5000 : bouquet_name === 'charme' ? 2000 : bouquet_name === 'canal+' ? 12000 : 1} />
  }

  const bouquetsContent = data !== null && 'length' in data && data.map(renderBouquet)

  return <>
    <Head {...params} />
    {status === Status.LOADING ? <PageLoader /> : <main>
      <header className="container">
        <h1 className="page-title">Bouquets</h1>
        <p className="mt-4 text-lg text-white">Regardez vos programmes, films et séries favoris n'importe où et à n'importe quel moment.</p>
      </header>

      {status === Status.FAILED ? <PageError /> : <section id="bouquets" aria-label='Bouquets' className='landing-layer'>
        <div className="container">
          <div className='-mx-4 mt-16 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none xl:grid-cols-4 xl:mx-0 xl:gap-x-8'>
            {bouquetsContent}
          </div>
        </div>
      </section>}
    </main>}
  </>
}

BouquetsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default BouquetsPage