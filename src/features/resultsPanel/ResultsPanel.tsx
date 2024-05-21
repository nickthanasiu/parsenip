import React, { useState, ReactNode } from "react";
import SplitScreen from "../../components/SplitScreen";
import { _style } from "../../util/style";
import Panel from "../../components/Panel";

type Tab = {
    name: 'tokens' | 'parser';
};

interface Props {
    evalResult: string;
    children: [ReactNode, ReactNode];
}

export default function ResultsPanel({
    evalResult,
    children: [TokenPanel, ParserPanel]
}: Props) {
    const [activeTab, setActiveTab] = useState<Tab['name']>('parser');

    const tabs: Tab[] = [
        { name: 'tokens' },
        { name: 'parser' },
    ];

    const ActivePanel = () => {
        switch (activeTab) {
            case 'parser':
                return ParserPanel;
            case 'tokens':
                return TokenPanel;
            default:
                throw new Error(`Invalid tab selection`);
        }
    };

    const Wrapper = ({ children }: { children: React.ReactElement }) =>
        evalResult ? (
            <SplitScreen vertical>
                {children}
                <EvalPanel evalResult={evalResult} />
            </SplitScreen>
        )
        : <>{children}</>;

    return (
        <Wrapper>
            <Panel>
                <Panel.Header>
                    <Panel.Tabs 
                        tabs={tabs}
                        tabState={[activeTab, setActiveTab]}
                    />
                </Panel.Header>
                <ActivePanel />
            </Panel>
        </Wrapper>
    );
}

function EvalPanel({ evalResult }: { evalResult: string; }) {
    return (
        <Panel>
            {evalResult}
        </Panel>
    );
}