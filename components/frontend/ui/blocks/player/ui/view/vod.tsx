import { useRouter } from 'next/router'
import { useState } from 'react'

import { useCategoriesContext } from '../../../../../../../app/contexts/categories'
import { useAppSelector } from '../../../../../../../app/hooks'

import { selectPlayer } from '../../../../../../../features/player/playerSlice'

import VideoView from './video'

export default function VodView() {
    const { push } = useRouter()
    const { vod: { streams: { data } } } = useAppSelector(selectPlayer)
    const { vodCategories: categories } = useCategoriesContext()

    let [isOpen, setIsOpen] = useState<boolean>(false)
    const [search, setSearch] = useState('')

    return <VideoView isOpen={isOpen} setIsOpen={setIsOpen} search={search} setSearch={setSearch} placeholder="Rechercher un film...">
        <div className="divide-y divide-secondary-500">
        </div>
    </VideoView>
}