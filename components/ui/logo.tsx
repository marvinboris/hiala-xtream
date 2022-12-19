import { TvIcon } from "@heroicons/react/24/outline"

export default function Logo({ className = '' }) {
    return <span className="text-white font-bold text-3xl flex items-center space-x-1"><span>HIALA</span><TvIcon className="w-8" /></span>
    return <img className={`h-4 w-auto ${className}`} src="/images/logo.png" alt="Logo" />
}