import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { classNames } from '../../../../app/helpers/utils'

interface NavItemProps {
    href: string
    exact?: boolean
    icon?: (props: React.ComponentProps<'svg'>) => JSX.Element
    children: React.ReactNode
}

export default function NavItem({ href, exact, icon: Icon, children }: NavItemProps) {
    const router = useRouter()
    const active = exact ? router.pathname === href : router.pathname.startsWith(href)

    return <Link href={href}>
        <a className={classNames('inline-flex items-center relative space-x-2 duration-200 transition-all', active ? "pr-4 z-10" : "")}>
            {Icon ? <Icon className="w-[22px] relative z-10 text-primary-800" /> : null}
            <span className={active ? "font-bold relative z-10" : ""}>{children}</span>
            <div className={classNames('absolute z-0 bg-white/10 rounded-xl w-1/2 h-10 right-0 origin-right duration-200 transition-all', active ? "opacity-100 scale-100" : "opacity-0 scale-0")} />
            <div className={classNames('absolute z-10 bg-green w-2 h-2 rounded-full right-0 origin-right duration-200 transition-all', active ? "opacity-100 scale-100" : "opacity-0 scale-0")} />
        </a>
    </Link>
}