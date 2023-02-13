import { Dialog, Transition } from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Fragment, Dispatch, SetStateAction, ReactNode } from 'react'

import Input from '../../../../../../ui/input'
import Logo from '../../../../../../ui/logo'

type VideoViewProps = {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    search: string
    setSearch: Dispatch<SetStateAction<string>>
    placeholder: string
    children: ReactNode
}

export default function VideoView({ isOpen, setIsOpen, search, setSearch, placeholder, children }: VideoViewProps) {
    return <div>
        <div onClick={() => setIsOpen(true)}>
            <Bars3Icon className='w-10' />
        </div>

        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 flex flex-col">
                {/* The backdrop, rendered as a fixed sibling to the panel container */}
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                {/* Full-screen container to center the panel */}
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                    <div className="container py-4 flex-1 flex flex-col overflow-auto">
                        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-2xl bg-secondary-800 text-secondary-400 pt-3 pb-5 px-4 flex-1 flex flex-col overflow-auto">
                            <header className="space-y-4 pb-5">
                                <div className='flex items-center justify-between'>
                                    <Link href="/">
                                        <a className='outline-none inline-block'>
                                            <Logo reset />
                                        </a>
                                    </Link>

                                    <XMarkIcon className='cursor-pointer w-5' onClick={() => setIsOpen(false)} />
                                </div>

                                <div>
                                    <Input type='search' name='search' icon={MagnifyingGlassIcon} onChange={e => setSearch(e.target.value)} value={search} className="bg-secondary-900" placeholder={placeholder} />
                                </div>
                            </header>

                            <div className='flex-1 overflow-auto'>
                                {children}
                            </div>
                        </Dialog.Panel>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    </div>
}