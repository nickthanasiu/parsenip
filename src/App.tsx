import { useState, useRef} from 'react';
import { editor } from "monaco-editor";
import SplitScreen from './components/SplitScreen';
import TextEditor, { useCursorPosition } from './features/textEditor';
import ResultsPanels from './features/resultsPanels';
import './App.css';
import { Editor } from '@monaco-editor/react';

type Editor = editor.IStandaloneCodeEditor;



export default function App() {
  const [editorInput, setEditorInput] = useEditorInput();

  const editorRef = useRef<Editor>();
  const [cursorPosition, updateCursorPosition] = useCursorPosition(editorRef);
  
  return (
    <div className="app">
      <header style={{ paddingLeft: '20px', height: '35px', backgroundColor: 'lightgrey', display: 'flex', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Browser Interpreter</h3>
      </header>
      <SplitScreen>
        <TextEditor 
          initialValue={editorInput}
          setEditorInput={setEditorInput}
          editorRef={editorRef}
          updateCursorPosition={updateCursorPosition}
        />
        <ResultsPanels input={editorInput} cursorPosition={cursorPosition} />
      </SplitScreen>
    </div>
  );
}


function useEditorInput() {
  
  const [editorInput, setEditorInput] = useState(loadState);

  function loadState() {
    const starterCode = 
      `/*\n * Write code here and see how\n * the lexer and parser interpret it \n */\n\nconst x = 1;\nconst y = y;\n\nfunction add(a, b){\n  return a + b;\n}\n\nconst sum = add(x, y);`;

    return localStorage.getItem('code') ?? starterCode;
  }

  function saveState(input: string) {
    localStorage.setItem('code', input);
    setEditorInput(input);
  }

  return [editorInput, saveState] as [string, (input: string) => void];
}

