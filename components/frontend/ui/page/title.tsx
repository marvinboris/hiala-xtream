import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { Dispatch, SetStateAction, useState } from 'react'

import Input from '../../../ui/input'

interface PageTitleProps {
    title: React.ReactNode
    subtitle: React.ReactNode
    icon: (props: React.ComponentProps<'svg'>) => JSX.Element
    search: string
    setSearch: Dispatch<SetStateAction<string>>
}

export default function PageTitle({ title, subtitle, icon: Icon, search, setSearch }: PageTitleProps) {
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
                        <Input type='search' name='search' icon={MagnifyingGlassIcon} onChange={e => setSearch(e.target.value)} value={search} className="bg-secondary-900" placeholder='Rechercher une chaîne...' />
                    </div>

                    <div className='w-[54px] h-[54px] cursor-pointer shadow-md rounded-full flex items-center justify-center bg-primary-600 text-white hover:bg-primary-800 transition-all duration-200'>
                        <FunnelIcon className='w-6' />
                    </div>
                </div>
            </div>
        </div>
    </header>
}