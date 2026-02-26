import Editor from "@monaco-editor/react";
import { useMemo } from "react";
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

  const tokens = useMemo(() => lex(input), [input]);
 
  function resetCodeHighlight() {
    highlightCode(0, 0);
  }


  return (
    <div className="app">
      <header>
        <h3>{document.title}</h3>
        <button onClick={resetInput}>New</button>
      </header>
      <SplitScreen>
        <Editor {...editorConfig} />
        <ResultsPanel>
          <div className={styles.tokenPanel} onMouseLeave={resetCodeHighlight}>
            {tokens.map(t => (
              <div key={t.position.start} onMouseEnter={() => highlightCode(t.position.start, t.position.end)}>
                <TokenCard
                  token={t}
                  highlighted={cursorPosition >= t.position.start && cursorPosition <= t.position.end}
                />
              </div>
            ))}
          </div>
          <ParserPanel
            input={input}
            astNodeProps={{
              cursorPosition,
              highlightCode,
              // Reset code highlighting when mouse leaves ParserPanel entirely
              onMouseLeave: resetCodeHighlight
            }}
          />
        </ResultsPanel>
      </SplitScreen>
    </div>
  );
}
