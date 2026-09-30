"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Underline } from "lucide-react";
import { normalizeProductRichText, sanitizeProductRichText } from "@/lib/products/rich-text";

interface ProductVisualEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  id: string;
  minHeight?: number;
}

export default function ProductVisualEditor({
  value,
  onChange,
  label,
  id,
  minHeight = 96,
}: ProductVisualEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: normalizeProductRichText(value),
    immediatelyRender: false,
    editorProps: {
      attributes: { id, "aria-label": label },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.isEmpty ? "" : sanitizeProductRichText(editor.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor) return;
    const incoming = normalizeProductRichText(value);
    if (editor.getHTML() !== incoming) editor.commands.setContent(incoming, { emitUpdate: false });
  }, [editor, value]);

  return (
    <div className="admin-rich-text overflow-hidden rounded-xl border border-[#0A1D4A]/20 bg-white focus-within:border-[#0A1D4A] focus-within:ring-2 focus-within:ring-[#0A1D4A]/10">
      <div className="flex gap-1 border-b border-[#0A1D4A]/10 bg-[#FAF7F2] p-1.5" role="toolbar" aria-label={`Formato de ${label}`}>
        {[
          { name: "Negrita", icon: Bold, mark: "bold", command: () => editor?.chain().focus().toggleBold().run() },
          { name: "Cursiva", icon: Italic, mark: "italic", command: () => editor?.chain().focus().toggleItalic().run() },
          { name: "Subrayado", icon: Underline, mark: "underline", command: () => editor?.chain().focus().toggleUnderline().run() },
        ].map(({ name, icon: Icon, mark, command }) => (
          <button
            key={mark}
            type="button"
            title={name === "Negrita" ? "Negrita (Ctrl+B)" : name}
            aria-label={name}
            aria-pressed={editor?.isActive(mark) ?? false}
            disabled={!editor}
            onClick={command}
            className={`rounded-md p-2 text-[#051341] transition-colors hover:bg-[#E7EDF5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#051341] ${editor?.isActive(mark) ? "bg-[#DCE7F3]" : ""}`}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <div style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
