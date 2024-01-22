import { useState, useRef} from 'react';
import { editor } from "monaco-editor";
import SplitScreen from './components/SplitScreen';
import TextEditor, { useCursorPosition } from './features/textEditor';
import ResultsPanels from './features/resultsPanels';
import './App.css';
import { Editor } from '@monaco-editor/react';

type Editor = editor.IStandaloneCodeEditor;

export default function App() {
  const initialValue = "let five = 5;\nlet six = 6;\nfive != six;"
  
  //\n\nfn incr(num) {\n\tnum + 1;\n}\n\nlet six = incr(five);";
  const [editorInput, setEditorInput] = useState(initialValue);

  const editorRef = useRef<Editor>();
  const [cursorPosition, updateCursorPosition] = useCursorPosition(editorRef);
  
  return (
    <div className="app">
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


