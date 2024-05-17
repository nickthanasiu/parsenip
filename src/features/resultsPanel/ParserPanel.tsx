import { parse } from "../../interpreter/parser";
import styles from "./ResultsPanel.module.css";
import ASTNode, { Props as ASTNodeProps } from "./ASTNode";

type Props = {
    input: string;
    astNodeProps: Omit<ASTNodeProps, "node">
}
    
export default function ParserPanel({ input, astNodeProps }: Props) {
   const [program, errors] = parse(input);

    return (
        <div>
            {errors 
                ? <ParserErrors errors={errors} />
                : <ASTNode 
                    {...astNodeProps}
                    node={program}
                />
            }
        </div>
    );
}

function ParserErrors({ errors }: { errors: string[] }) {
    return (
        <div className={styles.parserErrors}>
            <h3>Found the following errors while parsing: </h3>
            {errors.map((err, i) => <p key={err + i}>{err}</p>)}
        </div>
    );
}