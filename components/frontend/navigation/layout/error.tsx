import { useRouter } from "next/router"

import { Head } from "."

import Logo from "../../../ui/logo"

export default function LayoutError() {
    const router = useRouter()

    return <div className="bg-gradient-to-tr from-primary-600/50 to-transparent">
        <Head title="500 - Erreur système" description="Hiala TV - Page d'erreur" link="/500" />

        <div className="min-h-screen mx-auto max-w-xl text-center flex flex-col items-center justify-center">
            <div className="mb-5">
                <Logo />
            </div>

            <div className="text-9xl font-extrabold text-white mb-10">Oups!</div>

            <div className="text-lg">Erreur lors du chargement des données. Veuillez vérifier votre connexion Internet et <span className="text-primary-600 hover:text-primary-800 transition-all duration-200 cursor-pointer font-semibold" onClick={router.reload}>réessayer</span>.</div>
        </div>
    </div>
}