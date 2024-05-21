import React, { useState, useRef, ReactNode } from 'react';
import { _style } from '../../util/style';
import styles from './SplitScreen.module.css';

interface Props {
    children: [ReactNode, ReactNode];
    vertical?: boolean;
}

export default function SplitScreen({ children: [leftPanel, rightPanel], vertical }: Props) {

    const [leftWidthPercentage, setLeftWidthPercentage] = useState(50);
    const [dragging, setDragging] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    function mouseMoveHandler(e: React.MouseEvent<HTMLElement>) {
        if (!dragging || !containerRef.current) return;

        const dividend = vertical ? e.clientY : e.clientX;
        const divisor = vertical
            ? containerRef.current.offsetHeight
            : containerRef.current.offsetWidth;

        setLeftWidthPercentage((dividend / divisor) * 100);
    }

    return (
        <div 
            className={_style({
                base: [styles.container],
                conditional: [
                    { condition: !!vertical, styles: styles.vertical},
                    { condition: dragging, styles: styles.dragging },
                ]
            })}
            style={{
                gridTemplateRows: vertical ? `${leftWidthPercentage}% 10px ${100-leftWidthPercentage}%` : 'none',
                gridTemplateColumns: vertical ? 'none':  `${leftWidthPercentage}% 10px ${100-leftWidthPercentage}%`,
            }}
            ref={containerRef}
            onMouseUp={() => setDragging(false)}
            onMouseMove={mouseMoveHandler}
        >
            {leftPanel}
            <div className={styles.divider}>
                <div 
                    className={styles.dragIndicator}
                    onMouseDown={() => setDragging(true)}
                />
            </div>
            {rightPanel}
        </div>
    );
}