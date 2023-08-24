import './App.css';
import SplitScreen from './components/SplitScreen';
import TextEditor from './features/textEditor/TextEditor';

export default function App() {
  return (
    <div className="app">
      <SplitScreen>
        <TextEditor />
        <div>Tokens will go here</div>
      </SplitScreen>
    </div>
  );
}


