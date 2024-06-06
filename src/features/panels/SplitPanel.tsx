import React, { useState, useRef, ReactElement } from 'react';
import { useDoubleToggle } from '../../hooks/useToggleBetween';
import { PanelProps } from './Panel';
import classNames from './panels.module.css';
import { useClasses } from '../../hooks/useStyles';

type PanelComponent = ReactElement<PanelProps>;
type RenderPanelProps = Pick<PanelProps, 'expanded' | 'toggleExpanded'>;

type Props = {
    vertical?: boolean;
    renderPanels(
        panelProps: [RenderPanelProps, RenderPanelProps],
        splitPanelProps: Omit<Props, 'renderPanels'>
    ): [PanelComponent, PanelComponent];
};

export default function SplitPanel({ vertical, renderPanels }: Props) {
    const [p1WidthPercentage, setP1WidthPercentage] = useState(50);
    const [dragging, setDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
   
    const {
        state: [p1Expanded, p2Expanded],
        toggleFns: [toggleP1, toggleP2],
        reset: expandBothPanels
    } = useDoubleToggle({ defaultState: 'both' });
 
    function onMouseMove(e: React.MouseEvent<HTMLElement>) {
        if (!dragging || !containerRef.current) return;

        expandBothPanels();

        const dividend = vertical ? e.clientY : e.clientX;
        const divisor = vertical
            ? containerRef.current.offsetHeight
            : containerRef.current.offsetWidth;

        setP1WidthPercentage((dividend / divisor) * 100);
    }

    const PANEL_GAP = 10;
    const HEADER_HEIGHT = 38;

    const gridTemplates = {
        p1Expanded: `auto ${PANEL_GAP}px ${HEADER_HEIGHT}px`,
        p2Expanded: `${HEADER_HEIGHT}px ${PANEL_GAP}px auto`,
        bothExpanded: `
            calc(${p1WidthPercentage}% - ${PANEL_GAP / 2}px)
            ${PANEL_GAP}px
            calc(${100-p1WidthPercentage}% - ${PANEL_GAP / 2}px)
        `,
    };

    const gridStyle = {
        [vertical ? 'gridTemplateRows' : 'gridTemplateColumns']:
            !p1Expanded ? gridTemplates['p2Expanded'] :
            !p2Expanded ? gridTemplates['p1Expanded'] :
            gridTemplates['bothExpanded']
    };

    const containerClasses = useClasses({
        base: [classNames.container],
        conditional: [{
            condition: Boolean(vertical),
            styles: [classNames.vertical]
        }]
    });

    const panelProps = [
        { expanded: p1Expanded, toggleExpanded: toggleP1 },
        { expanded: p2Expanded, toggleExpanded: toggleP2 }
    ] as [RenderPanelProps, RenderPanelProps];

    const [Panel1, Panel2] =  renderPanels(panelProps, { vertical });

    return (
        <div 
            className={containerClasses}
            style={gridStyle}
            ref={containerRef}
            onMouseUp={() => setDragging(false)}
            onMouseMove={onMouseMove}
        >
            {Panel1}
            <div
                className={classNames.divider}
                style={{ [vertical ? 'height' : 'width']: PANEL_GAP  }}
            >
                <div
                    className={classNames.dragIndicator}
                    onMouseDown={() => setDragging(true)}
                />
            </div>
            {Panel2}
        </div>
        
    );
}