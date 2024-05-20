import { useState, ReactNode } from "react";
import styles from "./ResultsPanel.module.css";
import SplitScreen from "../../components/SplitScreen";
import { _style } from "../../util/style";

type Tab = {
    name: 'tokens' | 'parser';
};

interface Props {
    children: [ReactNode, ReactNode];
}

export default function ResultsPanel({
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

    const showEvalResult = true;

    return (
        <div style={{ backgroundColor: '#fff'}}>
            <SplitScreen vertical>
                <div style={{ overflow: 'scroll' }}>
                    <div className={styles.tabs}>
                        {tabs.map(t =>
                            <div
                                className={_style({
                                    base: [styles.tab],
                                    conditional: [{
                                        condition: t.name === activeTab,
                                        styles: styles.activeTab
                                    }]
                                })}
                                onClick={() => setActiveTab(t.name)}
                            >
                                {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                            </div>
                        )}
                    </div>
                    <ActivePanel />
                </div>
                {showEvalResult && <div style={{
                    border: '1px solid red',  
                }}>Evaluate results: ...</div>}
            </SplitScreen>
        </div>
    );
}