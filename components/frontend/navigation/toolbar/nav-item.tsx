import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Button from '../../../ui/button'

interface NavItemProps {
    href: string
    exact?: boolean
    icon?: (props: React.ComponentProps<'svg'>) => JSX.Element
    children: React.ReactNode
}

export default function NavItem({ href, exact, icon, children }: NavItemProps) {
    const router = useRouter()
    const active = exact ? router.pathname === href : router.pathname.startsWith(href)

    return <Link href={href}>
        <a>
            <Button icon={icon} color={active ? 'primary' : 'link'}>
                <div className={active ? 'text-lg' : 'text-base'}>{children}</div>
            </Button>
        </a>
    </Link>
}