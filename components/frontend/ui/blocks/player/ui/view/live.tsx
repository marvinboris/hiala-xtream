import { capitalize } from 'lodash'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { useCategoriesContext } from '../../../../../../../app/contexts/categories'
import { assets } from '../../../../../../../app/helpers/utils'
import { useAppSelector } from '../../../../../../../app/hooks'
import StreamType from '../../../../../../../app/types/stream'

import { selectPlayer } from '../../../../../../../features/player/playerSlice'

import VideoView from './video'

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
            <img src={assets(stream.stream_icon)} alt={stream.stream_display_name} className="w-full h-full object-contain" />
            <img src={assets(stream.stream_icon)} alt={stream.stream_display_name} className="w-full h-full object-cover absolute inset-0 -z-10 blur-3xl scale-150" />
        </div>

        <div className='truncate text-secondary-400' title={stream.stream_display_name}>{capitalize(stream.stream_display_name.toLocaleLowerCase())}</div>
    </div>

    const streamsContent = data !== null && data.filter(stream => stream.stream_display_name.toLowerCase().includes(search.toLowerCase())).map(renderStream)

    return <VideoView isOpen={isOpen} setIsOpen={setIsOpen} search={search} setSearch={setSearch} placeholder="Rechercher une chaîne...">
        <div className="divide-y divide-secondary-500">
            {streamsContent}
        </div>
    </VideoView>
}