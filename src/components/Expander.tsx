import { PropsWithChildren } from "react";
import { colors } from "../features/resultsPanel/colors";

type Props = PropsWithChildren<{
    title: string;
    expanded: boolean;
    highlighted?: boolean;
    toggleExpanded: any; // TODO update with more specific type
}>

export default function Expander({ title, expanded, highlighted, toggleExpanded, children }: Props) {
    const chevron = expanded ? '▾' : '▸';

    const chipStyle = {
        display: 'inline-block',
        backgroundColor: highlighted ? colors.gold : colors.blue,
        color: '#fff',
        fontSize: '0.68rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        padding: '2px 6px',
        borderRadius: '3px',
        cursor: 'pointer',
    };

    return (
        <div style={{ paddingLeft: '10px' }}>
            <span
                style={{ color: 'var(--base01)', marginRight: '5px', fontSize: '0.75rem', cursor: 'pointer' }}
                onClick={toggleExpanded}
            >
                {chevron}
            </span>
            <span style={chipStyle} onClick={toggleExpanded}>
                {title}
            </span>
            {expanded && children}
        </div>
    )
}
