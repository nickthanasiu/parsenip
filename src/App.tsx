import { useState } from 'react';
import SplitScreen from './components/SplitScreen';
import TextEditor from './features/textEditor';
import ResultsPanels from './features/resultsPanels';
import './App.css';

export default function App() {
  const initialValue = "let five = 5;\nlet six = 6;\nfive != six;"
  
  //\n\nfn incr(num) {\n\tnum + 1;\n}\n\nlet six = incr(five);";
  const [editorInput, setEditorInput] = useState(initialValue);
  
  return (
    <div className="app">
      <SplitScreen>
        <TextEditor initialValue={editorInput} setEditorInput={setEditorInput} />
        <ResultsPanels input={editorInput} />
      </SplitScreen>
    </div>
  );
}


