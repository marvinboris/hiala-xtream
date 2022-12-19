import { Head } from "."

export default function LayoutLoader() {
    return <div className="bg-gradient-to-tr from-primary-600/50 to-transparent">
        <Head title="Hiala TV" description="Hiala TV - Chargement en cours" link="/" />

        <div className="min-h-screen text-center flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-primary-600 border-t-primary-100 border-[7px] animate-spin" />
        </div>
    </div>
}