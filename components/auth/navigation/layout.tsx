import { ReactNode } from 'react'
import NextHead from 'next/head'
import Link from 'next/link'

import Logo from '../../ui/logo'
import { useWindowSize } from '../../../app/hooks'
import { Squares2X2Icon } from '@heroicons/react/24/outline'

interface LayoutProps {
    title: string
    text?: ReactNode
    children: ReactNode
}

interface NavLinkProps {
    href: string
    children: ReactNode
}

const NavLink = ({ href, children }: NavLinkProps) => <Link href={href}>
    <a className='text-black block truncate px-4 lg:px-0 py-1 lg:py-0 bg-transparent lg:hover:bg-black/10 transition-all duration-200'>
        {children}
    </a>
</Link>

export default function Layout({ title, text, children }: LayoutProps) {
    const { width } = useWindowSize()

    return <div className="min-h-screen overflow-hidden">
        <div className="relative flex min-h-screen bg-secondary-800 lg:bg-white overflow-x-hidden">
            <div className="hidden lg:block w-1/2 inset-y-0 left-0 absolute z-0">
                <img alt="" src="/images/pinho-yjXAtMCPdGs-unsplash.jpg" decoding="async" data-nimg="future" className="absolute inset-0 image-cover z-0" loading="lazy" />

                <div className="absolute inset-0 bg-black/50 z-10" />
            </div>

            <div className="lg:hidden w-[480px] h-[480px] rounded-full bg-gradient-to-r from-white/10 to-transparent fixed top-1/2 -translate-y-1/2 right-0 translate-x-1/2 p-5">
                <div className="rounded-full w-full h-full bg-secondary-800" />
            </div>
            
            <div className="lg:hidden inset-x-0 top-[70%] h-[30%] left-0 fixed z-0">
                <img alt="" src="/images/pinho-yjXAtMCPdGs-unsplash.jpg" decoding="async" data-nimg="future" className="absolute inset-0 image-cover z-0" loading="lazy" />

                <div className="absolute inset-0 bg-black/50 z-10" />
            </div>

            <div className="container min-h-screen flex flex-col relative z-10">
                <header className='flex items-end lg:items-start pt-9 lg:pt-12'>
                    <div className='pt-3 lg:pt-0'>
                        <Link href="/">
                            <a aria-label="Accueil">
                                <Logo reset={width !== undefined && width < 768} />
                            </a>
                        </Link>
                    </div>

                    <div className="ml-auto w-auto lg:w-1/2 relative group">
                        <Squares2X2Icon className='w-8 text-white lg:hidden' />

                        <div className='lg:flex items-center justify-center lg:space-x-5 absolute lg:static top-full right-0 mt-1 bg-white shadow lg:shadow-none lg:bg-transparent py-2 rounded-lg scale-0 group-hover:scale-100 lg:scale-100 origin-top-right transition-all duration-200'>
                            <NavLink href="/bouquets">Nos formules</NavLink>
                            <NavLink href="/films-series">Films & Séries</NavLink>
                        </div>
                    </div>
                </header>

                <div className="flex-1 lg:flex items-center">
                    <div className="lg:w-1/2 py-12 lg:pt-0">
                        <div className="text-[40px] lg:text-[60px] text-white font-bold leading-none">
                            La télé mobile<br />
                            réinventée
                        </div>
                    </div>

                    <div className="lg:w-1/2">
                        <div className="mx-auto shadow-xl max-w-[383px] bg-white text-secondary-700 rounded-[40.93px] px-8 py-9">
                            <header className='mb-8'>
                                <h2 className="text-2xl font-semibold">{title}</h2>

                                {text && <p className="mt-2.5 text-sm">{text}</p>}
                            </header>

                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export interface PageParams {
    link: string
    title: string
    description: string
}

export const Head = ({ link, title, description }: PageParams) => <NextHead>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={link} />

    <meta property='og:title' content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={link} />

    <meta property='twitter:title' content={title} />
    <meta property="twitter:description" content={description} />
</NextHead>