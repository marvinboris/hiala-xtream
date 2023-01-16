import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { capitalize } from 'lodash'
import React, { Dispatch, SetStateAction, useState } from 'react'

import { classNames } from '../../../../app/helpers/utils'
import StreamCategoryType from '../../../../app/types/stream_category'

import Input from '../../../ui/input'

interface PageTitleProps {
    title: React.ReactNode
    subtitle: React.ReactNode
    icon: (props: React.ComponentProps<'svg'>) => JSX.Element
    search: string
    setSearch: Dispatch<SetStateAction<string>>
    placeholder: string
    categories?: StreamCategoryType[]
    category_id?: number
    selectCategory?: (category_id: number) => void
}

export default function PageTitle({ title, subtitle, icon: Icon, search, setSearch, placeholder, categories, category_id, selectCategory }: PageTitleProps) {
    return <header className="container">
        <div className="bg-secondary-800 py-4 lg:py-6 pl-6 lg:pl-9 pr-8 lg:pr-12 flex items-center rounded-[30px]">
            <div className="text-white opacity-30 relative pr-3 lg:pr-[22px] mr-3 lg:mr-[22px]">
                <Icon className="w-8 lg:w-[52px]" />
                <div className='bg-white w-1.5 lg:w-2.5 h-1.5 lg:h-2.5 rounded-full absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2' />
            </div>

            <div>
                <h1 className="text-white font-bold text-xl lg:text-[30px]">{title}</h1>
                <p className="hidden lg:block text-xl text-lime-500">{subtitle}</p>
            </div>

            <div className="ml-auto">
                <div className='flex items-center space-x-3 lg:space-x-9'>
                    <div className='hidden lg:block'>
                        <Input type='search' name='search' icon={MagnifyingGlassIcon} onChange={e => setSearch(e.target.value)} value={search} className="bg-secondary-900" placeholder={placeholder} />
                    </div>

                    {categories && selectCategory ? <div className="relative group z-20">
                        <div className='w-[54px] h-[54px] cursor-pointer shadow-md rounded-full flex items-center justify-center bg-primary-600 text-white group-hover:bg-primary-800 transition-all duration-200'>
                            <FunnelIcon className='w-6' />
                        </div>

                        <div className="absolute right-0 top-full pt-4 origin-top-right opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
                            <div className="rounded-xl shadow-xl bg-secondary-700 py-4">
                                {[...categories].sort((a, b) => a.category_name.localeCompare(b.category_name)).concat({ ...categories[0], id: 0, category_name: 'ALL' }).map(category => <button key={'button-category-' + category.id} onClick={() => selectCategory(category.id)} className={classNames("text-left truncate block w-full px-4 py-1", category.id === category_id ? "bg-white/10" : "bg-transparent hover:bg-white/10 transition-all duration-200")}>{capitalize(category.category_name.toLocaleLowerCase())}</button>)}
                            </div>
                        </div>
                    </div> : null}
                </div>
            </div>
        </div>
    </header>
}