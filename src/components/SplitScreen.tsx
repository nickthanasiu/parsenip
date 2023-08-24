import { ReactNode } from 'react';
import styles from './SplitScreen.module.css';

interface Props {
    leftWidth?: number;
    children: [ReactNode, ReactNode];
}

export default function SplitScreen({ leftWidth = 50, children }: Props) {
    if (leftWidth > 100) throw new Error('leftWidth cannot be greater than 100');

    return (
        <div 
            className={styles.container}
            style={{ gridTemplateColumns: `${leftWidth}% ${100-leftWidth}%` }}
        >
            {children}
        </div>
    );
}