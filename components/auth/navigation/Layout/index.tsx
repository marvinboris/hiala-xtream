import { ReactNode } from 'react'
import NextHead from 'next/head'
import Link from 'next/link'

import Logo from '../../../ui/Logo'

interface LayoutProps {
    title: string
    text?: ReactNode
    children: ReactNode
}

export default function Layout({ title, text, children }: LayoutProps) {
    return <div className="min-h-screen overflow-hidden">
        <div className="relative flex min-h-screen justify-center md:px-12 lg:px-0">
            <div className="relative z-20 flex flex-1 flex-col bg-white dark:bg-secondary-900 py-10 px-4 shadow-2xl sm:justify-center md:flex-none md:px-28">
                <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
                    <div className="flex flex-col">
                        <Link href="/">
                            <a aria-label="Accueil">
                                <Logo />
                            </a>
                        </Link>

                        <div className="mt-20">
                            <h2 className="text-lg font-semibold text-white">{title}</h2>

                            {text && <p className="mt-2 text-sm">{text}</p>}
                        </div>
                    </div>

                    {children}
                </div>
            </div>
            <div className="hidden sm:contents lg:relative lg:block lg:flex-1">
                <img alt="" src="/images/pinho-yjXAtMCPdGs-unsplash.jpg" decoding="async" data-nimg="future" className="absolute inset-0 image-cover z-0" loading="lazy" />

                <div className="absolute inset-0 bg-primary-600/50 z-10 backdrop-blur" />
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