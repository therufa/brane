import { useMemo } from 'react'
import type { Descendant } from 'slate'
import { createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'

type BraneEditorProps = {
  value: Descendant[]
  onChange?: (value: Descendant[]) => void
}
const BraneEditor: React.FC<BraneEditorProps> = ({ value, onChange }) => {
  const editor = useMemo(() => withReact(createEditor()), [])

  editor.children = value

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => {
        const isAstChange = editor.operations.some((op) => op.type !== 'set_node')
        if (isAstChange) {
          onChange?.(newValue)
        }
      }}
    >
      <Editable />
    </Slate>
  )
}

export default BraneEditor
