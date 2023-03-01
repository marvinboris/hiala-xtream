import { ReactElement, ReactNode, Fragment } from 'react'
import { Provider } from 'react-redux'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import store from '../app/store'
import ErrorBoundary from '../components/error-boundary'
import Wrapper from '../hoc/wrapper'

import '../styles/globals.css'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return <ErrorBoundary FallbackComponent={Fragment}>
    <Provider store={store}>
      <Wrapper>
        {getLayout(<Component {...pageProps} />)}
      </Wrapper>
    </Provider>
  </ErrorBoundary>
}