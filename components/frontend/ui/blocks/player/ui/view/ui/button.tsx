import { ComponentProps } from 'react'

import { classNames } from "../../../../../../../../app/helpers/utils"

type ButtonProps = ComponentProps<'button'> & {
    icon: (props: ComponentProps<'svg'>) => JSX.Element
    direction?: boolean
}

const Button = ({ icon: Icon, direction, onClick }: ButtonProps) => <button onClick={onClick} className={classNames("w-11 h-11 rounded-full inline-flex items-center justify-center text-white transition-all duration-200", direction ? "lg:w-[26px] lg:h-[26px]" : "", onClick ? "bg-green" : "bg-green/50")}>
    <Icon className={classNames("w-5", direction ? "lg:w-3 lg:h-3" : "")} />
</button>

export default Button