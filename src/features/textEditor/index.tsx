import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useRef, Dispatch, SetStateAction } from "react";

type Editor = editor.IStandaloneCodeEditor;

interface Props {
    initialValue: string;
    setEditorInput: Dispatch<SetStateAction<string>>;
}

export default function TextEditor({ initialValue, setEditorInput }: Props) {
    const editorRef = useRef<Editor>();

    function handleEditorMount(editor: Editor) {
        editorRef.current = editor;
    }

    function handleChange() {
        setEditorInput(editorRef.current?.getValue() || '');
    }

    const options = {
        height: '100vh',
        width: '100%',
        theme: 'vs-dark',
        value: initialValue,
        onMount: handleEditorMount,
        onChange: handleChange
    };

    return (
        <Editor {...options} />
    );
}