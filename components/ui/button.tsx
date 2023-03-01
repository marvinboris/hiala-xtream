import React from 'react'

import { classNames } from '../../app/helpers/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: (props: React.ComponentProps<'svg'>) => JSX.Element
    block?: boolean
    disabled?: boolean
    color: 'white' | 'primary' | 'link'
}

export default function Button({ icon: Icon, block, disabled, color = 'primary', ...rest }: ButtonProps) {
    return <button {...rest} className={classNames(
        "h-[50px] items-center pr-7 rounded-full transition-all duration-200",
        Icon ? "pl-5" : "pl-7",
        block ? "flex" : "inline-flex", "text-lg",
        color === 'white' ? disabled ? "bg-secondary-200" : "text-primary-800 bg-white hover:bg-secondary-200" : "text-white",
        color === "primary" ? disabled ? "bg-primary-800" : "bg-primary-800 hover:bg-primary-800" : "",
        rest.className || ''
    )}>
        {Icon && <div className={classNames('relative mr-2', color === 'link' ? "" : "pr-2")}>
            <Icon className={classNames('w-[18px]', color === 'primary' ? 'text-white/80' : 'text-primary-800')} />
            {color !== 'link' && <div className='w-1.5 h-1.5 rounded-full bg-black/30 absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2' />}
        </div>}
        <div>{rest.children}</div>
    </button>
}