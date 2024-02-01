import { useMemo } from "react";
import { parse } from "../../interpreter/parser";
import ASTNode from "./ASTNode";

export default function ParserPanel({ input, cursorPosition }: { input: string; cursorPosition: number; }) {
    const [program, errors] = useMemo(() => parse(input), [input]);

    return (
        <div>
            {errors 
                ? <ParserErrors errors={errors} />
                : program.body.map(statement => 
                    <div>
                        <ASTNode 
                            node={statement}
                            cursorPosition={cursorPosition}
                        />
                    </div>
            )}
        </div>
    );
}

function ParserErrors({ errors }: { errors: string[] }) {
    return (
        <div style={{ backgroundColor: '#f09999' }}>
            <h3>Found the following errors while parsing: </h3>

            {errors.map((err, i) => <p key={err + i}>{err}</p>)}
        </div>
    );
}




