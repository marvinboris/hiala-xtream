import { Head } from "."

export default function LayoutLoader() {
    return <div className="bg-gradient-to-tr from-primary-800/50 to-transparent">
        <Head title="Net TV" description="Net TV - Chargement en cours" link="/" />

        <div className="min-h-screen text-center flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-primary-800 border-t-primary-100 border-[7px] animate-spin" />
        </div>
    </div>
}