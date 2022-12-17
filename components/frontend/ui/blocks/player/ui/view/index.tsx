import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useState, Fragment, useEffect, ReactNode } from 'react'
import slugify from 'slugify'
import { useCategoriesContext } from '../../../../../../../app/contexts/categories'
import { useAppSelector } from '../../../../../../../app/hooks'

import type SeriesStreamType from '../../../../../../../app/types/series/stream'
import type StreamType from '../../../../../../../app/types/vod/stream'
import { selectAuth } from '../../../../../../../features/auth/authSlice'

import ViewSeries from './series'

interface ViewProps {
    stream: SeriesStreamType | StreamType
    action: ReactNode
}

export default function View({ stream, action }: ViewProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { seriesCategories, vodCategories } = useCategoriesContext()

    const name = "cover" in stream ? stream.title : stream.stream_display_name
    const categories = "cover" in stream ? seriesCategories : vodCategories
    const type = "cover" in stream ? 'serie' : 'stream'

    const { data: account } = useAppSelector(selectAuth)
    const condition = account === null || !account.bouquet || !account.bouquet.find(bouquet => (type === 'stream' && bouquet.bouquet_channels.find(item => item === stream.id)) || (type === 'serie' && bouquet.bouquet_series.find(item => item === stream.id)))

    const category = categories?.find(c => +c.id === +stream.category_id)!

    return <div>
        <div onClick={() => setIsOpen(true)}>
            {action}
        </div>

        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 flex md:items-center">
                {/* The backdrop, rendered as a fixed sibling to the panel container */}
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/30 backdrop-filter backdrop-blur-sm" />
                </Transition.Child>

                {/* Full-screen container to center the panel */}
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                    <div className="container md:py-6 max-h-screen overflow-auto">
                        <div className="-mx-4 md:mx-0">
                            <nav className="h-12 pr-1.5 flex items-center">
                                <XMarkIcon onClick={() => setIsOpen(false)} className='cursor-pointer w-9 md:w-11 ml-auto text-white hover:text-white/50 transition-all duration-200' />
                            </nav>
                            <Dialog.Panel className="mx-auto max-w-5xl w-full relative bg-secondary-900">
                                <div className="ratio-16by9 bg-secondary-800">
                                    <img src={`/api/assets?src=${"cover" in stream ? stream.cover : stream.movie_propeties.cover_big}`} alt={name} className="image-cover absolute inset-0 z-0" />

                                    <div className="absolute inset-0 flex items-center justify-center flex-col z-10 px-5 lg:px-10 text-center bg-secondary-900/50 text-secondary-100">
                                        {condition ? <>
                                            <div className="hidden md:block text-3xl font-bold mb-6">Envie de regarder {name}?</div>

                                            <div className="text-sm md:text-lg font-bold mb-8">Découvrez nos bouquets du moment.</div>

                                            <div>
                                                <Link href='/bouquets'>
                                                    <a className='btn btn-primary'>Découvrir nos bouquets</a>
                                                </Link>
                                            </div>
                                        </> : <div>
                                            {type === 'stream' ? <Link href={`/films/${slugify(category!.category_name, { lower: true })}/${slugify(name, { lower: true })}`}>
                                                <a className='btn btn-primary'>Regarder maintenant</a>
                                            </Link> : null}
                                        </div>}
                                    </div>
                                </div>

                                <div className="p-4 md:p-6 text-lg">
                                    <div className="text-3xl md:text-4xl font-medium text-white mb-3">
                                        <Link href={"cover" in stream ? (`/series/${category?.slug}/${stream.slug}`) : (`/films/${category?.slug}/${stream.slug}`)}>
                                            <a>{name}</a>
                                        </Link>
                                    </div>

                                    {stream !== null && ("seasons" in stream ? <ViewSeries series={stream} category={category} /> : <div>
                                        <div className="mb-5 capitalize">{stream.movie_propeties.genre}, {stream.movie_propeties.releasedate}</div>

                                        <div>{stream.movie_propeties.plot}</div>
                                    </div>)}
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    </div>
}