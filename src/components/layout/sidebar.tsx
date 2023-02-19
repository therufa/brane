import Link from 'next/link'
import { api } from '../../utils/api'
import type { FormEvent } from 'react'
import { createId } from '@paralleldrive/cuid2'
import { useRouter } from 'next/router'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const notes = api.note.getAll.useQuery()
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

    const id = createId()

    create.mutate({ id, title: '', content: JSON.stringify([{ type: 'text', children: [{ text: '' }] }]) })
    void router.push(`/${id}`)
  }

  return (
    <div className="flex flex-row min-h-screen">
      <div className="w-64 bg-slate-50 p-4 flex flex-col">
        <div className="flex-1">
          {notes.data?.map((note) => (
            <Link
              href={`/${note.id}`}
              key={note.id}
              className="text-[#263141] hover:text-[#8799AF] "
            >
              <span className='block'>{note.title || 'Untitled'}</span>
            </Link>
          ))}
        </div>
        <button
          className="text-[#263141] hover:text-[#8799AF] "
          onClick={createNote}
        >
          <span className='block'>/new note</span>
        </button>
      </div>
      <main className="flex flex-col flex-1 items-center">
        {children}
      </main>
    </div>
  )
}
