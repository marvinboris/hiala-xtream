import { InputHTMLAttributes, ReactNode } from 'react'

import { classNames } from '../../app/helpers/utils'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    inputSize?: 'sm' | 'lg'
    icon?: (props: React.ComponentProps<'svg'>) => JSX.Element
    label?: ReactNode
    addon?: ReactNode
    append?: ReactNode
}

export default function Input({ icon, label, addon, append, inputSize = 'lg', className, ...rest }: InputProps) {
    const Icon = icon

    return <div>
        {label && <label htmlFor={rest.id ? rest.id : rest.name}>{label}</label>}

        <div className={classNames(inputSize === 'sm' ? "h-12" : "h-[50px]", "rounded-full relative bg-secondary-800 flex items-center", className || '')}>
            <div>
                {Icon && <div className={classNames(inputSize === 'sm' ? "w-12" : "w-12 md:w-16", "flex relative z-10 justify-center")}>
                    {<Icon className={classNames(inputSize === 'sm' ? "w-4 text-primary-800" : 'w-5 text-white md:text-white/40')} />}
                    {inputSize === 'sm' && <div className='rounded-full w-1 h-1 bg-secondary-700/20 absolute right-1.5 top-1/2 -translate-y-1/2' />}
                </div>}
                {addon && <div className='relative z-20'>{addon}</div>}
            </div>

            <div className={classNames(inputSize === 'sm' ? 'pr-2.5' : 'pr-4', 'flex-1 relative z-0')}>
                <input {...rest} className={classNames(inputSize === 'sm' ? 'text-xs' : 'text-sm md:text-base', 'min-h-[48px] border-none bg-transparent outline-none text-inherit w-full placeholder:opacity-30')} />
            </div>

            {append && <div className='pr-4'>{append}</div>}
        </div>
    </div>
}