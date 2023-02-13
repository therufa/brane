import Link from 'next/link'
import { api } from '../../utils/api'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const notes = api.note.getAll.useQuery()

  return (
    <div className="flex flex-row min-h-screen">
      <div className="w-64 bg-slate-50 p-4">
        <Link
          href={'/note'}
          className="text-[#263141] hover:text-[#8799AF] "
        >
          <span className='block'>/note</span>
        </Link>
        {notes.data?.map((note) => (
          <Link
            href={`/note/${note.id}`}
            key={note.id}
            className="text-[#263141] hover:text-[#8799AF] "
          >
            <span className='block'>{note.title}</span>
          </Link>
        ))}
      </div>
      <main className="flex flex-col flex-1 items-center">
        {children}
      </main>
    </div>
  )
}
