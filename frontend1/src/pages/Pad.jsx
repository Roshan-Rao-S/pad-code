// import { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import socket from "../lib/socket";

// export default function Pad() {
//   const { padId } = useParams();

//   const editor = useEditor({
//     extensions: [StarterKit],
//     content: "",
//     onUpdate({ editor }) {
//       const html = editor.getHTML();
//       socket.emit("update-pad", { padId, html });
//     },
//   });

//   useEffect(() => {
//     document.title = `Pad: ${padId}`;

//     socket.emit("join-pad", padId);

//     socket.on("pad-content", (html) => {
//       if (editor && html !== editor.getHTML()) {
//         editor.commands.setContent(html);
//       }
//     });

//     socket.on("clear-pad", () => {
//       if (editor) editor.commands.clearContent();
//     });

//     return () => {
//       socket.off("pad-content");
//       socket.off("clear-pad");
//     };
//   }, [padId, editor]);

//   return (
//     <div className="h-screen w-screen bg-gray-200 dark:bg-gray-900 flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-xl shadow-md overflow-y-auto p-6">
//         <h1 className="text-2xl font-bold mb-4">Pad: {padId}</h1>
//         {editor ? (
//           <EditorContent editor={editor} className="prose max-w-none min-h-[600px]" />
//         ) : (
//           <p>Loading editor...</p>
//         )}
//       </div>
//     </div>
//   );
// }




// code-2

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import * as Menubar from "@radix-ui/react-menubar";
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons";
import {
  Home,
  TextCursorInput,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  ArrowLeft,
  FileText,
  Upload,
  Trash2,
  History,
  Search,
} from "lucide-react"; // Importing icons from lucide-react

// IMPORTANT: This import MUST correctly provide a real Socket.IO client instance.
// Ensure your ../lib/socket.js file is configured to connect to your backend.
import socket from "../lib/socket";

