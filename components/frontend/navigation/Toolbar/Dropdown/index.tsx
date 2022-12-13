import { Fragment, ReactNode } from 'react'
import Link from 'next/link'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ')

interface Action {
    name: string
    href: string
    icon?: (props: React.ComponentProps<'svg'>) => JSX.Element
    photo?: string
}

interface Item extends Action {
    description?: string
}

interface ListItem {
    id: string | number
    href: string
    name: string
}

interface List {
    title: string
    items: ListItem[]
    view?: {
        href: string
        name: string
    }
}

interface DropdownProps {
    title: ReactNode
    items: Item[]
    actions?: Action[]
    list?: List
}

const renderItem = (item: Item, close: () => void) => <Link key={item.name} href={item.href}>
    <a onClick={close} className="-m-3 flex items-start rounded-lg p-3 hover:bg-secondary-50 dark:hover:bg-secondary-800">
        {item.icon && <item.icon className="h-6 w-6 flex-shrink-0 text-primary-600" aria-hidden="true" />}
        {item.photo && <div className='h-6 w-6 flex-shrink-0'><img src={item.photo} alt={item.name} className="image-cover rounded" /></div>}
        <div className="ml-4">
            <p className="text-base font-medium text-secondary-900 dark:text-white">{item.name}</p>
            {item.description && <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-600">{item.description}</p>}
        </div>
    </a>
</Link>

const renderAction = (item: Action) => <div key={item.name} className="flow-root">
    <Link href={item.href}>
        <a className="-m-3 flex items-center rounded-md p-3 text-base font-medium text-secondary-900 hover:bg-secondary-100 dark:text-secondary-50 dark:hover:bg-secondary-700">
            {item.icon && <item.icon className="h-6 w-6 flex-shrink-0 text-secondary-400 dark:text-secondary-600" aria-hidden="true" />}
            <span className="ml-3">{item.name}</span>
        </a>
    </Link>
</div>

const renderListItem = (item: ListItem) => (
    <li key={item.id} className="truncate text-base">
        <Link href={item.href}>
            <a className="font-medium text-secondary-900 hover:text-secondary-700">
                {item.name}
            </a>
        </Link>
    </li>
)


export default function Dropdown({ title, items, actions, list }: DropdownProps) {
    return <Popover>
        {({ open, close }) => <>
            <Popover.Button className={classNames(open ? 'text-primary-600 dark:text-primary-600' : 'text-secondary-700 dark:text-secondary-200', 'group inline-flex items-center font-semibold text-sm leading-6 hover:text-primary-600 dark:hover:text-primary-600 focus:outline-none transition-all duration-200')}>
                <span>{title}</span>
                <ChevronDownIcon className={classNames(open ? 'rotate-180' : '', 'ml-2 h-5 w-5 transition-all duration-200')} aria-hidden="true" />
            </Popover.Button>

            <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
                <Popover.Panel className="absolute top-full z-10 w-full left-0">
                    <div className="overflow-hidden shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="px-5 py-6 bg-white dark:bg-secondary-900">
                            <div className='container grid grid-cols-1 gap-6 md:gap-8 md:p-8 lg:grid-cols-2 xl:grid-cols-3'>
                                {items.map(item => renderItem(item, close))}
                            </div>
                        </div>
                        {actions && <div className="px-5 py-5 bg-secondary-50 dark:bg-secondary-800">
                            <div className="container space-y-6 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8">
                                {actions.map(renderAction)}
                            </div>
                        </div>}
                        {list && <div className="bg-secondary-50 dark:bg-secondary-800 px-5 py-5 sm:px-8 sm:py-8">
                            <div className="container">
                                <div>
                                    <h3 className="text-base font-medium text-secondary-500">{list.title}</h3>
                                    <ul role="list" className="mt-4 space-y-4">
                                        {list.items.map(renderListItem)}
                                    </ul>
                                </div>
                                {list.view && <div className="mt-5 text-sm">
                                    <a href={list.view.href} className="font-medium text-primary-600 hover:text-primary-500">
                                        {list.view.name}
                                        <span aria-hidden="true"> &rarr;</span>
                                    </a>
                                </div>}
                            </div>
                        </div>}
                    </div>
                </Popover.Panel>
            </Transition>
        </>}
    </Popover>
}