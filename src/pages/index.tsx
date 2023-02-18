import { createId } from '@paralleldrive/cuid2'
import Head from 'next/head'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { api } from '../utils/api'
import { Layout } from '../components/layout/sidebar'
import BraneEditor from '../components/editor'
import type { NextPageWithLayout } from './_app'
import type { Descendant } from 'slate'

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }]
  }
]

const NotePage: NextPageWithLayout = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState(initialValue)
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
  const createNote = (e: FormEvent<unknown>) => {
    e.preventDefault()

    if (!title || !content) return

    create.mutate({ id: createId(), title, content: JSON.stringify(content) })
    setTitle('')
    setContent(initialValue)
  }

  return (
    <>
      <Head>
        <title>Create New Note</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="p-4 max-w-5xl w-full">
        <form className="flex flex-col gap-4"
          onSubmit={(e) => createNote(e)}
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
          <BraneEditor value={content} onChange={setContent} />
        </form>
      </div>
    </>
  )
}

NotePage.getLayout = function getLayout (page) {
  return (<Layout>{page}</Layout>)
}

export default NotePage
