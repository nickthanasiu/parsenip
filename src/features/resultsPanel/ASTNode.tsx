import { useState } from 'react';
import * as ast from '../../interpreter/ast';
import { colors } from './colors';
import Expander from '../../components/Expander';

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
    
    const [expanderState, setExpanderState] = useState<
        'untouched' | 'collapsedByUser' | 'expanded'
    >('untouched');

    const expanded =
        (cursorOverNode(currNode) && expanderState !== 'collapsedByUser')
        || expanderState === 'expanded';
    
    const highlighted = cursorOverNode(currNode) && !cursorOverChildNode();

    /* @TODO: This method could be way more specific, 
     * but for now we should feel safe assuming that any value of type 'object'
     * we encounter is in fact an ast node
     */
    function isASTNode(val: unknown) {
        return typeof val === 'object';
    }

    function cursorOverNode(node: ast.Node) {
        return cursorPosition >= node.start && cursorPosition <= node.end;
    }

    // @TODO: See if this can be done more efficiently, by passing down a function through
    // child nodes
    function cursorOverChildNode() {
        for (const val of Object.values(currNode)) {
            if (isASTNode(val)) {
                if (Array.isArray(val)) {
                    if (val.some(v => isASTNode(v) && cursorOverNode(v))) {
                        return true;
                    }
                }

                if (cursorOverNode(val)) {
                    return true;
                }
            }
        }

        return false;
    }

    function toggleExpanded() {
        setExpanderState(!expanded ? 'expanded' : 'collapsedByUser');
    }

    function onMouseEnter() {
        highlightCode(currNode.start, currNode.end);
    }


    const styles = {
        paddingLeft: '10px',
        marginBottom: '0px',
        backgroundColor: highlighted ? '#f5f5d6': '',
    };

    return (
        <div style={styles} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <Expander
                title={currNode.type} 
                expanded={expanded}
                toggleExpanded={toggleExpanded}
            >
                {Object.entries(currNode).map(([key, value]) => {
                    return (
                        <div key={key}>
                            <span style={{ color: colors.gold }}>{key}: </span>
                            <span style={{ color: colors.seafoam }}>
                            {
                                isASTNode(value)
                                    ? Array.isArray(value)
                                        ? <>
                                            [
                                            {value.map(v => (
                                                <ASTNode 
                                                    {...props}
                                                    node={v}
                                                    onMouseLeave={onMouseEnter}
                                                />
                                            ))}
                                            ]
                                          </>
                                        : <ASTNode 
                                            {...props}
                                            node={value}
                                            onMouseLeave={onMouseEnter}
                                        />
                                    : value
                            }
                            </span>
                        </div>
                    );
                })}
            </Expander>
        </div>
    );
}