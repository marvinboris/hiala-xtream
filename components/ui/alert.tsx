import { classNames } from "../../app/helpers/utils"

type AlertProps = React.ComponentProps<'div'> & {
    color?: 'info' | 'danger' | 'success' | 'warning'
}

export default function Alert({ color = 'info', ...rest }: AlertProps) {
    return <div {...rest} className={classNames(
        color === 'info' ? "border border-cyan-200 bg-cyan-100 text-cyan-600" :
            color === 'danger' ? "border border-rose-200 bg-rose-100 text-rose-600" :
                color === 'success' ? "border border-lime-200 bg-lime-100 text-lime-600" :
                    color === 'warning' ? "border border-yellow-200 bg-yellow-100 text-yellow-600" : "",
        'py-2 px-4 font-medium rounded text-sm', rest.className || '')}>{rest.children}</div>
}