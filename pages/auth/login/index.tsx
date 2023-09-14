import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Status from "../../../app/types/status";
import Layout, { Head } from "../../../components/auth/navigation/layout";
import Button from "../../../components/auth/ui/button";
import Input from "../../../components/auth/ui/input";
import { login, selectAuth } from "../../../features/auth/authSlice";

const params = {
    link: '/auth/login',
    title: "Se connecter | Hiala TV",
    description: "Se connecter à Hiala TV"
}

const LoginPage = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
    })
    const [passwordVisible, setPasswordVisible] = useState(false)

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


    return <form onSubmit={onSubmit} className="mt-10 grid grid-cols-1 gap-y-10">
        <Head {...params} />

        <div className="grid grid-cols-1 gap-y-2.5">
            <Input label="Nom d'utilisateur ou adresse mail" id="login" name="login" onChange={onChange} value={formData.login} required />
            <Input label="Mot de passe" id="password" name="password" type={passwordVisible ? 'text' : 'password'} onChange={onChange} value={formData.password} required addon={<div className="cursor-pointer" onClick={() => setPasswordVisible(p => !p)}>
                {!passwordVisible ? <EyeIcon className="w-6" /> : <EyeSlashIcon className="w-6" />}
            </div>} />
        </div>

        <div>
            <Button status={status}>Connexion</Button>
        </div>
    </form>
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout title="Connectez-vous" text={<>
        Vous n'avez pas de compte? <Link href="/auth/register"><a className="font-medium text-primary-800 hover:underline">S'inscrire</a></Link>.
    </>}>{page}</Layout>
}

export default LoginPage