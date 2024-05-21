import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Position } from "./interpreter/token";
import { lex } from "./interpreter/lexer";
import { evaluate } from "./interpreter/evaluator";
import { parse } from "./interpreter/parser";
import { toString } from "./interpreter/object";
import { Environment } from "./interpreter/environment";
import ResultsPanel from './features/resultsPanel/ResultsPanel';
import { useEditor } from './features/textEditor/useEditor';
import TokenCard from "./features/resultsPanel/TokenCard";
import ParserPanel from "./features/resultsPanel/ParserPanel";
import SplitScreen from './components/SplitScreen';
import Panel from "./components/Panel";
import Button from "./components/Button";

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

  const [evalResult, setEvalResult] = useState('');
 
  const cursorIsOverToken = ({ start, end }: Position, cursorPosition: number) => {
    return cursorPosition >= start && cursorPosition <= end;
  };

  const resetCodeHighlight = () => {
    highlightCode(0, 0);
  };

  const handleEval = () => {
    const [program, _] = parse(input);
    const result = evaluate(program, new Environment());
    setEvalResult(toString(result));
  }

  return (
    <div className="app">
      <header>
        <h3>{document.title}</h3>
        <Button onClick={resetInput}>Reset</Button>
        <Button 
          onClick={handleEval}
          icon={<img src="src/assets/play-icon.png" style={{ marginRight: '5px'}}/>}
        >
          Run
        </Button>
      </header>
      <SplitScreen>
        <Panel>
          <Editor className="editor" {...editorConfig} />
        </Panel>
        <ResultsPanel evalResult={evalResult}>
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
