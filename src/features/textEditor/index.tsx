import Editor from "@monaco-editor/react";
import { Position, editor } from "monaco-editor";
import { useState, useEffect } from "react";

interface Props {
    initialValue: string;
    editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | undefined>;
    setEditorInput(input: string): void;
    updateCursorPosition: any;
}

export default function TextEditor({ initialValue, editorRef, setEditorInput, updateCursorPosition }: Props) {

    useEffect(() => {
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keyup', handleKeyUp);
        }
    }, []);


    function handleEditorMount(editor: editor.IStandaloneCodeEditor) {
        editorRef.current = editor;
    }

    function handleChange() {
        setEditorInput(editorRef.current?.getValue() || '');
        updateCursorPosition();
    }


    function handleKeyUp({ key }: KeyboardEvent) {
        switch (key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                updateCursorPosition();
                return;
            default:
                return;
        }
    }

    const options = {
        height: '100vh',
        width: '100%',
        theme: 'vs-light',
        value: initialValue,
        onMount: handleEditorMount,
        onChange: handleChange,
    };

    return (
        <div onClick={updateCursorPosition}>
            <Editor {...options} />
        </div>
    );
}

export function useCursorPosition(editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | undefined>) {

    const [cursorPosition, setPosition] = useState(0);

    function updateCursorPosition() {
        const editor = editorRef.current;

        if (editor) {
            const cursorPosition = editor?.getModel()?.getOffsetAt(editor.getPosition() as Position);
            if (cursorPosition) {
                setPosition(cursorPosition);
            }
        }
    }

    return [cursorPosition, updateCursorPosition] as [number, typeof updateCursorPosition];
}