import { useState, useRef} from 'react';
import { editor } from "monaco-editor";
import SplitScreen from './components/SplitScreen';
import TextEditor, { useCursorPosition } from './features/textEditor';
import ResultsPanels from './features/resultsPanels';
import './App.css';
import { Editor } from '@monaco-editor/react';

type Editor = editor.IStandaloneCodeEditor;

export default function App() {
  const { editorInput, setEditorInput, resetEditorInput } = useEditorInput();

  const editorRef = useRef<Editor>();
  const [cursorPosition, updateCursorPosition] = useCursorPosition(editorRef);
  
  return (
    <div className="app">
      <header style={{ paddingLeft: '20px', height: '35px', backgroundColor: 'lightgrey', display: 'flex', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Browser Interpreter</h3>
        <button onClick={resetEditorInput} style={{ marginLeft: '50px' }}>New</button>
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
  const starterCode = 
    `/*\n * Write code here and see how\n * the lexer and parser interpret it \n */\n\nconst x = 1;\nconst y = y;\n\nfunction add(a, b){\n  return a + b;\n}\n\nconst sum = add(x, y);`;
  
  const [editorInput, setEditorInput] = useState(loadState);

  function loadState() {
    return localStorage.getItem('code') ?? starterCode;
  }

  function saveState(input: string) {
    localStorage.setItem('code', input);
    setEditorInput(input);
  }

  function resetEditorInput() {
    localStorage.removeItem('code');
    setEditorInput(starterCode);
  }

  return {
    editorInput,
    setEditorInput: saveState,
    resetEditorInput
  }
}

