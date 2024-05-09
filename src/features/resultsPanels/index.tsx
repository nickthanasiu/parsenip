import { useState } from "react";
import Tab from "./Tab";
import TokensPanel from "./TokensPanel";
import ParserPanel from "./ParserPanel";
import { evaluate } from "../../interpreter/evaluator";
import { parse } from "../../interpreter/parser";
import { toString } from "../../interpreter/object";
import { Environment } from "../../interpreter/environment";


type TabName = 'tokens' | 'parser' | 'evaluate';
type Tab = {
    name: TabName;
    displayName: string;
};

interface Props {
    input: string;
    cursorPosition: number;
}

export default function ResultsPanels(props: Props) {
    const [activeTab, setActiveTab] = useState<TabName>('parser');
    const [result, setResult] = useState('');

    const tabs: Tab[] = [
        { name: 'tokens', displayName: 'Tokens' },
        { name: 'parser', displayName: 'Parser' },
    ];

    const tabsStyles = {
        display: 'flex',
        height: '50px',
        backgroundColor: 'white',
        paddingLeft: '5px',
    };

    function DisplayPanel(props: Props) {
        let DisplayPanel;
    
        switch (activeTab) {
            case 'tokens':
                DisplayPanel = TokensPanel;
                break;
            case 'parser':
            default:
                DisplayPanel = ParserPanel;
        }

        return <DisplayPanel {...props} />
    };

    function evaluateCode() {
        const [program, _] = parse(props.input);
        const env = new Environment();
        const result = toString(evaluate(program, env));
        setResult(result);
    }

    return (
        <div>
            <div style={tabsStyles}>
                {tabs.map(t => 
                    <Tab 
                        displayName={t.displayName} 
                        active={activeTab === t.name} 
                        handleClick={() => setActiveTab(t.name)}
                    />
                )}

                <button onClick={evaluateCode}>Run Code</button>
                {result && <OutputPanel output={result} />}
            </div>

            <DisplayPanel {...props} />
        </div>
    );
}

function OutputPanel({ output } : { output: string }) {
    return (
        <div>
            <div style={{ backgroundColor: 'gray', borderRadius: '5px' }}>
                { output }
            </div>
        </div>
    );
}