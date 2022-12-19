import axios from "axios";
import Link from "next/link";
import { ChangeEvent, FormEvent, ReactElement, useState } from "react";

import MessageType from "../../../app/types/message";
import Status from "../../../app/types/status";

import Layout, { Head } from "../../../components/auth/navigation/layout";
import Alert from "../../../components/ui/alert";

const params = {
    link: '/auth/register',
    title: "S'inscrire | Hiala TV",
    description: "S'inscrire à Hiala TV"
}

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        password: '',
    })

    const [status, setStatus] = useState(Status.IDLE)
    const [message, setMessage] = useState<MessageType | null>(null)

    const onChange = (e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value })
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (status !== Status.LOADING) {
            setStatus(Status.LOADING)
            setMessage(null)
            const res = await axios.post<{ message: string } | { error: string }>('/api/auth/register', formData)
            if ('message' in res.data) {
                setStatus(Status.IDLE)
                setMessage({ type: 'success', content: res.data.message })
            } else {
                setStatus(Status.FAILED)
                setMessage({ type: 'danger', content: res.data.error })
            }
        }
    }

    return <form onSubmit={onSubmit} className="mt-10 grid grid-cols-1 gap-y-8">
        <Head {...params} />
        {message && <Alert color={message.type}>{message.content}</Alert>}
        <div className="">
            <label htmlFor="first_name" className="mb-3 block text-sm font-medium">Prénom(s)</label>

            <input id="first_name" type="text" name="first_name" onChange={onChange} value={formData.first_name} autoComplete="given-name" required className="block w-full appearance-none rounded-md border border-secondary-200 bg-secondary-50 px-3 py-2 text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-primary-500 sm:text-sm" />
        </div>

        <div className="">
            <label htmlFor="last_name" className="mb-3 block text-sm font-medium">Nom(s)</label>

            <input id="last_name" type="text" name="last_name" onChange={onChange} value={formData.last_name} autoComplete="family-name" required className="block w-full appearance-none rounded-md border border-secondary-200 bg-secondary-50 px-3 py-2 text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-primary-500 sm:text-sm" />
        </div>

        <div className="col-span-full">
            <label htmlFor="phone" className="mb-3 block text-sm font-medium">Numéro de téléphone</label>

            <input id="phone" type="tel" name="phone" onChange={onChange} value={formData.phone} autoComplete="phone" required className="block w-full appearance-none rounded-md border border-secondary-200 bg-secondary-50 px-3 py-2 text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-primary-500 sm:text-sm" />
        </div>

        <div className="col-span-full">
            <label htmlFor="email" className="mb-3 block text-sm font-medium">Adresse mail</label>

            <input id="email" type="email" name="email" onChange={onChange} value={formData.email} autoComplete="email" required className="block w-full appearance-none rounded-md border border-secondary-200 bg-secondary-50 px-3 py-2 text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-primary-500 sm:text-sm" />
        </div>

        <div className="col-span-full">
            <label htmlFor="password" className="mb-3 block text-sm font-medium">Mot de passe</label>

            <input id="password" type="password" name="password" onChange={onChange} value={formData.password} autoComplete="new-password" required className="block w-full appearance-none rounded-md border border-secondary-200 bg-secondary-50 px-3 py-2 text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-primary-500 sm:text-sm" />
        </div>

        <div className="col-span-full">
            <button className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-primary-600 text-white hover:text-slate-100 hover:bg-primary-500 active:bg-primary-800 active:text-primary-100 focus-visible:outline-primary-600 w-full" type="submit">
                {status === Status.LOADING ? <span><div className="inline-block w-4 h-4 border border-t-transparent border-white rounded-full animate-spin" /></span> : <span>Inscription <span aria-hidden="true">→</span></span>}
            </button>
        </div>
    </form>
}

RegisterPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout title="Commencer maintenant" text={<>
        Vous avez déjà un compte? <Link href="/auth/login"><a className="font-medium text-primary-600 hover:underline">Connectez-vous</a></Link> à votre compte.
    </>}>{page}</Layout>
}

export default RegisterPage