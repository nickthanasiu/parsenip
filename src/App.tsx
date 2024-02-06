import { useState, useRef} from 'react';
import { editor } from "monaco-editor";
import SplitScreen from './components/SplitScreen';
import TextEditor, { useCursorPosition } from './features/textEditor';
import ResultsPanels from './features/resultsPanels';
import './App.css';
import { Editor } from '@monaco-editor/react';

type Editor = editor.IStandaloneCodeEditor;

export default function App() {
  const initialValue = 
    `let x = true;
    if (x) {
      return 1;
    } else {
      return 0;
    }`;
  
  //\n\nfn incr(num) {\n\tnum + 1;\n}\n\nlet six = incr(five);";
  const [editorInput, setEditorInput] = useState(initialValue);

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


