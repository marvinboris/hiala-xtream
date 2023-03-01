import { ReactNode } from 'react'
import { Switch as HSwitch } from '@headlessui/react'

interface SwitchProps {
    checked: boolean
    toggle: () => void
}

export default function Switch({ checked, toggle }: SwitchProps) {
    return <HSwitch checked={checked} onChange={toggle} className={`${checked ? 'bg-primary-800' : 'bg-secondary-800'} relative inline-flex h-[24px] w-[46px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}>
        <span className="sr-only">Résumé des épisodes</span>
        <span aria-hidden="true" className={`${checked ? 'translate-x-[22px]' : 'translate-x-0'} pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white ring-0 transition duration-200 ease-in-out`} />
    </HSwitch>
}
