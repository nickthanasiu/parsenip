import { useState } from 'react';
import SplitScreen from './components/SplitScreen';
import TextEditor from './features/textEditor';
import ResultsPanel from './features/resultsPanel';
import './App.css';

export default function App() {
  const initialValue = "let five = 5;\n\nfn incr(num) {\n\tnum + 1;\n}\n\nlet six = incr(five);";
  const [editorInput, setEditorInput] = useState(initialValue);
  
  return (
    <div className="app">
      <SplitScreen>
        <TextEditor initialValue={editorInput} setEditorInput={setEditorInput} />
        <ResultsPanel input={editorInput} />
      </SplitScreen>
    </div>
  );
}


