import { FilmIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ReactElement, useState, useEffect } from 'react'

import { NextPageWithLayout } from '../_app'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Status from '../../app/types/status'
import StreamType from '../../app/types/stream'

import Layout, { Head } from '../../components/frontend/navigation/Layout'
import VodStream from '../../components/frontend/ui/blocks/player/vod/stream'
import PageError from '../../components/frontend/ui/page/error'
import PageLoader from '../../components/frontend/ui/page/loader'
import PageTitle from '../../components/frontend/ui/page/title'
import Input from '../../components/ui/input'

import { vodStreams, selectPlayer } from '../../features/player/playerSlice'

const params = {
  link: '/films',
  title: "Films | TV+",
  description: "TV+: TV, sports, séries, films en streaming en direct live | TV+ Cameroun."
}

const renderVodStream = (vodStream: StreamType, index: number) => <VodStream key={`vodStream-${vodStream.stream_display_name}-${index}`} {...vodStream} />

const VodsPage: NextPageWithLayout = () => {
  const [search, setSearch] = useState('')

  const dispatch = useAppDispatch()
  const { vod: { streams: { data, status } } } = useAppSelector(selectPlayer)

  const vodStreamsContent = data !== null && data.filter(stream => stream.stream_display_name.toLowerCase().includes(search.toLowerCase())).map(renderVodStream)

  useEffect(() => {
    dispatch(vodStreams())
  }, [])

  return <>
    <Head {...params} />
    {status === Status.LOADING ? <PageLoader /> : <main>
      <PageTitle icon={FilmIcon} title="Films" subtitle="Retrouvez toutes vos chaînes préférées.">
        <div className='flex items-center space-x-3 lg:space-x-9'>
          <div className='hidden lg:block'>
            <Input type='search' name='search' icon={MagnifyingGlassIcon} onChange={e => setSearch(e.target.value)} value={search} className="bg-secondary-900" placeholder='Rechercher une chaîne...' />
          </div>

          <div className='w-[54px] h-[54px] cursor-pointer shadow-md rounded-full flex items-center justify-center bg-primary-600 text-white hover:bg-primary-800 transition-all duration-200'>
            <FunnelIcon className='w-6' />
          </div>
        </div>
      </PageTitle>

      {status === Status.FAILED ? <PageError /> : <section id="vods" aria-label='Vods' className='landing-layer'>
        <div className="container">
          {vodStreamsContent}
        </div>
      </section>}
    </main>}
  </>
}

VodsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default VodsPage