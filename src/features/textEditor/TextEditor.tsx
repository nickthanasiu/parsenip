import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useRef } from "react";

type Editor = editor.IStandaloneCodeEditor;

export default function TextEditor() {
    const editorRef = useRef<Editor>();

    function handleEditorMount(editor: Editor) {
        editorRef.current = editor;
    }

    function getEditorValue() {
        return editorRef.current?.getValue();
    }

    function handleChange() {
        console.log(getEditorValue());
    }

    const options = {
        height: '100vh',
        width: '100%',
        theme: "vs-dark",
        onMount: handleEditorMount,
        onChange: handleChange
    };

    return (
        <Editor {...options} />
    );
}