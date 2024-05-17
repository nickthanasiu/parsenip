import { useState, ReactNode } from "react";
import styles from "./ResultsPanel.module.css";


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

    return (
        <div>
            <div className={styles.tabs}>
                {tabs.map(t =>
                    <div
                        className={conditionalStyles({
                            baseStyles: [styles.tab],
                            conditionalStyles: [{
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
    );
}

type ConditionalStylesOpts = { 
    baseStyles: string[];
    conditionalStyles: { condition: boolean, styles: string | string[] }[];
};

function conditionalStyles({ baseStyles, conditionalStyles }: ConditionalStylesOpts) {
    const styles = baseStyles;

    for (const cs of conditionalStyles) {
        if (cs.condition) {
            addStyles(styles, cs.styles);
        }
    }

    return styles.join(' ');

    function addStyles(stylesArr: string[], stylesToAdd: string | string[]) {
        if (typeof stylesToAdd === "string") {
            return stylesArr.push(stylesToAdd);
        }

        stylesArr.push(...stylesToAdd.map(s => s));
    }
}