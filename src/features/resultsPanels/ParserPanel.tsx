import { useMemo } from "react";
import { parse } from "../../interpreter/parser";
import Expander from "../../components/Expander";
import ASTNode from "./ASTNode";

export default function ParserPanel({ input }: { input: string; }) {
    const program = useMemo(() => parse(input), [input]);

    const styles = {
        paddingLeft: '25px',
    };

    return (
        <div style={styles}>
            {program.body.map(statement => 
                    <div>
                        <Expander title={statement.type}>
                            <ASTNode node={statement} />
                        </Expander>
                    </div>
                )}
        </div>
    );
}




