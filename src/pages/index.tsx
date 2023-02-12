import { type NextPage } from 'next'
import Head from 'next/head'
// import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

import { api } from '../utils/api'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <AuthShowcase />
      </main>
    </>
  )
}

export default Home

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession()

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  )

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage.name}</span>}
      </p>
      <button
        className="rounded-full bg-black/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        // eslint-disable-next-line no-void
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? 'Sign out' : 'Sign in'}
      </button>
    </div>
  )
}
