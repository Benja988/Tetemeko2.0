'use client';

import { Editor, ChainedCommands } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Table as TableIcon,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eraser,
  Link as LinkIcon,
  Highlighter,
  CheckSquare,
  Minus
} from 'lucide-react';
import { useState } from 'react';

type Props = {
  editor: Editor;
  handleImageUpload: () => void;
  handleAddLink: () => void;
  handleSetHighlight: () => void;
  uploading: boolean;
  onCollapse?: () => void;
};

const baseBtn =
  'p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';

const getActiveStyle = (active: boolean) =>
  active ? 'bg-blue-100 text-blue-700 font-semibold' : '';

export default function EditorToolbar({ 
  editor, 
  handleImageUpload, 
  handleAddLink, 
  handleSetHighlight, 
  uploading, 
  onCollapse 
}: Props) {
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  if (!editor) return null;

  interface ColorCommands {
    setColor: (color: string) => ChainedCommands;
    setHighlight: (color: string) => ChainedCommands;
  }

  type EditorWithColor = Editor & {
    chain: () => ChainedCommands & ColorCommands;
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setTextColor(color);

    const chain = (editor as EditorWithColor).chain();
    chain.focus().setColor(color).run();
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setBackgroundColor(color);

    const chain = (editor as EditorWithColor).chain();
    chain.focus().setHighlight({ color }).run();
  };

  return (
    <div className="flex flex-wrap gap-2 items-center p-3 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm rounded-t-lg">
      {onCollapse && (
        <button
          onClick={onCollapse}
          className="ml-auto p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          title="Collapse toolbar (Esc)"
          aria-label="Collapse toolbar"
        >
          ✕
        </button>
      )}

      {/* Text Formatting */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('bold'))}`}
          title="Bold (Ctrl+B)"
          aria-label="Bold"
        >
          <Bold size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('italic'))}`}
          title="Italic (Ctrl+I)"
          aria-label="Italic"
        >
          <Italic size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('underline'))}`}
          title="Underline (Ctrl+U)"
          aria-label="Underline"
        >
          <Underline size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('strike'))}`}
          title="Strikethrough (Ctrl+Shift+X)"
          aria-label="Strikethrough"
        >
          <Strikethrough size={18} />
        </button>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('heading', { level: 1 }))}`}
          title="Heading 1 (Ctrl+Alt+1)"
          aria-label="Heading 1"
        >
          <Heading1 size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('heading', { level: 2 }))}`}
          title="Heading 2 (Ctrl+Alt+2)"
          aria-label="Heading 2"
        >
          <Heading2 size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('heading', { level: 3 }))}`}
          title="Heading 3 (Ctrl+Alt+3)"
          aria-label="Heading 3"
        >
          <Heading3 size={18} />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive({ textAlign: 'left' }))}`}
          title="Align Left (Ctrl+Shift+L)"
          aria-label="Align Left"
        >
          <AlignLeft size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive({ textAlign: 'center' }))}`}
          title="Align Center (Ctrl+Shift+E)"
          aria-label="Align Center"
        >
          <AlignCenter size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive({ textAlign: 'right' }))}`}
          title="Align Right (Ctrl+Shift+R)"
          aria-label="Align Right"
        >
          <AlignRight size={18} />
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('bulletList'))}`}
          title="Bullet List (Ctrl+Shift+8)"
          aria-label="Bullet List"
        >
          <List size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('orderedList'))}`}
          title="Numbered List (Ctrl+Shift+7)"
          aria-label="Numbered List"
        >
          <ListOrdered size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('taskList'))}`}
          title="Task List"
          aria-label="Task List"
        >
          <CheckSquare size={18} />
        </button>
      </div>

      {/* Quote & Code */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('blockquote'))}`}
          title="Blockquote (Ctrl+Shift+B)"
          aria-label="Blockquote"
        >
          <Quote size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('codeBlock'))}`}
          title="Code Block (Ctrl+Shift+C)"
          aria-label="Code Block"
        >
          <Code size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={`${baseBtn}`}
          title="Horizontal Rule"
          aria-label="Horizontal Rule"
        >
          <Minus size={18} />
        </button>
      </div>

      {/* Table & Image */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          className={`${baseBtn}`}
          title="Insert Table"
          aria-label="Insert Table"
        >
          <TableIcon size={18} />
        </button>

        <button
          onClick={handleImageUpload}
          disabled={uploading}
          className={`${baseBtn} ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={uploading ? 'Uploading...' : 'Insert Image (Ctrl+Shift+I)'}
          aria-label="Insert Image"
        >
          <ImageIcon size={18} />
        </button>

        <button
          onClick={handleAddLink}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('link'))}`}
          title="Insert Link (Ctrl+K)"
          aria-label="Insert Link"
        >
          <LinkIcon size={18} />
        </button>
      </div>

      {/* Text Color */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <div className="flex flex-col items-center">
          <label className="text-xs text-gray-500">Text</label>
          <input
            type="color"
            value={textColor}
            onChange={handleColorChange}
            className="w-6 h-6 rounded-lg cursor-pointer"
            title="Text Color"
            aria-label="Text Color"
          />
        </div>
        
        <div className="flex flex-col items-center">
          <label className="text-xs text-gray-500">Highlight</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={handleBackgroundColorChange}
            className="w-6 h-6 rounded-lg cursor-pointer"
            title="Highlight Color"
            aria-label="Highlight Color"
          />
        </div>
        
        <button
          onClick={handleSetHighlight}
          className={`${baseBtn}`}
          title="Custom Highlight Color"
          aria-label="Custom Highlight Color"
        >
          <Highlighter size={18} />
        </button>
      </div>

      {/* Clear Formatting */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className={`${baseBtn}`}
          title="Clear Formatting (Ctrl+Shift+0)"
          aria-label="Clear Formatting"
        >
          <Eraser size={18} />
        </button>
      </div>

      {/* Undo / Redo */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`${baseBtn}`}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        >
          <Undo size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`${baseBtn}`}
          title="Redo (Ctrl+Y)"
          aria-label="Redo"
        >
          <Redo size={18} />
        </button>
      </div>
    </div>
  );
}