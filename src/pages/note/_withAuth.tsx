import type { NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'

export const withAuth = <T = NextPage>(Component: T) => {
  return ((props) => {
    const { status } = useSession({ required: true })

    if (status !== 'authenticated') {
      return (
        <>
          <p>Not signed in</p>
          <button onClick={() => void signIn()}>Sign in</button>
        </>
      )
    }

    return <Component {...props} />
  }) as React.FC
}
