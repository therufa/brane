import { useMemo, useState, useEffect } from 'react'
import type { Descendant } from 'slate'
import { createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'

type NoteChangeset = {
  title: string, blocks: Descendant[]
}
type BraneEditorProps = {
  value: NoteChangeset
  onChange?: (note: NoteChangeset) => void
}

const BraneEditor: React.FC<BraneEditorProps> = ({ value, onChange }) => {
  const editor = useMemo(() => withReact(createEditor()), [])

  const [title, setTitle] = useState(value.title)
  const [blocks, setBlocks] = useState(value.blocks)

  useEffect(() => {
    setTitle(value.title)
    setBlocks(value.blocks)
  }, [value])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    onChange?.({ title: e.target.value, blocks })
  }

  const handleBlocksChange = (newValue: Descendant[]) => {
    setBlocks(newValue)
    onChange?.({ title, blocks: newValue })
  }

  return (
    <>
      <div className='flex gap-4'>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={handleTitleChange}
          className="flex-1 border-b border-gray-300 outline-none"
          placeholder='Title'
        />
      </div>
      <Slate
        editor={editor}
        value={blocks}
        onChange={(newValue) => {
          const isAstChange = editor.operations.some((op) => op.type !== 'set_node')
          if (isAstChange) {
            handleBlocksChange(newValue)
          }
        }}
      >
        <Editable />
      </Slate>
    </>
  )
}

export default BraneEditor
