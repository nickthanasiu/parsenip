import { useState, useEffect, useRef } from "react";
import { editor as monaco, Range, IPosition } from "monaco-editor";
import { EditorProps } from "@monaco-editor/react";
  
export function useEditor() {
  const [editor, setEditor] = useState<monaco.IStandaloneCodeEditor>();
  const [cursorPosition, setCursorPosition] = useState(0);
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

  
  editor?.onDidChangeCursorPosition(() => {
    const textModel = editor.getModel() as monaco.ITextModel;
    const cursorPosition = textModel.getOffsetAt(editor.getPosition() as IPosition);
    setCursorPosition(cursorPosition);
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
  }

  const config: EditorProps = {
    height: '100%',
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


function useEditorInput() {
  const starterCode = 
    `/*\n * Write code here and see how\n * the lexer and parser interpret it \n */\n\nconst x = 1;\nconst y = 2;\n\nfunction add(a, b){\n  return a + b;\n}\n\nconst sum = add(x, y);`;
  
  const [input, setInput] = useState(starterCode);

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