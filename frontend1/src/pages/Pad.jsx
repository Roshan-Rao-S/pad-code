import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import socket from "../lib/socket";

export default function Pad() {
  const { padId } = useParams();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      socket.emit("update-pad", { padId, html });
    },
  });

  useEffect(() => {
    document.title = `Pad: ${padId}`;

    socket.emit("join-pad", padId);

    socket.on("pad-content", (html) => {
      if (editor && html !== editor.getHTML()) {
        editor.commands.setContent(html);
      }
    });

    socket.on("clear-pad", () => {
      if (editor) editor.commands.clearContent();
    });

    return () => {
      socket.off("pad-content");
      socket.off("clear-pad");
    };
  }, [padId, editor]);

  return (
    <div className="h-screen w-screen bg-gray-200 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-xl shadow-md overflow-y-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Pad: {padId}</h1>
        {editor ? (
          <EditorContent editor={editor} className="prose max-w-none min-h-[600px]" />
        ) : (
          <p>Loading editor...</p>
        )}
      </div>
    </div>
  );
}




