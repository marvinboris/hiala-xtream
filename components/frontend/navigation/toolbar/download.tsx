import { Popover, Transition } from "@headlessui/react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

type ButtonProps = {
    href: string
    name: string
    os: string
}

const Button = ({ href, name, os }: ButtonProps) => <a href={href} className="rounded bg-white shadow-sm py-4 px-8 flex flex-col items-center justify-center space-y-1">
    <div className="text-xl font-extrabold text-primary-800">{name}</div>
    <div className="text-sm">{os}</div>
</a>

export default function Download() {
    return <Popover>
        {({ close }) => (
            <>
                <Popover.Button className="outline-none">
                    <ArrowDownTrayIcon className='w-8' />
                </Popover.Button>
                <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
                    <Popover.Panel className="fixed w-screen h-screen flex items-center justify-center top-0 left-0 z-40">
                        <Popover.Overlay onClick={close} className="fixed inset-0 z-0 w-screen h-screen bg-black/20" />
                        <div className="grid grid-cols-2 gap-2 relative z-10">
                            {[
                                { name: 'Hiala C', os: 'Android', href: '/files/hiala-c.apk' },
                                { name: 'Hiala P', os: 'Android', href: '/files/hiala-p.apk' },
                                { name: 'Hiala C', os: 'iOS', href: '/files/hiala-c.app' },
                                { name: 'Hiala P', os: 'iOS', href: '/files/hiala-p.app' },
                            ].map(item => <Button key={JSON.stringify(item)} {...item} />)}
                        </div>
                    </Popover.Panel>
                </Transition>
            </>
        )}
    </Popover>
}