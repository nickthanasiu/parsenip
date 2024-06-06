import styles from "./ResultsPanel.module.css";
import ASTNode, { Props as ASTNodeProps } from "./ASTNode";

type Props = {
    errors: string[];
    children: React.ReactElement<ASTNodeProps>;
}
    
export default function ParserAST({ errors, children }: Props) {
    if (errors) {
        return (
            <div className={styles.parserErrors}>
                <h3>Found the following errors while parsing: </h3>
                {errors.map((err, i) => <p key={err + i}>{err}</p>)}
            </div>
        );
    }
   
    return children;
}

ParserAST.Node = ASTNode;

