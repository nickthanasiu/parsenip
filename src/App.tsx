import Editor from "@monaco-editor/react";
import { Position } from "./interpreter/token";
import { useEditor } from './features/textEditor/useEditor';
import TokenCard from "./features/resultsPanel/TokenCard";
import ParserAST from "./features/resultsPanel/ParserAST";
import Button from "./components/Button";
import TabList from "./features/panels/TabList";
import { Panel, type PanelProps } from "./features/panels/Panel";
import { lex } from "./interpreter/lexer";
import { useEval } from "./hooks/useEval";
import { useParser } from "./hooks/useParser";
import resultsPanelStyles from "./features/resultsPanel/ResultsPanel.module.css";
import SplitPanel from "./features/panels/SplitPanel";
import Workspace from "./features/panels/Workspace";
import ConditionalEnhancer from "./components/ConditionalEnhancer";
import './App.css';

export default function App() {
  const {
    cursorPosition,
    input,
    resetInput,
    highlightCode,
    config: editorConfig,
  } = useEditor();

  const [evalResult, setEvalResult] = useEval();
  const [program, parserErrors] = useParser(input);
  
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
        <Button onClick={resetInput}>Reset</Button>
        <Button
          onClick={() => setEvalResult(input)}
          icon={<img src="src/assets/play-icon.png" style={{ marginRight: '5px'}}/>}
        >
          Run
        </Button>
      </header>
      <Workspace>
        <SplitPanel renderPanels={([p1, p2]) => [
          <Panel
            id="editor"
            expanded={p1.expanded}
            toggleExpanded={p1.toggleExpanded}
            tabs={[
                <TabList.Item label="Code">
                  <Editor {...editorConfig} />
                  <div></div>
                </TabList.Item>
          ]}
          />,
          <ConditionalEnhancer<PanelProps>
            condition={Boolean(evalResult)}
            enhancer={(BaseComponent, baseComponentProps) =>
              <SplitPanel
                vertical
                renderPanels={([p1, p2], splitPanelProps) => [
                  <BaseComponent
                    {...baseComponentProps}
                    expanded={p1.expanded}
                    toggleExpanded={p1.toggleExpanded}
                    vertical={splitPanelProps.vertical}
                  />,
                  <Panel
                    id="evalResults"
                    expanded={p2.expanded}
                    toggleExpanded={p2.toggleExpanded}
                    vertical={splitPanelProps.vertical}
                    tabs={[
                      <TabList.Item label="Results">
                        {evalResult}
                      </TabList.Item>,
                    ]}
                  />
              ]}/>
          }>
            <Panel
              id="tokensAndParser"
              expanded={p2.expanded}
              toggleExpanded={p2.toggleExpanded}
              defaultActiveTabIdx={1}
              tabs={[
                <TabList.Item label="Tokens">
                  <div className={resultsPanelStyles.tokenPanel} onMouseLeave={resetCodeHighlight}>
                    {tokens.map(t => (
                      <div onMouseEnter={() => highlightCode(t.position.start, t.position.end)}>
                        <TokenCard
                          token={t}
                          highlighted={cursorIsOverToken(t.position, cursorPosition)}
                        />
                      </div>
                    ))}
                  </div>
                </TabList.Item>,
                <TabList.Item label="Parser">
                  <ParserAST errors={parserErrors}>
                    <ParserAST.Node
                      node={program}
                      cursorPosition={cursorPosition}
                      highlightCode={highlightCode}
                      onMouseLeave={resetCodeHighlight}
                    />
                  </ParserAST>
                </TabList.Item>
              ]}
            />
          </ConditionalEnhancer>
        ]} />
      </Workspace>
    </div>
  );
}
