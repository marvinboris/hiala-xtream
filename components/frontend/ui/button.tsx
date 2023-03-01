import { ComponentProps } from 'react'

type ButtonProps = ComponentProps<'button'> & {
    icon?: (props: ComponentProps<'svg'>) => JSX.Element,
}

export default function Button({icon: Icon, ...props}: ButtonProps) {
    return <button className="h-[60px] md:w-[197px] w-[253px] inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-primary-800 to-teal rounded-full" {...props}>
        <span className='font-bold'>{props.children}</span>
        {Icon ? <span><Icon className="w-8" /></span> : null}
    </button>
}