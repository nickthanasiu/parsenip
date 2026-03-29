import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { editor as monaco, Range, IPosition } from "monaco-editor";
import { EditorProps } from "@monaco-editor/react";
  
export function useEditor() {
  const [editor, setEditor] = useState<monaco.IStandaloneCodeEditor>();
  const [cursorPosition, setCursorPosition] = useState(0);
  const decorationsCollectionRef = useRef<monaco.IEditorDecorationsCollection>();
  const { input, setInput, resetInput } = useEditorInput();
  const { settingsJson, saveSettings, resetSettings, parsedSettings } = useEditorSettings();
  
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

  
  const updateDecorations = useCallback((start: number, end: number) => {
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
  }, [editor]);
  
  function handleEditorMount(editor: monaco.IStandaloneCodeEditor) {
    setEditor(editor);
  };
  
  function handleChange() {
    setInput(editor?.getValue() || '');
  }

  const config: EditorProps = {
    height: '100vh',
    width: '100%',
    theme: 'vs-dark',
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
      },
      ...(parsedSettings ?? {}),
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

    settingsJson,
    saveSettings,
    resetSettings,

    highlightCode: updateDecorations,
    config,
  };

}


function useEditorSettings() {
  const [settingsJson, setSettingsJson] = useState(
    () => localStorage.getItem('editorSettings') ?? '{}'
  );

  const parsedSettings = useMemo(() => {
    try { return JSON.parse(settingsJson); }
    catch { return null; }
  }, [settingsJson]);

  function saveSettings(json: string) {
    localStorage.setItem('editorSettings', json);
    setSettingsJson(json);
  }

  function resetSettings() {
    localStorage.removeItem('editorSettings');
    setSettingsJson('{}');
  }

  return { settingsJson, saveSettings, resetSettings, parsedSettings };
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