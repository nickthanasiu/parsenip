import { useState } from 'react';
import * as ast from '../../interpreter/ast';
import { colors } from './colors';
import Expander from '../../components/Expander';

type Props = {
    node: ast.Node;
    cursorPosition: number;
};

export default function ASTNode({ node: currNode, cursorPosition }: Props) {

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

    const styles = {
        paddingLeft: '10px',
        marginBottom: '0px',
        backgroundColor: highlighted ? 'yellow': '',
    };

    return (
        <div style={styles}>
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
                                            {value.map(v => <ASTNode node={v} cursorPosition={cursorPosition} />)}
                                            ]
                                          </>
                                        : <ASTNode node={value} cursorPosition={cursorPosition} />
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