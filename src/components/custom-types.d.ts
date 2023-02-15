// TypeScript users only add this code
import type { BaseEditor } from 'slate'
// import { Descendant } from 'slate'
import type { ReactEditor } from 'slate-react'

type CustomText = { text: string }
type CustomElement = { type: 'paragraph'; children: CustomText[] }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
