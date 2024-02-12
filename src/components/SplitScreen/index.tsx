import React, { useState, useRef, ReactNode } from 'react';
import styles from './SplitScreen.module.css';

interface Props {
    children: [ReactNode, ReactNode];
}

export default function SplitScreen({ children: [leftPanel, rightPanel] }: Props) {

    const [leftWidthPercentage, setLeftWidthPercentage] = useState(50);
    const [dragging, setDragging] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    function mouseMoveHandler(e: React.MouseEvent<HTMLElement>) {
        if (!dragging || !containerRef.current) return;
        setLeftWidthPercentage((e.clientX / containerRef.current.offsetWidth) * 100);
    }

    return (
        <div 
            className={styles.container}
            style={{ 
                gridTemplateColumns: `${leftWidthPercentage}% 5px ${100-leftWidthPercentage}%`, 
                userSelect: dragging ? 'none' : 'auto',
            }}
            ref={containerRef}
            onMouseUp={() => setDragging(false)}
            onMouseMove={mouseMoveHandler}
        >
            {leftPanel}
            <div 
                className={styles.divider}
                onMouseDown={() => setDragging(true)}
            />
            {rightPanel}
        </div>
    );
}