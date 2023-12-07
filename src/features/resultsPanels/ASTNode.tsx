import * as ast from '../../interpreter/ast';
import { colors } from './colors';

export default function ASTNode({ node }: { node: ast.Node }) {

    const styles = {
        paddingLeft: '10px',
        marginBottom: '0px',
    };

    return Object.entries(node).map(([k, v]) => {

        if (typeof v === 'object') {
            v = <ASTNode node={v} />;
        }

        return (
            <div style={styles}>
                <span style={{ color: colors.gold }}>{k}: </span>
                <span style={{ color: colors.seafoam }}>{v}</span>
            </div>
        );
    })

}