import { Dialog, Transition } from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { capitalize } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, Fragment } from 'react'

import { useCategoriesContext } from '../../../../../../../app/contexts/categories'
import { useAppSelector } from '../../../../../../../app/hooks'
import StreamType from '../../../../../../../app/types/stream'

import { selectPlayer } from '../../../../../../../features/player/playerSlice'
import Input from '../../../../../../ui/input'
import Logo from '../../../../../../ui/logo'

export default function LiveView() {
    const { push } = useRouter()
    const { live: { streams: { data } } } = useAppSelector(selectPlayer)
    const { liveCategories: categories } = useCategoriesContext()

    let [isOpen, setIsOpen] = useState<boolean>(false)
    const [search, setSearch] = useState('')

    const renderStream = (stream: StreamType) => <div key={`live-stream-${stream.id}`} onClick={() => {
        const category = categories?.find(category => category.id === stream.category_id)!

        setIsOpen(false)
        setSearch('')
        push(`/chaines/${category.slug}/${stream.slug}`, undefined, { shallow: true })
    }} className='cursor-pointer flex items-center space-x-2 bg-secondary-900 hover:bg-secondary-700 transition-all duration-200 text-sm'>
        <div className="aspect-square w-14 bg-secondary-700 relative p-2.5 flex items-center justify-center overflow-hidden z-0">
            <img src={`/api/assets?src=${stream.stream_icon}`} alt={stream.stream_display_name} className="w-full h-full object-contain" />
            <img src={`/api/assets?src=${stream.stream_icon}`} alt={stream.stream_display_name} className="w-full h-full object-cover absolute inset-0 -z-10 blur-3xl scale-150" />
        </div>

        <div className='truncate text-secondary-400' title={stream.stream_display_name}>{capitalize(stream.stream_display_name.toLocaleLowerCase())}</div>
    </div>

    const streamsContent = data !== null && data.filter(stream => stream.stream_display_name.toLowerCase().includes(search.toLowerCase())).map(renderStream)

    return <div>
        <div onClick={() => setIsOpen(true)}>
            <Bars3Icon className='w-10' />
        </div>

        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 flex flex-col">
                {/* The backdrop, rendered as a fixed sibling to the panel container */}
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                {/* Full-screen container to center the panel */}
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                    <div className="container py-4 flex-1 flex flex-col overflow-auto">
                        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-2xl bg-secondary-800 text-secondary-400 pt-3 pb-5 px-4 flex-1 flex flex-col overflow-auto">
                            <header className="space-y-4 pb-5">
                                <div className='flex items-center justify-between'>
                                    <Link href="/">
                                        <a className='outline-none inline-block'>
                                            <Logo reset />
                                        </a>
                                    </Link>

                                    <XMarkIcon className='cursor-pointer w-5' onClick={() => setIsOpen(false)} />
                                </div>

                                <div>
                                    <Input type='search' name='search' icon={MagnifyingGlassIcon} onChange={e => setSearch(e.target.value)} value={search} className="bg-secondary-900" placeholder="Rechercher une chaîne..." />
                                </div>
                            </header>

                            <div className='flex-1 overflow-auto'>
                                <div className="divide-y divide-secondary-500">
                                    {streamsContent}
                                </div>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    </div>
}