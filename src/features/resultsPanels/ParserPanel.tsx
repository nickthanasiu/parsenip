import { useMemo } from "react";
import { parse } from "../../interpreter/parser";
import Expander from "../../components/Expander";
import ASTNode from "./ASTNode";


export default function ParserPanel({ input }: { input: string; }) {
    const [program, errors] = useMemo(() => parse(input), [input]);

    return (
        <div>
            {errors 
                ? <ParserErrors errors={errors} />
                : program.body.map(statement => 
                    <div>
                        <Expander title={statement.type}>
                            <ASTNode node={statement} />
                        </Expander>
                    </div>
            )}
        </div>
    );
}

function ParserErrors({ errors }: { errors: string[] }) {
    return (
        <div style={{ backgroundColor: '#f09999' }}>
            <h3>Found the following errors while parsing: </h3>

            {errors.map(err => <p>{err}</p>)}
        </div>
    );
}




