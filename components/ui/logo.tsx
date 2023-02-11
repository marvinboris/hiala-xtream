import { TvIcon } from "@heroicons/react/24/outline"
import { classNames } from "../../app/helpers/utils"

export default function Logo({ className = '', reset = false }) {
    return <span className={classNames("font-bold text-3xl flex items-center space-x-1", reset ? "" : "text-white")}><span>HIALA</span><TvIcon className="w-8" /></span>
    return <img className={`h-4 w-auto ${className}`} src="/images/logo.png" alt="Logo" />
}