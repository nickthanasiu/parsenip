import React, { useState, useRef, useEffect, PropsWithChildren } from 'react';
import * as ast from '../../interpreter/ast';
import { colors } from './colors';
import Expander from '../../components/Expander';
import styles from './ASTNode.module.css';
import { useClasses } from '../../hooks/useStyles';
import ConditionalEnhancer from '../../components/ConditionalEnhancer';

export type Props = {
    node: ast.Node;
    cursorPosition: number;
    onMouseLeave: () => void;
    highlightCode(start: number, end: number): void;
};

export default function ASTNode(props: Props) {
    const {
        node: currNode,
        cursorPosition,
        highlightCode,
        onMouseLeave
    } = props;
    
    const nodeRef = useRef<HTMLDivElement>(null);
    const [expanderState, setExpanderState] = useState<
        'untouched' | 'collapsedByUser' | 'expanded'
    >('untouched');
    
    const expanded =
        currNode.type === 'program'
        || (cursorOverNode(currNode) && expanderState !== 'collapsedByUser')
        || expanderState === 'expanded';
    
    const highlighted = cursorOverNode(currNode) && !cursorOverChildNode();

    useEffect(() => {
        if (highlighted && nodeRef.current !== null) {
            nodeRef.current.scrollIntoView();
        }
    }, [highlighted]);

    function isASTNode(val: unknown) {
        return typeof val === 'object';
    }

    function cursorOverNode(node: ast.Node) {
        return cursorPosition >= node.start && cursorPosition <= node.end;
    }

    function cursorOverChildNode() {
        for (const val of Object.values(currNode)) {
            if (isASTNode(val)) {

                if (Array.isArray(val)&& val.some(v => isASTNode(v) && cursorOverNode(v))) {
                    return true;
                }
    
                if (cursorOverNode(val)) {
                    return true;
                }
            }
        }

        return false;
    }


    function onMouseEnter() {
        highlightCode(currNode.start, currNode.end);
    }

    const nodeClasses = useClasses({
        base: [styles.node],
        conditional: [{
            condition: highlighted,
            styles: [styles.highlighted]
        }]
    });

    return (
        <div 
            className={nodeClasses}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            ref={nodeRef}
        >
            <Expander
                title={currNode.type} 
                expanded={expanded}
                toggleExpanded={() => {
                    setExpanderState(!expanded ? 'expanded' : 'collapsedByUser')
                }}
            >
                <RecurseThroughNodes
                    node={currNode} 
                    renderChildNode={(value) => {
                        if (!isASTNode(value)) return value;

                        return (
                            <ConditionalEnhancer
                                condition={Array.isArray(value)}
                                enhancer={BaseComponent =>
                                    <ArrayOfNodes>
                                        {value.map((v: ast.Node) => 
                                            <BaseComponent node={v} />)}
                                    </ArrayOfNodes>
                                }
                            >
                                <ASTNode 
                                    {...props}
                                    node={value}
                                    onMouseLeave={onMouseEnter}
                                />
                            </ConditionalEnhancer>
                        );
                }}/>
            </Expander>
        </div>
    );
}

function ArrayOfNodes({ children }: PropsWithChildren) {
    return <>[{children}]</>
}

interface ASTNodeRecurseProps {
    node: ast.Node;
    renderChildNode(val: any): React.ReactElement;
}

function RecurseThroughNodes({ node, renderChildNode }: ASTNodeRecurseProps) {
    return (
        <>
        {Object.entries(node).map(([key, value]) => {
            return (
                <div key={key}>
                    <span style={{ color: colors.gold }}>{key}: </span>
                    <span style={{ color: colors.seafoam }}>
                        {renderChildNode(value)}
                    </span>
                </div>
            );
        })}
        </>
    );
}