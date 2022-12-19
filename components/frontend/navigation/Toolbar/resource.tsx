import Link from 'next/link'

interface ResourceProps {
    name: string
    href: string
}

export default function Resource({ href, name }: ResourceProps) {
    return <Link href={href}>
        <span className='text-base font-medium text-secondary-900 hover:text-secondary-700 dark:text-secondary-50 dark:hover:text-secondary-200'>{name}</span>
    </Link>
}