import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactElement, ReactNode, useEffect } from 'react'

import { NextPageWithLayout } from './_app'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import Status from '../app/types/status'

import Layout, { Head } from '../components/frontend/navigation/layout'
import PageError from '../components/frontend/ui/page/error'
import PageLoader from '../components/frontend/ui/page/loader'

import { logout, selectAuth } from '../features/auth/authSlice'

const params = {
    link: '/moncompte',
    title: "Mon compte | Hiala TV",
    description: "Hiala TV: TV, sports, séries, films en streaming en direct live | Hiala TV Cameroun."
}

interface SectionProps {
    title: string
    children: React.ReactNode
}

const Section = ({ title, children }: SectionProps) => <section className='mb-5'>
    <h2 className="mb-5 font-bold text-xl text-white">{title}</h2>

    <div>{children}</div>
</section>

interface ListProps {
    children: React.ReactNode
}

const List = ({ children }: ListProps) => <div className="rounded bg-secondary-800">
    {children}
</div>

interface ListItemProps {
    label: ReactNode
    value: ReactNode
}

const ListItem = ({ label, value }: ListItemProps) => <div className="flex items-center justify-between px-5 h-12 text-sm md:text-base">
    <div className="text-white">{label}</div>
    <div>{value}</div>
</div>

const MonComptePage: NextPageWithLayout = () => {
    const router = useRouter()

    const dispatch = useAppDispatch()
    const { data, status } = useAppSelector(selectAuth)

    const disconnect = () => {
        dispatch(logout())
    }

    useEffect(() => {
        if (!data) router.push('/')
    }, [data])


    return <>
        <Head {...params} />
        {status === Status.LOADING ? <PageLoader /> : status === Status.FAILED ? <PageError /> : data && <main>
            <div className="container">
                <div className="mx-auto max-w-lg">
                    <header className="container">
                        <h1 className="page-title text-center">Mon compte</h1>
                    </header>

                    <Section title='Mes informations personnelles'>
                        <List>
                            <ListItem label='Nom' value={data.admin_notes ? `${data.admin_notes.first_name} ${data.admin_notes.last_name}` : data.username} />
                            {data.admin_notes ? <ListItem label='E-mail' value={data.admin_notes.email} /> : null}
                            {data.admin_notes ? <ListItem label='Téléphone' value={data.admin_notes.phone} /> : null}
                        </List>
                    </Section>

                    <Section title='Mon abonnement'>
                        <List>
                            {data.bouquet && <ListItem label='Bouquet' value={
                                <div className="flex items-center space-x-2">
                                    <div>
                                        {data.bouquet.map(b => b.bouquet_name).join(', ')}
                                    </div>

                                    <div>
                                        <Link href='/bouquets'>
                                            <a className='cursor-pointer bg-primary-800 text-white rounded-full w-8 h-8 flex items-center justify-center'>
                                                <PlusIcon className='w-4' />
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                            } />}
                        </List>
                    </Section>

                    {data.admin_notes ? <Section title='Mon compte'>
                        <List>
                            <ListItem label="Nom d'utilisateur" value={data.username} />
                            <ListItem label="Mot de passe" value="Modifier" />
                        </List>
                    </Section> : null}

                    <div className="mt-5 mx-auto max-w-xs">
                        <button onClick={disconnect} className="btn btn-secondary btn-block">Déconnecter</button>
                    </div>
                </div>
            </div>
        </main>}
    </>
}

MonComptePage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>
}

export default MonComptePage