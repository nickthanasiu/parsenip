import { PropsWithChildren } from "react";
import { colors } from "../features/resultsPanel/colors";

type Props = PropsWithChildren<{ 
    title: string;
    expanded: boolean;
    toggleExpanded: any; // TODO update with more specific type
}>

export default function Expander({ title, expanded, toggleExpanded, children }: Props) {

    const indicator = { color: colors.green, symbol: "+" };

    if (expanded) {
        indicator.color = colors.red;
        indicator.symbol = "-";
    }

    return (
        <div style={{ paddingLeft: '10px' }}>
            <span style={{ color: indicator.color }}>{indicator.symbol} </span>
            <span style={{ color: colors.blue }} onClick={toggleExpanded}>
                {title}
            </span>
            {expanded && children}
        </div>
    )
}