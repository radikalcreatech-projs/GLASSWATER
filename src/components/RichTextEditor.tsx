import { useRef, useEffect, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
}

/**
 * Simple WYSIWYG editor using contentEditable + execCommand.
 * No external dependencies. Provides Bold, Italic, H3 heading,
 * bullet list, numbered list, and a clear formatting button.
 */
export function RichTextEditor({ value, onChange, placeholder, rows = 8, label }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Sync external value changes into the editor (one-way)
  useEffect(() => {
    const el = editorRef.current;
    if (!el || isFocused) return; // don't overwrite while user is typing
    if (el.innerHTML !== value) {
      el.innerHTML = value;
    }
  }, [value]);

  // Handle input changes
  const handleInput = () => {
    const el = editorRef.current;
    if (el) {
      onChange(el.innerHTML);
    }
  };

  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Enter the URL:');
    if (url) exec('createLink', url);
  };

  return (
    <div className="rich-editor-wrapper">
      {label && (
        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">{label}</label>
      )}
      
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-light-gray rounded-t border border-light-gray border-b-0">
        <button type="button" onClick={() => exec('bold')} title="Bold" className="px-2 py-1 text-xs font-bold rounded hover:bg-white transition-colors">B</button>
        <button type="button" onClick={() => exec('italic')} title="Italic" className="px-2 py-1 text-xs italic rounded hover:bg-white transition-colors">I</button>
        <span className="w-px bg-gray-300 mx-1" />
        <button type="button" onClick={() => exec('formatBlock', '<h3>')} title="Heading" className="px-2 py-1 text-xs font-bold rounded hover:bg-white transition-colors">H3</button>
        <button type="button" onClick={() => exec('formatBlock', '<p>')} title="Paragraph" className="px-2 py-1 text-xs rounded hover:bg-white transition-colors">P</button>
        <span className="w-px bg-gray-300 mx-1" />
        <button type="button" onClick={() => exec('insertUnorderedList')} title="Bullet List" className="px-2 py-1 text-xs rounded hover:bg-white transition-colors">• List</button>
        <button type="button" onClick={() => exec('insertOrderedList')} title="Numbered List" className="px-2 py-1 text-xs rounded hover:bg-white transition-colors">1. List</button>
        <span className="w-px bg-gray-300 mx-1" />
        <button type="button" onClick={insertLink} title="Insert Link" className="px-2 py-1 text-xs underline rounded hover:bg-white transition-colors">Link</button>
        <button type="button" onClick={() => exec('removeFormat')} title="Clear Formatting" className="px-2 py-1 text-xs rounded hover:bg-white transition-colors ml-auto">Clear</button>
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder || 'Start typing...'}
        className="w-full p-3 border border-light-gray rounded-b font-sans text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-white text-text-primary transition-all overflow-y-auto min-h-[120px]"
        style={{ minHeight: `${Math.max(120, rows * 24)}px` }}
      />
    </div>
  );
}