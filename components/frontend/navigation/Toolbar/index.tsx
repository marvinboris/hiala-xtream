/* This example requires Tailwind CSS v2.0+ */
import { Popover } from '@headlessui/react'
import { BellIcon, FilmIcon, HeartIcon, HomeIcon, MagnifyingGlassIcon, TvIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

import { useThemeContext } from '../../../../app/contexts/theme'
import { useAppSelector } from '../../../../app/hooks'
import NavItemType from '../../../../app/types/nav-item'
import Theme from '../../../../app/types/theme'

import { selectAuth } from '../../../../features/auth/authSlice'

import Logo from '../../../ui/Logo'
import Input from '../../../ui/input'

import Account from './Account'
import NavItem from './NavItem'

const navItems: NavItemType[] = [
    { icon: HomeIcon, href: '/', exact: true, children: "Accueil" },
    { icon: TvIcon, href: '/chaines', children: "Chaînes" },
    { icon: FilmIcon, href: '/films', children: "Films" },
]

const navItemsContent = navItems.map(item => <NavItem key={`nav-item-${item.href}`} {...item} />)

export default function Toolbar() {
    const { setTheme } = useThemeContext()
    const { data: account } = useAppSelector(selectAuth)

    const toggleDark = () => {
        const dark = localStorage.getItem('dark');
        if (dark) {
            setTheme(Theme.LIGHT)
            localStorage.removeItem('dark');
        } else {
            setTheme(Theme.DARK)
            localStorage.setItem('dark', 'enabled');
        }
    }

    return (
        <Popover className="sticky w-full top-0 z-30 bg-white dark:bg-secondary-900 backdrop-blur backdrop-filter">
            {({ close }) => <>
                <div className="container">
                    <div className="py-2 lg:py-11">
                        <div className='flex items-center justify-between'>
                            <div className="flex items-center">
                                <Link href="/">
                                    <a className='block'>
                                        <span className="sr-only">Hiala TV</span>
                                        <Logo />
                                    </a>
                                </Link>

                                <div className='hidden md:block ml-8'>
                                    <Input icon={MagnifyingGlassIcon} placeholder='Rechercher des films, séries et chaînes de télévision...' />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Popover.Group as="nav" className="hidden space-x-4 xl:flex">
                                    {navItemsContent}
                                </Popover.Group>
                            </div>

                            <div className='flex items-center space-x-4 lg:space-x-[54px]'>
                                {(((account !== null) && !account.bouquet) || (account === null)) && <div>
                                    <Link href="/bouquets">
                                        <a className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-primary-600 text-white hover:text-secondary-100 hover:bg-primary-500 active:bg-primary-900 active:text-primary-100 focus-visible:outline-primary-600">
                                            S'abonner
                                        </a>
                                    </Link>
                                </div>}

                                <div className='flex items-center space-x-3'>
                                    <div className="cursor-pointer relative z-0 group after:block after:absolute after:w-[12.72px] after:h-[12.72px] after:rounded-full after:bg-primary-600 after:top-0 after:right-0">
                                        <HeartIcon className="w-[31px]" />

                                        <div className="absolute scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 pt-1 top-full right-0 origin-top-right transition-all duration-200">
                                            <div className="bg-white shadow-sm rounded-[14px] p-3 text-xs truncate">
                                                <div className="space-y-2.5">
                                                    <div className="flex cursor-pointer items-center space-x-1.5">
                                                        <span><HeartIcon className="w-3 text-primary-600" /></span><span>Ceci devrait vous plaire...</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cursor-pointer relative z-0 group after:block after:absolute after:w-[12.72px] after:h-[12.72px] after:rounded-full after:bg-primary-600 after:top-0 after:right-0">
                                        <BellIcon className="w-[31px]" />

                                        <div className="absolute scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 pt-1 top-full right-0 origin-top-right transition-all duration-200">
                                            <div className="bg-white shadow-sm rounded-[14px] p-3 text-xs truncate">
                                                <div className="space-y-2.5">
                                                    <div className="flex cursor-pointer items-center space-x-1.5">
                                                        <span><BellIcon className="w-3 text-primary-600" /></span><span>Nouvel abonnement</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex items-center'>
                                    <button type="button" id="headlessui-listbox-button-10" className='hidden h-10 p-2 -m-2' aria-haspopup="true" aria-expanded="false" data-headlessui-state="" aria-labelledby="headlessui-listbox-label-9 headlessui-listbox-button-10" onClick={toggleDark}>
                                        <span className="dark:hidden">
                                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                                <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" className="stroke-secondary-600 dark:stroke-secondary-400" />
                                                <path d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836" className="stroke-secondary-600 dark:stroke-secondary-400" />
                                            </svg>
                                        </span>

                                        <span className="hidden dark:inline">
                                            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z" className="fill-transparent" />
                                                <path d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z" className="fill-secondary-400 dark:fill-secondary-500" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z" className="fill-secondary-400 dark:fill-secondary-500" />
                                            </svg>
                                        </span>
                                    </button>

                                    <Account navItems={navItems} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>}
        </Popover>
    )
}