export default function Pad() {
  const { padId } = useParams();
  const navigate = useNavigate();

  // State to manage dark mode
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    return false;
  });

  // State for editor zoom level
  const [zoomLevel, setZoomLevel] = useState(1.0); // 1.0 = 100%

  // Effect to apply dark mode class to the document element
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }
  }, [darkMode]);

  // Tiptap editor instance
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      // Only emit if the update came from user interaction (editor is focused)
      // This prevents programmatic updates (from other clients) from being re-emitted.
      if (editor.isFocused) {
        socket.emit("update-pad", { padId, html });
      }
    },
  });

  // Callback for handling incoming pad content from the server
  const handlePadContent = useCallback((html) => {
    // Only update editor if content is different to prevent unnecessary re-renders
    // and to avoid overwriting user's active typing immediately with stale content.
    if (editor && html !== editor.getHTML()) {
      // Set content without emitting an update back to the server (false argument)
      // This is crucial to prevent an infinite loop:
      // Server sends -> Client updates -> Client emits (if not for `false`) -> Server sends...
      editor.commands.setContent(html, false);
    }
  }, [editor]); // Depend on editor instance

  // Callback for handling clear pad command
  const handleClearPad = useCallback(() => {
    if (editor) editor.commands.clearContent();
  }, [editor]); // Depend on editor instance

  // Effect for socket communication and document title
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `Pad: ${padId}`;
    }

    // Emit join-pad event when component mounts
    socket.emit("join-pad", padId);

    // Listen for pad content updates from the server
    socket.on("pad-content", handlePadContent);

    // Listen for clear pad command from the server
    socket.on("clear-pad", handleClearPad);

    // Cleanup socket listeners on component unmount
    return () => {
      socket.off("pad-content", handlePadContent);
      socket.off("clear-pad", handleClearPad);
      // Optional: Emit a 'leave-pad' event if your server handles it for clean disconnections
      // socket.emit("leave-pad", padId);
    };
  }, [padId, handlePadContent, handleClearPad]); // Re-run if padId or memoized callbacks change

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Zoom functions
  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2.0));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setZoomLevel(1.0);

  // Editor actions for Menubar/Sidebar
  const focusEditor = () => {
    editor?.commands.focus();
  };

  const clearEditorContent = () => {
    if (editor) {
      // In a real application, you might want a confirmation dialog here
      socket.emit("clear-pad", padId);
    }
  };

  const undoEditor = () => {
    editor?.commands.undo();
  };

  const redoEditor = () => {
    editor?.commands.redo();
  };

  // Radix UI Menubar Radio and Check items (for example purposes)
  const RADIO_ITEMS = ["Profile 1", "Profile 2", "Guest"];
  const CHECK_ITEMS = ["Show Toolbar", "Enable Auto-save"];

  const [checkedSelection, setCheckedSelection] = useState([CHECK_ITEMS[1]]);
  const [radioSelection, setRadioSelection] = useState(RADIO_ITEMS[0]);

  return (
    <div className={`min-h-screen w-screen flex transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-200 text-gray-900'}`}>

      {/* Left Sidebar */}
      <div className="flex flex-col items-center p-2 sm:p-4 bg-gray-100 dark:bg-gray-800 shadow-lg z-20 w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mb-4"
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>

        {/* Home button */}
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mb-4"
          aria-label="Go to home"
        >
          <Home className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>

        {/* Text/Focus Editor Button */}
        <button
          onClick={focusEditor}
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mb-4"
          aria-label="Focus editor for text input"
        >
          <TextCursorInput className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col items-center mb-4">
          <button
            onClick={zoomIn}
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mb-2"
            aria-label="Zoom In"
          >
            <ZoomIn className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={zoomOut}
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Zoom Out"
          >
            <ZoomOut className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        </div>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mb-4"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="h-6 w-6 sm:h-7 sm:w-7" />
          ) : (
            <Moon className="h-6 w-6 sm:h-7 sm:w-7" />
          )}
        </button>

        {/* Other Placeholder Buttons (from image) */}
        <button
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mb-4"
          aria-label="File operations"
        >
          <FileText className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>
        <button
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mb-4"
          aria-label="Upload"
        >
          <Upload className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>
        <button
          onClick={clearEditorContent}
          className="p-2 rounded-full text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200 mb-4"
          aria-label="Clear Pad"
        >
          <Trash2 className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>
        <button
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mb-4"
          aria-label="History"
        >
          <History className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>
        <button
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Search"
        >
          <Search className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>
      </div>

      {/* Main Content Area (Menubar + Editor) */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        {/* Radix UI Menubar */}
        <Menubar.Root className="flex bg-white dark:bg-gray-800 p-1.5 rounded-md shadow-sm mb-4 mx-auto max-w-4xl w-full">
          <Menubar.Menu>
            <Menubar.Trigger className="px-2.5 py-1.5 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">File</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content
                className="min-w-56 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg z-50"
                align="start"
                sideOffset={5}
                alignOffset={-3}
              >
                <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">
                  New Pad <div className="ml-auto pl-5 text-gray-500">⌘ T</div>
                </Menubar.Item>
                <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">
                  Open Pad <div className="ml-auto pl-5 text-gray-500">⌘ N</div>
                </Menubar.Item>
                <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white" disabled>
                  Save Pad
                </Menubar.Item>
                <Menubar.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1.5" />
                <Menubar.Sub>
                  <Menubar.SubTrigger className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">
                    Share
                    <div className="ml-auto pl-5 text-gray-500">
                      <ChevronRightIcon />
                    </div>
                  </Menubar.SubTrigger>
                  <Menubar.Portal>
                    <Menubar.SubContent
                      className="min-w-56 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg z-50"
                      alignOffset={-5}
                    >
                      <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">
                        Email Link
                      </Menubar.Item>
                      <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">Messages</Menubar.Item>
                      <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">Notes</Menubar.Item>
                    </Menubar.SubContent>
                  </Menubar.Portal>
                </Menubar.Sub>
                <Menubar.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1.5" />
                <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">
                  Print… <div className="ml-auto pl-5 text-gray-500">⌘ P</div>
                </Menubar.Item>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger className="px-2.5 py-1.5 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Edit</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content
                className="min-w-56 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg z-50"
                align="start"
                sideOffset={5}
                alignOffset={-3}
              >
                <Menubar.Item onClick={undoEditor} className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">
                  Undo <div className="ml-auto pl-5 text-gray-500">⌘ Z</div>
                </Menubar.Item>
                <Menubar.Item onClick={redoEditor} className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">
                  Redo <div className="ml-auto pl-5 text-gray-500">⇧ ⌘ Z</div>
                </Menubar.Item>
                <Menubar.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1.5" />
                <Menubar.Sub>
                  <Menubar.SubTrigger className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">
                    Find
                    <div className="ml-auto pl-5 text-gray-500">
                      <ChevronRightIcon />
                    </div>
                  </Menubar.SubTrigger>
                  <Menubar.Portal>
                    <Menubar.SubContent
                      className="min-w-56 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg z-50"
                      alignOffset={-5}
                    >
                      <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">
                        Search the web…
                      </Menubar.Item>
                      <Menubar.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1.5" />
                      <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">Find…</Menubar.Item>
                      <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">Find Next</Menubar.Item>
                      <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">
                        Find Previous
                      </Menubar.Item>
                    </Menubar.SubContent>
                  </Menubar.Portal>
                </Menubar.Sub>
                <Menubar.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1.5" />
                <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">Cut</Menubar.Item>
                <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">Copy</Menubar.Item>
                <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white">Paste</Menubar.Item>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger className="px-2.5 py-1.5 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">View</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content
                className="min-w-56 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg z-50"
                align="start"
                sideOffset={5}
                alignOffset={-14}
              >
                {CHECK_ITEMS.map((item) => (
                  <Menubar.CheckboxItem
                    className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white inset"
                    key={item}
                    checked={checkedSelection.includes(item)}
                    onCheckedChange={() =>
                      setCheckedSelection((current) =>
                        current.includes(item)
                          ? current.filter((el) => el !== item)
                          : current.concat(item),
                      )
                    }
                  >
                    <Menubar.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
                      <CheckIcon />
                    </Menubar.ItemIndicator>
                    {item}
                  </Menubar.CheckboxItem>
                ))}
                <Menubar.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1.5" />
                <Menubar.Item onClick={resetZoom} className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white inset">
                  Reset Zoom <div className="ml-auto pl-5 text-gray-500">100%</div>
                </Menubar.Item>
                <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white inset" disabled>
                  Force Reload <div className="ml-auto pl-5 text-gray-500">⇧ ⌘ R</div>
                </Menubar.Item>
                <Menubar.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1.5" />
                <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white inset">
                  Toggle Fullscreen
                </Menubar.Item>
                <Menubar.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1.5" />
                <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white inset">
                  Hide Sidebar
                </Menubar.Item>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger className="px-2.5 py-1.5 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Profiles</Menubar.Trigger>
            <Menubar.Portal>
              <Menubar.Content
                className="min-w-56 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg z-50"
                align="start"
                sideOffset={5}
                alignOffset={-14}
              >
                <Menubar.RadioGroup
                  value={radioSelection}
                  onValueChange={setRadioSelection}
                >
                  {RADIO_ITEMS.map((item) => (
                    <Menubar.RadioItem
                      className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white inset"
                      key={item}
                      value={item}
                    >
                      <Menubar.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
                        <DotFilledIcon />
                      </Menubar.ItemIndicator>
                      {item}
                    </Menubar.RadioItem>
                  ))}
                  <Menubar.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1.5" />
                  <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white inset">Edit…</Menubar.Item>
                  <Menubar.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1.5" />
                  <Menubar.Item className="text-sm leading-none rounded-md flex items-center h-7 px-2 relative select-none outline-none cursor-default text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white inset">
                    Add Profile…
                  </Menubar.Item>
                </Menubar.RadioGroup>
              </Menubar.Content>
            </Menubar.Portal>
          </Menubar.Menu>
        </Menubar.Root>

        {/* Editor Content Area */}
        <div className="flex-1 w-full max-w-4xl mx-auto rounded-xl shadow-lg flex flex-col transition-colors duration-300 overflow-hidden"
             style={{
               transform: `scale(${zoomLevel})`,
               transformOrigin: 'top center', // Zoom from the top center
               minHeight: '600px', // Ensure minimum height even when zoomed out
             }}>
          <h1 className="text-2xl font-bold mb-4 text-center p-4 bg-white dark:bg-gray-800 rounded-t-xl">Pad: {padId}</h1>
          {editor ? (
            <EditorContent
              editor={editor}
              className={`prose max-w-none flex-grow overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-b-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${darkMode ? 'prose-invert bg-gray-700' : 'bg-white'}`}
            />
          ) : (
            <p className="text-center text-lg p-4 bg-white dark:bg-gray-800 rounded-b-xl">Loading editor...</p>
          )}
        </div>
      </div>
    </div>
  );
}




