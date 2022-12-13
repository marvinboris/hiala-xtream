import Head from 'next/head'
import { ReactNode, useEffect, useState } from 'react'

import ThemeContext from '../app/contexts/theme'
import { setAuthToken } from '../app/helpers/utils'

import { useAppDispatch, useAppSelector } from '../app/hooks'

import Theme from '../app/types/theme'

import { check, selectAuth } from '../features/auth/authSlice'

import tailwindConfig from '../tailwind.config'

interface WrapperProps {
    children: ReactNode
}

export default function Wrapper({ children }: WrapperProps) {
    const [theme, setTheme] = useState<Theme | null>(Theme.DARK)

    const dispatch = useAppDispatch()
    const { token, data } = useAppSelector(selectAuth)

    useEffect(() => {
        const isAuth = localStorage.getItem('token') !== null
        if (!token && isAuth) dispatch(check())
        else if (token) setAuthToken(token)
    }, [token])

    useEffect(() => {
        const root = document.querySelector('html')!
        if (theme === Theme.DARK) root.classList.add('dark')
        else root.classList.remove('dark')
    }, [theme])

    return <ThemeContext.Provider value={{ theme, setTheme }}>
        <Head>
            <meta name="theme-color" content={theme === Theme.DARK ? tailwindConfig.theme.extend.colors.secondary[900] : "#ffffff"} />
        </Head>

        {theme != null && children}
    </ThemeContext.Provider>
}