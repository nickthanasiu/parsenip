import { useState } from "react";
import { Position, editor } from "monaco-editor";

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