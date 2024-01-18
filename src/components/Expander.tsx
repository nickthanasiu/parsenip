import { PropsWithChildren, useRef, useState } from "react";
import { colors } from "../features/resultsPanels/colors";

type Props = PropsWithChildren<{ 
    title: any,
    defaultExpanded?: boolean
}>

function useExpanded() {
    const expandedRef = useRef(false);

    const setExpandedRef = () => {
        expandedRef.current = !expandedRef.current;
    }

    return [expandedRef, setExpandedRef] as const;
}

export default function Expander({ title, children }: Props) {

    const [expanded, setExpanded] = useState(false);


    let indicator = { color: colors.green, symbol: "+" };

    if (expanded) {
        indicator.color = colors.red;
        indicator.symbol = "-";
    }

    return (
        <div style={{ paddingLeft: '10px' }}>
            <span style={{ color: indicator.color }}>{indicator.symbol} </span>
            <span style={{ color: colors.blue }} onClick={() => setExpanded(!expanded)}>
                {title}
            </span>
            {expanded && children}
        </div>
    )
}