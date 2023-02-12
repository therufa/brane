import { type NextPage } from 'next'
import Head from 'next/head'
// import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

import { api } from '../utils/api'
import type { FormEvent } from 'react'
import React, { useState } from 'react'

const Home: NextPage = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const utils = api.useContext()
  const create = api.note.create.useMutation({
    async onMutate (newNote) {
      await utils.note.getAll.cancel()
      const prevData = utils.note.getAll.getData()
      console.log({ prevData })

      utils.note.getAll.setData(
        undefined,
        (old) => old ? ([...old, newNote] as typeof old) : []
      )

      return { prevData }
    },
    onError (_err, _newNote, ctx) {
      utils.note.getAll.setData(undefined, ctx?.prevData)
    },
    onSettled () {
      void utils.note.getAll.refetch()
    }
  })
  const notes = api.note.getAll.useQuery()

  const createNote = (evt: FormEvent<unknown>) => {
    evt.preventDefault()

    if (!title || !content) return

    create.mutate({ title, content })
    setTitle('')
    setContent('')
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <AuthShowcase />

        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-2xl font-bold">Create a new post</p>
          <form className="flex flex-col gap-4"
            onSubmit={(evt) => createNote(evt)}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>

          <div className="flex flex-col gap-4">
            <p className="text-2xl font-bold">Your posts</p>
            {notes.data?.map((note) => (
              <div key={note.id}>
                <p>{note.title}</p>
                <p>{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

export default Home

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession()

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
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
