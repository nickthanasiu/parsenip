import { useState, useEffect, useRef } from "react";
import { editor as monaco, Range, IKeyboardEvent, IPosition } from "monaco-editor";
import { EditorProps } from "@monaco-editor/react";
  
export function useEditor() {
  const [editor, setEditor] = useState<monaco.IStandaloneCodeEditor>();
  const [cursorPosition, updateCursorPosition] = useCursorPosition(editor);
  const decorationsCollectionRef = useRef<monaco.IEditorDecorationsCollection>();
  const  { input, setInput, resetInput } = useEditorInput();
  
  useEffect(() => {
    decorationsCollectionRef.current = editor?.createDecorationsCollection([
      {
        range: new Range(0, 0, 0, 0),
        options: {
          inlineClassName: 'highlighted-code',
        }
      }
    ]);
  }, [editor]);

  
  // Listen for and handle key up events
  editor?.onKeyUp(({ code }: IKeyboardEvent) => {
    switch (code) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
          updateCursorPosition();
          return;
      default:
          return;
    }
  });
  
  function updateDecorations(start: number, end: number) {
    const textModel = editor?.getModel();

    if (textModel) {
      const { lineNumber: lineStart, column: colStart } = textModel.getPositionAt(start);
      const { lineNumber: lineEnd, column: colEnd } = textModel.getPositionAt(end);

      decorationsCollectionRef.current?.set([
        {
          range: new Range(lineStart, colStart, lineEnd, colEnd),
          options: {
            inlineClassName: 'highlighted-code',
          }
        }
      ]);
    }
  }
  
  function handleEditorMount(editor: monaco.IStandaloneCodeEditor) {
    setEditor(editor);
  };
  
  function handleChange() {
    setInput(editor?.getValue() || '');
    updateCursorPosition();
  }

  const config: EditorProps = {
    height: '100vh',
    width: '100%',
    theme: 'vs-light',
    language: 'javascript',
    value: input,
    options: {
      minimap: { enabled: false },
      wordBasedSuggestions: true,
      wordBasedSuggestionsOnlySameLanguage: true,
      'semanticHighlighting.enabled': true,
      overviewRulerLanes: 0,
      scrollbar: {
        //@TODO: For some reason, this setting breaks code highlighting..investigate why
        //vertical: 'hidden' 
      }
    },
    onMount: handleEditorMount,
    onChange: handleChange,
};

  return {
    handleEditorMount,
    handleChange,

    cursorPosition,
    
    input,
    resetInput,

    highlightCode: updateDecorations,
    config,
  };

}

  
const useCursorPosition = function(editor: monaco.IStandaloneCodeEditor | undefined) {

  const [cursorPosition, setPosition] = useState(0);

  function updateCursorPosition() {

      if (editor) {
          const cursorPosition = editor?.getModel()?.getOffsetAt(editor.getPosition() as IPosition);
          if (cursorPosition) {
              setPosition(cursorPosition);
          }
      }
  }

  return [cursorPosition, updateCursorPosition] as [number, typeof updateCursorPosition];
}


function useEditorInput() {
  const starterCode = 
    `/*\n * Write code here and see how\n * the lexer and parser interpret it \n */\n\nconst x = 1;\nconst y = y;\n\nfunction add(a, b){\n  return a + b;\n}\n\nconst sum = add(x, y);`;
  
  const [input, setInput] = useState(loadState);

  function loadState() {
    return localStorage.getItem('code') ?? starterCode;
  }

  function saveState(input: string) {
    localStorage.setItem('code', input);
    setInput(input);
  }

  function resetInput() {
    localStorage.removeItem('code');
    setInput(starterCode);
  }

  return {
    input,
    setInput: saveState,
    resetInput
  }
}