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

  const tokens = lex(input); // @TODO is this being called unnecessarily??
 
  const cursorIsOverToken = ({ start, end }: Position, cursorPosition: number) => {
    return cursorPosition >= start && cursorPosition <= end;
  };

  const resetCodeHighlight = () => {
    highlightCode(0, 0);
  };

  return (
    <div className="app">
      <header>
        <h3>{document.title}</h3>
        <button onClick={resetInput}>Reset</button>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <img src="src/assets/play-icon.png" style={{ marginRight: '5px'}}/>
          Run
        </button>
      </header>
      <SplitScreen>
        <Editor {...editorConfig} />
        <ResultsPanel>
          <div className={styles.tokenPanel} onMouseLeave={resetCodeHighlight}>
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
