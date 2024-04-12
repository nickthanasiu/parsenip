import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useEffect, useCallback } from "react";

interface Props {
    initialValue: string;
    editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | undefined>;
    setEditorInput(input: string): void;
    updateCursorPosition: any;
}

export default function TextEditor({ initialValue, editorRef, setEditorInput, updateCursorPosition }: Props) {

    const handleKeyUp = useCallback(({ key }: KeyboardEvent) => {
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
    }, []);

    useEffect(() => {
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keyup', handleKeyUp);
        }
    }, [handleKeyUp]);


    function handleEditorMount(editor: editor.IStandaloneCodeEditor) {
        editorRef.current = editor;
    }

    function handleChange() {
        setEditorInput(editorRef.current?.getValue() || '');
        updateCursorPosition();
    }

    const options = {
        height: '100vh',
        width: '100%',
        theme: 'vs-dark',
        language: 'javascript',
        value: initialValue,
        options: {
            wordBasedSuggestions: true,
            wordBasedSuggestionsOnlySameLanguage: true,
            'semanticHighlighting.enabled': true 
        },
        onMount: handleEditorMount,
        onChange: handleChange,
    };

    return (
        <div onClick={updateCursorPosition}>
            <Editor {...options} />
        </div>
    );
}

