import { useState, PropsWithChildren } from "react";
import { colors } from "../features/resultsPanels/colors";

type Props = PropsWithChildren<{ 
    title: any,
    defaultExpanded?: boolean
}>

export default function Expander({ title, defaultExpanded = false, children }: Props) {
    const [expanded, setExpanded] = useState(defaultExpanded);

    let indicator = { color: colors.green, symbol: "+" };

    if (expanded) {
        indicator.color = colors.red;
        indicator.symbol = "-";
    }

    return (
        <div style={{ paddingLeft: '10px' }}>
            <span style={{ color: indicator.color }}>{indicator.symbol} </span>
            <span onClick={() => setExpanded(!expanded)}>
                {title}
            </span>
            {expanded && children}
        </div>
    )
}