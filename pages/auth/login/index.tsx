import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Status from "../../../app/types/status";
import Layout, { Head } from "../../../components/auth/navigation/Layout";
import { login, selectAuth } from "../../../features/auth/authSlice";

const params = {
    link: '/auth/login',
    title: "Se connecter | TV+",
    description: "Se connecter à TV+"
}

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const router = useRouter()
    const dispatch = useAppDispatch()
    const { token, status } = useAppSelector(selectAuth)

    const onChange = (e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value })
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (status !== Status.LOADING) dispatch(login(formData))
    }

    useEffect(() => {
        if (token) router.push('/')
    }, [token])


    return <form onSubmit={onSubmit} className="mt-10 grid grid-cols-1 gap-y-8">
        <Head {...params} />
        <div className="">
            <label htmlFor="username" className="mb-3 block text-sm font-medium">Nom d'utilisateur</label>

            <input id="username" type="text" name="username" onChange={onChange} value={formData.username} required className="block w-full appearance-none rounded-md border border-secondary-200 bg-secondary-50 px-3 py-2 text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-primary-500 sm:text-sm" />
        </div>

        <div className="">
            <label htmlFor="password" className="mb-3 block text-sm font-medium">Mot de passe</label>

            <input id="password" type="password" name="password" onChange={onChange} value={formData.password} required className="block w-full appearance-none rounded-md border border-secondary-200 bg-secondary-50 px-3 py-2 text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-primary-500 sm:text-sm" />
        </div>

        <div>
            <button className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-primary-600 text-white hover:text-slate-100 hover:bg-primary-500 active:bg-primary-800 active:text-primary-100 focus-visible:outline-primary-600 w-full" type="submit">
                {status === Status.LOADING ? <span><div className="inline-block w-4 h-4 border border-t-transparent border-white rounded-full animate-spin" /></span> : <span>Connexion <span aria-hidden="true">→</span></span>}
            </button>
        </div>
    </form>
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout title="Veuillez vous connecter à votre compte" text={<>
        Vous n'avez pas de compte? <Link href="/auth/register"><a className="font-medium text-primary-600 hover:underline">S'inscrire</a></Link>.
    </>}>{page}</Layout>
}

export default LoginPage