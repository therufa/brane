import { createId } from '@paralleldrive/cuid2'
import { type NextPage } from 'next'
import Head from 'next/head'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { api } from '../../utils/api'
import { Layout } from './_layout'
import { withAuth } from './_withAuth'

const NotePage: NextPage = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const utils = api.useContext()
  const create = api.note.create.useMutation({
    async onMutate (newNote) {
      await utils.note.getAll.cancel()
      const prevData = utils.note.getAll.getData()

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
      void utils.note.getAll.invalidate()
    }
  })
  const createNote = (evt: FormEvent<unknown>) => {
    evt.preventDefault()

    if (!title || !content) return

    create.mutate({ id: createId(), title, content })
    setTitle('')
    setContent('')
  }
  return (
    <>
      <Head>
        <title>Create New Note</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="p-4 max-w-5xl w-full">
          <form className="flex flex-col gap-4"
            onSubmit={(evt) => createNote(evt)}
          >
            <div className='flex gap-4'>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 border-b border-gray-300 outline-none"
                placeholder='Title'
              />
              <button type="submit">save</button>
            </div>
            <textarea
              name="description"
              id="description"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="outline-none border-b border-gray-300"
            />
          </form>
        </div>
      </Layout>
    </>
  )
}

export default withAuth(NotePage)
