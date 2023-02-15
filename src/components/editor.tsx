import { useMemo } from 'react'
import type { Descendant } from 'slate'
import { createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'

type BraneEditorProps = {
  value: string
  onChange?: (value: string) => void
}
const BraneEditor: React.FC<BraneEditorProps> = ({ value, onChange }) => {
  const innerValue = useMemo(() => JSON.parse(value) as Descendant[], [value])
  const editor = useMemo(() => withReact(createEditor()), [])

  return (
    <Slate
      editor={editor}
      value={innerValue}
      onChange={(newValue) => {
        const isAstChange = editor.operations.some((op) => op.type !== 'set_node')
        if (isAstChange) {
          onChange?.(JSON.stringify(newValue))
        }
      }}
    >
      <Editable />
    </Slate>
  )
}

export default BraneEditor
