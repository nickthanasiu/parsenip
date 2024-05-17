import Editor from "@monaco-editor/react";
import { Position } from "./interpreter/token";
import { lex } from "./interpreter/lexer";
import SplitScreen from './components/SplitScreen';
import ResultsPanel from './features/resultsPanel/ResultsPanel';
import { useEditor } from './features/textEditor/useEditor';
import TokenCard from "./features/resultsPanel/TokenCard";
import ParserPanel from "./features/resultsPanel/ParserPanel";
import styles from "./features/resultsPanel/ResultsPanel.module.css";
import './App.css';

export default function App() {
  const {
    cursorPosition,
    input,
    resetInput,
    highlightCode,
    config: editorConfig,
  } = useEditor();

  const tokens = lex(input);
 
  const cursorIsOverToken = ({ start, end }: Position, cursorPosition: number) => {
    return cursorPosition >= start && cursorPosition <= end;
  };

  return (
    <div className="app">
      <header>
        <h3>{document.title}</h3>
        <button onClick={resetInput}>New</button>
      </header>
      <SplitScreen>
        <Editor {...editorConfig} />
        <ResultsPanel>
          <div className={styles.tokenPanel}>
            {tokens.map(t => (
              <div onMouseEnter={() => highlightCode(t.position.start, t.position.end)}>
              <TokenCard
                token={t}
                highlighted={cursorIsOverToken(t.position, cursorPosition)}
              />
              </div>
            ))}
          </div>
          <ParserPanel
            input={input}
            astNodeProps={{
              cursorPosition,
              highlightCode
            }}
          />
        </ResultsPanel>
      </SplitScreen>
    </div>
  );
}
