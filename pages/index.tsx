import { PlayIcon } from '@heroicons/react/20/solid'
import { ArrowRightIcon, FilmIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { ReactElement, useEffect } from 'react'

import { NextPageWithLayout } from './_app'

import { useCategoriesContext } from '../app/contexts/categories'
import { assets, classNames } from '../app/helpers/utils'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import SeriesStreamType from '../app/types/series/stream'
import Status from '../app/types/status'
import StreamType from '../app/types/stream'

import Layout, { Head } from '../components/frontend/navigation/layout'
import SeriesStream from '../components/frontend/ui/blocks/player/series/stream'
import VodStream from '../components/frontend/ui/blocks/player/vod/stream'
import View from '../components/frontend/ui/blocks/player/ui/view'
import PageError from '../components/frontend/ui/page/error'
import PageLoader from '../components/frontend/ui/page/loader'
import LiveStream from '../components/frontend/ui/blocks/player/live/stream'

import { selectAuth } from '../features/auth/authSlice'
import { liveStreams, selectPlayer, seriesStreams, vodStreams } from '../features/player/playerSlice'

const params = {
  link: '/',
  title: "Hiala TV",
  description: "Hiala TV: TV, sports, séries, films en streaming en direct live | Hiala TV Cameroun."
}

interface OfflineSectionProps {
  title?: string
  subtitle: string
  description: string
  more?: string
  href?: string
  data?: StreamType[] | SeriesStreamType[]
  children?: React.ReactElement
}

const BorderedSection = ({ title, subtitle, description, more, href, data }: OfflineSectionProps) => {
  const dataContent = data?.map((item, index) => <div key={`section-${title}-stream-${item.id}`} className={index % 2 === 0 ? classNames('row-span-2', index === 0 ? 'order-2 md:order-4' : index === 2 ? "order-4 md:order-5" : index === 4 ? "order-6 md:order-8" : index === 6 ? "order-8 md:order-9" : "") : classNames(index === 1 ? "order-3 md:order-2" : index === 3 ? "order-5 md:order-3" : index === 5 ? "order-7 md:order-6" : index === 7 ? "order-9 md:order-7" : "")}>
    <div className={classNames(index % 2 === 0 ? "aspect-[3/4]" : "aspect-video", 'rounded relative overflow-hidden cursor-pointer')}>
      <View stream={item} action={<>
        <img src={assets("cover" in item ? item.cover : item.movie_propeties.cover_big)} alt="Stream image" className="image-cover absolute inset-0" />
      </>} />
    </div>
  </div>)

  return <section className='my-12'>
    <div className="container grid grid-cols-2 gap-[9px] md:grid-cols-4 md:grid-flow-col md:gap-3 md:grid-rows-[3fr_4fr_3fr]">
      <header className="bg-secondary-800 rounded px-5 md:px-3 py-8 md:py-5 col-span-2 md:col-span-1 md:row-span-2 order-1">
        <div className="text-primary-600 font-bold mb-1.5">{title}</div>

        <div className="text-white text-xl font-semibold mb-3">{subtitle}</div>

        <div className="text-sm mb-4">{description}</div>

        <Link href={href!}>
          <a className='btn btn-secondary'>{more}</a>
        </Link>
      </header>

      {dataContent}
    </div>
  </section>
}

const BorderlessSection = ({ subtitle, description, children }: OfflineSectionProps) => <section className='my-12'>
  <div className="container">
    <header>
      <div className="text-white text-xl font-semibold mb-3">{subtitle}</div>

      <div className="text-sm mb-4">{description}</div>
    </header>

    {children}
  </div>
</section>

interface OnlineSectionProps {
  title: React.ReactNode
  content: React.ReactNode
  wrapped?: boolean
  href: string
}

const Section = ({ title, content, wrapped, href }: OnlineSectionProps) => <section className={wrapped ? '' : "py-5"}>
  <div className="container flex items-center">
    <div className='relative pr-2.5 mr-2.5'>
      <FilmIcon className='w-5 lg:w-7 text-primary-600' />
      <div className="bg-white/20 w-1 lg:w-1.5 h-1 lg:h-1.5 rounded-full absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2" />
    </div>
    <div>
      <h2 className="text-white font-bold text-xl lg:text-[30px]">{title}</h2>
    </div>
    <div className="ml-auto">
      <Link href={href}>
        <a className='inline-flex items-center group'>
          <div className='text-white/30 mr-2.5 group-hover:text-white transition-all duration-200 text-sm lg:text-base'>View All</div>
          <div className='mr-1.5'><div className="rounded-full w-1 lg:w-1.5 h-1 lg:h-1.5 bg-white/40 group-hover:bg-white transition-all duration-200" /></div>
          <div><ArrowRightIcon className='w-3 lg:w-5 text-white' /></div>
        </a>
      </Link>
    </div>
  </div>

  <div className="carousel">
    {content}
  </div>
</section>

const HomePage: NextPageWithLayout = () => {
  const { liveCategories } = useCategoriesContext()

  const dispatch = useAppDispatch()
  const { data: account } = useAppSelector(selectAuth)
  const { live, series, vod } = useAppSelector(selectPlayer)

  useEffect(() => {
    if (live.streams.status === Status.IDLE) dispatch(liveStreams())
    if (series.streams.status === Status.IDLE) dispatch(seriesStreams())
    if (vod.streams.status === Status.IDLE) dispatch(vodStreams())
  }, [])

  const loading = series.streams.status === Status.LOADING || vod.streams.status === Status.LOADING
  const failed = series.streams.status === Status.FAILED || vod.streams.status === Status.FAILED

  let content
  if (account) {
    // const renderVodStreamHeader = (vodStream: StreamType, index: number) => <VodStreamHeader key={`vod-stream-header-${vodStream.added}-${index}`} {...vodStream} />
    // const renderLiveCategory = (liveCategory: StreamCategoryType, index: number) => <LiveCategory key={`liveCategory-${liveCategory.id}-${index}`} {...liveCategory} />
    const renderLiveStream = (liveStream: StreamType, index: number) => <div key={`live-stream-${liveStream.added}-${index}`} className='inline-block w-1/3 sm:w-1/4 md:w-1/5 lg:1/6 xl:w-[12.5%] px-1 lg:px-2'><LiveStream {...liveStream} /></div>
    const renderVodStream = (vodStream: StreamType, index: number) => <VodStream key={`vod-stream-${vodStream.added}-${index}`} {...vodStream} />
    const renderSeriesStream = (seriesStream: SeriesStreamType, index: number) => <SeriesStream key={`series-stream-${seriesStream.id}-${index}`} {...seriesStream} />

    // const liveCategoriesContent = liveCategories !== null && liveCategories.map(renderLiveCategory)
    const liveStreamsContent = live.streams.data !== null && live.streams.data.map(renderLiveStream)
    const seriesStreamsContent = series.streams.data !== null && series.streams.data.map(renderSeriesStream)
    const vodStreamsContent = vod.streams.data !== null && vod.streams.data.map(renderVodStream)
    // const vodStreamsHeaderContent = vod.streams.data !== null && vod.streams.data.map(renderVodStreamHeader)

    content = <>
      {/* <header className="carousel">
        {vodStreamsHeaderContent}
      </header>

      <section id="live-categories" aria-label="Live categories" className='app-section'>
        <div className="carousel">
          {liveCategoriesContent}
        </div>
      </section> */}

      <Section title="Activités récentes" content={vodStreamsContent} href='/films' />
      <div className="container py-5">
        <div className="rounded-[25px] bg-secondary-800 py-6">
          <Section wrapped title="Chaînes populaires" content={liveStreamsContent} href='/chaines' />
        </div>
      </div>
      <Section title="Films les mieux notés" content={vodStreamsContent} href='/films' />
      <Section title="Séries les mieux notées" content={seriesStreamsContent} href='/series' />
      <Section title="Films populaires" content={vodStreamsContent} href='/films' />
      <Section title="Séries populaires" content={seriesStreamsContent} href='/series' />
    </>
  } else {
    content = <>
      <header className="h-[500px] relative bg-secondary-800 flex flex-col justify-end">
        {series.streams.data && <img src={assets(series.streams.data[0].cover)} alt="BG Home" className='image-cover absolute inset-0' />}
        <div className="container z-20 after:absolute after:inset-0 after:bg-gradient-to-t after:from-black after:to-transparent after:-z-10">
          <h2 className="mb-1 text-2xl text-white font-bold">Ne cherchez pas, vous ne trouverez pas + ailleurs</h2>

          <p>Regardez le meilleur des séries, des films et du sport en streaming et en illimité.</p>

          <div className="pt-4 pb-8 flex items-center justify-between">
            <div className="relative">
              <Link href='/bouquets'>
                <a className='btn btn-primary'>Découvrir nos bouquets</a>
              </Link>
            </div>

            <div className="rounded w-12 h-12 bg-secondary-900/50 text-white flex items-center justify-center"><PlayIcon className='w-8' /></div>
          </div>
        </div>
      </header>

      {series.streams.data && <BorderedSection
        title='Séries'
        subtitle='Des séries à consommer sans modération'
        description='Les meilleures séries novelas et africaines et de grandes séries internationales à succès.'
        more='Toutes les séries Hiala TV'
        href='/series'
        data={series.streams.data}
      />}

      {vod.streams.data && <BorderedSection
        title='Films'
        subtitle='Des films à consommer sans modération'
        description='Les meilleurs films africains et de grands films internationaux à succès.'
        more='Tous les films Hiala TV'
        href='/films'
        data={vod.streams.data.filter((s, i) => i < (vod.streams.data!.length - vod.streams.data!.length % 4))}
      />}

      {<BorderlessSection
        subtitle='PLUS QUE Hiala TV DANS Hiala TV'
        description='Hiala TV rassemble les meilleurs contenus. Des milliers de programmes en live et à la demande, partout et quand vous voulez'
      >
        <div className="grid grid-cols-4"></div>
      </BorderlessSection>}
    </>
  }

  return <>
    <Head {...params} />
    {loading ? <PageLoader /> : failed ? <PageError /> : <main>
      {content}
    </main>}
  </>
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default HomePage