import { ComponentProps, ReactNode } from "react";

export default interface NavItemType {
    icon: (props: ComponentProps<'svg'>) => JSX.Element
    href: string
    exact?: boolean
    children: ReactNode
}