import { ArrowRightIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { ReactNode } from "react"
import { classNames } from "../../../app/helpers/utils"

type ViewAllProps = {
    href: string
    children?: ReactNode
    green?: boolean
}

export default function ViewAll({ href, green, children }: ViewAllProps) {
    return <Link href={href}>
        <a className="inline-flex h-[54px] relative items-center justify-center">
            <div className="w-4 h-1 rounded-full bg-green" />
            <div className="ml-2.5 font-bold">{children}</div>
            <div className="w-1.5 h-1.5 bg-green ml-2.5 rounded-full" />
            <ArrowRightIcon className="text-green w-7" />
            <div className={classNames("absolute w-[89px] inset-y-0 opacity-10 rounded-[18px] right-6", green ? "bg-green" : "bg-white")} />
        </a>
    </Link>
} 