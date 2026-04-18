'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading2, 
  Link as LinkIcon, 
  Quote 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SimpleEditorProps {
  content: string
  onChange: (content: string) => void
}

const MenuButton = ({ onClick, isActive, children }: any) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={onClick}
    className={cn(
      "h-10 w-10 p-0 rounded-lg",
      isActive && "bg-primary/10 text-primary hover:bg-primary/20"
    )}
  >
    {children}
  </Button>
)

export function SimpleEditor({ content, onChange }: SimpleEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  return (
    <div className="border rounded-xl bg-white dark:bg-zinc-900 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-zinc-50 dark:bg-zinc-800/50">
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          isActive={editor.isActive('bold')}
        >
          <Bold className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          isActive={editor.isActive('italic')}
        >
          <Italic className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          isActive={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 className="h-4 w-4" />
        </MenuButton>
        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-1" />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          isActive={editor.isActive('bulletList')}
        >
          <List className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          isActive={editor.isActive('orderedList')}
        >
          <ListOrdered className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          isActive={editor.isActive('blockquote')}
        >
          <Quote className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => {
            const url = window.prompt('URL')
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }} 
          isActive={editor.isActive('link')}
        >
          <LinkIcon className="h-4 w-4" />
        </MenuButton>
      </div>
      
      <EditorContent 
        editor={editor} 
        className="p-6 min-h-[300px] prose prose-zinc dark:prose-invert max-w-none focus:outline-none"
      />
    </div>
  )
}
