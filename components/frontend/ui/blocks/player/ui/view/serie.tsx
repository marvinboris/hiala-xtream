import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { useCategoriesContext } from '../../../../../../../app/contexts/categories'
import { assets, classNames } from '../../../../../../../app/helpers/utils'
import { useAppSelector } from '../../../../../../../app/hooks'
import SeriesEpisodeType from '../../../../../../../app/types/series/episode'

import { selectPlayer } from '../../../../../../../features/player/playerSlice'

import Button from './ui/button'

type SerieViewProps = {
    info: SeriesEpisodeType
}

const onlyUnique = (value: number, index: number, self: number[]) => self.indexOf(value) === index;

const formatTime = (duration: number) => <>{Math.floor(duration / 60 / 60) ? `${Math.floor(duration / 60 / 60)}h` : ""}{Math.round(duration / 60) % 60}min</>

export default function SerieView({ info }: SerieViewProps) {
    const { series: { streams, info: { data } } } = useAppSelector(selectPlayer)
    const { seriesCategories: categories } = useCategoriesContext()

    const seasons = data !== null ? data.map(episode => episode.season_num).filter(onlyUnique).sort() : []
    const series = streams.data?.find(s => s.id === info.series_id)

    const [season, setSeason] = useState(info.season_num)

    const totalSeconds = data !== null ? data.reduce((a, b) => a + (b.stream.movie_propeties.duration_secs || series?.episode_run_time || 0), 0) : 0

    return <>
        <div className="bg-primary-800/5 lg:bg-white lg:border-b border-secondary-600/20 lg:sticky top-0 z-10">
            <div className="h-[123px] lg:h-[135px] container flex lg:items-center pt-[22px] lg:pt-0">
                <div className='text-sm lg:hidden'>
                    <div><span className="font-bold">Date de sortie :</span> {series?.releaseDate}</div>
                    <div><span className="font-bold">Nombre de saisons :</span> {seasons.length}</div>
                    <div><span className="font-bold">Durée totale :</span> {Math.floor(totalSeconds / 60 / 60)}h{Math.round(totalSeconds / 60) % 60}</div>
                    <div><span className="font-bold">Catégorie :</span> <span className="capitalize">{info.stream.movie_propeties.genre}</span></div>
                </div>

                <div className="ml-auto lg:hidden">
                    <Button icon={MagnifyingGlassIcon} />
                </div>

                <div className="space-y-2 w-full hidden lg:block">
                    <div className="font-bold text-[25px]">Toutes les saisons</div>
                    <div className='bg-secondary-600/10 rounded-lg px-6'>
                        <select className="h-11 w-full outline-none hidden lg:block bg-transparent text-secondary-600/30" value={season} onChange={e => setSeason(+e.target.value)}>
                            {seasons.map(s => <option key={`option-${s}`} value={s}>Saison {s}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-flow-col grid-rows-1 divide-x overflow-auto lg:hidden">
            {seasons.map(s => <div key={`season-${s}`}><button onClick={() => setSeason(s)} className={classNames('h-11 w-[116px] flex items-center justify-center text-sm', season === s ? "bg-green text-white font-bold" : "bg-[#D9D9D94D]")}>Saison {s}</button></div>)}
        </div>

        <div className="container pt-8 lg:pt-[22px] pb-[94px] lg:pb-[58px] overflow-auto z-0">
            <div className="grid gap-y-2.5 lg:gap-y-3.5">
                {data?.filter(e => e.season_num === season && e.id !== info.id).map(episode => {
                    const series = streams.data?.find(series => series.id === episode.series_id)!
                    const category = categories?.find(category => category.id === series.category_id)!

                    return <Link key={episode.stream.slug} href={`/series/${category?.slug}/${series.slug}/${episode.stream.slug}`} shallow>
                        <a className="rounded-[18px] lg:rounded-lg bg-secondary-200/70 lg:bg-black/40 lg:text-white p-2.5 space-x-3.5 flex relative overflow-hidden h-[120px]">
                            <img src={assets(series.cover)} alt={episode.stream.stream_display_name} className="w-[82px] h-[92px] lg:absolute inset-0 lg:w-full lg:h-full lg:-z-10 flex-none object-cover rounded-[13px] lg:rounded-lg" />
                            <div className="flex-1 truncate lg:hidden">
                                <div className="text-lg truncate font-bold capitalize">Episode {episode.sort}</div>
                                <div className="my-1 w-[3px] h-[3px] rounded-full bg-red-400" />
                                <div>Titre : <span className='font-bold'>{episode.stream.stream_display_name}</span></div>
                                <div>Durée : <span className='font-bold'>{formatTime(episode.stream.movie_propeties.duration_secs || series.episode_run_time || 0)}</span></div>
                            </div>
                            <div className='hidden lg:flex text-lg items-center justify-center w-full h-full'>
                                <div><span className='font-bold text-white'>Saison {episode.season_num} - EP{episode.sort < 10 ? 0 : null}{episode.sort}</span></div>
                                <div className="w-[3px] h-[3px] rounded-full bg-red-600 absolute bottom-0 left-0" />
                            </div>
                        </a>
                    </Link>
                })}
            </div>
        </div>
    </>
}