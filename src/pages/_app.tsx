import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import { api } from '../utils/api'

import '../styles/globals.css'

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = {
  Component: NextPageWithLayout
}

type SessionProps = { session: Session | null }

const MyApp: React.FC<{ pageProps: SessionProps } & AppPropsWithLayout> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
