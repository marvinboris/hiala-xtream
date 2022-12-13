import { ReactElement, useState, useEffect } from 'react'

import { NextPageWithLayout } from '../_app'
import Layout, { Head } from '../../components/frontend/navigation/Layout'
import LiveStream from '../../components/frontend/ui/blocks/player/live/stream'
import PageError from '../../components/frontend/ui/page/error'
import PageLoader from '../../components/frontend/ui/page/loader'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { liveStreams, selectPlayer } from '../../features/player/playerSlice'
import Status from '../../app/types/status'
import StreamType from '../../app/types/stream'
import PageTitle from '../../components/frontend/ui/page/title'
import { FunnelIcon, MagnifyingGlassIcon, TvIcon } from '@heroicons/react/24/outline'
import Input from '../../components/ui/input'

const params = {
  link: '/chaines',
  title: "Chaînes | TV+",
  description: "TV+: TV, sports, séries, films en streaming en direct live ou replay | TV+ Cameroun."
}

const renderLiveStream = (liveStream: StreamType, index: number) => <LiveStream key={`liveStream-${liveStream.stream_display_name}-${index}`} {...liveStream} />

const LivesPage: NextPageWithLayout = () => {
  const [search, setSearch] = useState('')

  const dispatch = useAppDispatch()
  const { live: { streams: { data, status } } } = useAppSelector(selectPlayer)

  const liveStreamsContent = data !== null && data.filter(stream => stream.stream_display_name.toLowerCase().includes(search.toLowerCase())).map(renderLiveStream)

  useEffect(() => {
    dispatch(liveStreams())
  }, [])

  return <>
    <Head {...params} />
    {status === Status.LOADING ? <PageLoader /> : <main>
      <PageTitle icon={TvIcon} title="Chaînes" subtitle="Retrouvez toutes vos chaînes préférées.">
        <div className='flex items-center space-x-9'>
          <div>
            <Input type='search' name='search' icon={MagnifyingGlassIcon} onChange={e => setSearch(e.target.value)} value={search} className="bg-secondary-900" placeholder='Rechercher une chaîne...' />
          </div>

          <div className='w-[54px] h-[54px] cursor-pointer shadow-md rounded-full flex items-center justify-center bg-primary-600 text-white hover:bg-primary-800 transition-all duration-200'>
            <FunnelIcon className='w-6' />
          </div>
        </div>
      </PageTitle>

      {status === Status.FAILED ? <PageError /> : <section id="lives" aria-label='Lives' className='landing-layer'>
        <div className="container">
          <div className="px-5 grid gap-x-1 gap-y-6 grid-cols-3 md:gap-x-4 md:grid-cols-5 lg:gap-y-8 lg:grid-cols-6 xl:grid-cols-8">
            {liveStreamsContent}
          </div>
        </div>
      </section>}
    </main>}
  </>
}

LivesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default LivesPage