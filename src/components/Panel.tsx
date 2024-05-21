import { PropsWithChildren } from "react";
import styles from "./Panel.module.css";
import { _style } from "../util/style";

export default function Panel({ children }: PropsWithChildren) {

    return (
        <div className={styles.panel}>
            {children}
        </div>
    );
}

Panel.Header = function({ children }: PropsWithChildren) {
    return (
        <div className={styles.header}>
            {children}
        </div>
    );
}

type PanelTabsProps = {
    tabs: { name: string; }[];
    tabState:any;
}

Panel.Tabs = function({ tabs, tabState }: PanelTabsProps) {
    const [activeTab, setActiveTab] = tabState;

    return (
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
                    <div className={styles.tabText}>
                        {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                    </div>
                </div>
            )}
        </div>
    );
}