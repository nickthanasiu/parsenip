import { useState } from "react";
import TokenCard from "./TokenCard";
import { lex } from "../../interpreter/lexer";

interface Props {
    input: string;
}

type TabName = 'tokens' | 'parser' | 'evaluate';
type Tab = {
    name: TabName;
    displayName: string;
};

export default function ResultsPanels({ input }: Props) {
    const [activeTab, setActiveTab] = useState<TabName>('tokens');

    const tabs: Tab[] = [
        { name: 'tokens', displayName: 'Tokens' },
        { name: 'parser', displayName: 'Parser' },
        { name: 'evaluate', displayName: 'Run Code'}
    ];

    const tabsStyles = {
        display: 'flex',
        height: '50px',
        backgroundColor: 'white',
        paddingLeft: '5px',
    };

    const DisplayPanel = () => activeTab === 'tokens'
        ? <TokensPanel input={input} />
        : <ParserPanel />

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
            </div>

            <DisplayPanel />
        </div>
    );
}

function Tab({ handleClick, displayName, active }: { handleClick: any; displayName: string; active: boolean; }) {

    let tabStyles = {
        width: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    };

    const activeStyles = {
        borderBottom: active ? '3px solid #4666ff' : '',
        color: active ? 'black' : 'gray',
    };

    if (active) {
        tabStyles = {
            ...tabStyles,
            ...activeStyles
        };
    }

    return (
        <div onClick={handleClick} style={tabStyles}>
            {displayName}
        </div>
    );
}

function TokensPanel({ input }: { input: string; }) {
    const tokens = lex(input);

    return (
        <div style={{ 
            backgroundColor: '#fff',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            rowGap: '10px',
            columnGap: '10px',
            padding: '15px',
            height: 'min-content'
        }}>
            {tokens.map(t => <TokenCard token={t} />)}
        </div>
    );
}

function ParserPanel() {
    return (
        <div style={{ paddingLeft: '10px'}}>
            <h2>Under Construction...</h2>
        </div>
    );
}