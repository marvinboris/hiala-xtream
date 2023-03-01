/* This example requires Tailwind CSS v2.0+ */
import { Popover } from '@headlessui/react'
import { BellIcon, VideoCameraIcon, FilmIcon, HeartIcon, HomeIcon, MagnifyingGlassIcon, TvIcon, ArrowDownTrayIcon, Squares2X2Icon, UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { ReactNode } from 'react'

import { useThemeContext } from '../../../../app/contexts/theme'
import { useAppSelector } from '../../../../app/hooks'
import NavItemType from '../../../../app/types/nav-item'
import Theme from '../../../../app/types/theme'

import { selectAuth } from '../../../../features/auth/authSlice'

import Logo from '../../../ui/logo'
import Input from '../../../ui/input'

import Account from './account'
import NavItem from './nav-item'
import Download from './download'
import { classNames } from '../../../../app/helpers/utils'

interface NavLinkProps {
    href: string
    children: ReactNode
}

const NavLink = ({ href, children }: NavLinkProps) => <Link href={href}>
    <a className='text-black block truncate px-4 lg:px-0 py-1 lg:py-0 bg-transparent lg:hover:bg-black/10 transition-all duration-200'>
        {children}
    </a>
</Link>

const navItems: NavItemType[] = [
    { icon: TvIcon, href: '/chaines', children: "Chaînes TV" },
    { href: '/bouquets', children: "Nos formules" },
    { href: '/films', children: "Films" },
    { href: '/series', children: "Séries" },
]

const navItemsContent = navItems.map(item => <NavItem key={`nav-item-${item.href}`} {...item} />)

export default function Toolbar({ white = false }) {
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
        <Popover className={classNames("sticky w-full top-0 z-30 border-b border-secondary-500/50", white ? "bg-white text-secondary-600" : "bg-secondary-700 text-white")}>
            {({ close }) => <>
                <div className="container">
                    <div className="pt-9 pb-9 lg:pt-12">
                        <div className='flex items-center justify-between'>
                            <div className="flex items-center">
                                <div className='pt-3 lg:pt-0'>
                                    <Link href="/">
                                        <a className='block '>
                                            <span className="sr-only">{process.env.APP_NAME}</span>
                                            <Logo reset />
                                        </a>
                                    </Link>
                                </div>

                                {/* <div className='hidden md:block ml-8'>
                                    <Input icon={MagnifyingGlassIcon} placeholder='Rechercher des films, séries et chaînes de télévision...' />
                                </div> */}
                            </div>

                            <div className="ml-auto flex items-center space-x-14">
                                <Popover.Group as="nav" className="hidden space-x-[22px] xl:flex">
                                    {navItemsContent}
                                </Popover.Group>

                                {account === null ? <Link href="/auth/login">
                                    <a className='hidden md:inline-flex space-x-2 items-center'>
                                        <UserIcon className='w-8 text-green' />
                                        <span className='font-bold'>Se connecter</span>
                                    </a>
                                </Link> : null}
                            </div>

                            <div className='flex items-center space-x-4 lg:space-x-[54px]'>
                                {/* {(((account !== null) && !account.bouquet) || (account === null)) && <div>
                                    <Link href="/bouquets">
                                        <a className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-primary-800 text-white hover:text-secondary-100 hover:bg-primary-500 active:bg-primary-900 active:text-primary-100 focus-visible:outline-primary-800">
                                            S'abonner
                                        </a>
                                    </Link>
                                </div>} */}

                                {/* {account ? <>
                                    <div className='flex items-center space-x-3'>
                                        <div className="cursor-pointer relative z-0 group after:block after:absolute after:w-[12.72px] after:h-[12.72px] after:rounded-full after:bg-primary-800 after:top-0 after:right-0">
                                            <HeartIcon className="w-[31px]" />

                                            <div className="absolute scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 pt-1 top-full right-0 origin-top-right transition-all duration-200">
                                                <div className="bg-white shadow-sm rounded-[14px] p-3 text-xs truncate">
                                                    <div className="space-y-2.5">
                                                        <div className="flex cursor-pointer items-center space-x-1.5">
                                                            <span><HeartIcon className="w-3 text-primary-800" /></span><span>Ceci devrait vous plaire...</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="cursor-pointer relative z-0 group after:block after:absolute after:w-[12.72px] after:h-[12.72px] after:rounded-full after:bg-primary-800 after:top-0 after:right-0">
                                            <BellIcon className="w-[31px]" />

                                            <div className="absolute scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 pt-1 top-full right-0 origin-top-right transition-all duration-200">
                                                <div className="bg-white shadow-sm rounded-[14px] p-3 text-xs truncate">
                                                    <div className="space-y-2.5">
                                                        <div className="flex cursor-pointer items-center space-x-1.5">
                                                            <span><BellIcon className="w-3 text-primary-800" /></span><span>Nouvel abonnement</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </> : null} */}

                                {/* <Download /> */}

                                <div className='flex items-center space-x-2 ml-2 md:ml-0'>
                                    {account !== null ? <Account navItems={[]} /> : null}

                                    <div className="relative group lg:hidden">
                                        <Squares2X2Icon className={classNames('w-8 lg:hidden', white ? "text-teal" : "")} />

                                        <div className='lg:flex items-center justify-center lg:space-x-5 absolute lg:static top-full right-0 mt-1 bg-white lg:bg-transparent py-2 rounded-lg scale-0 group-hover:scale-100 origin-top-right transition-all duration-200'>
                                            <NavLink href="/chaines">Programmes TV</NavLink>
                                            <NavLink href="/bouquets">Nos formules</NavLink>
                                            <NavLink href="/films">Films & Séries</NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>}
        </Popover>
    )
}
