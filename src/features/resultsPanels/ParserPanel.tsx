import { useEffect, useMemo } from "react";
import { parse } from "../../interpreter/parser";
import Expander from "../../components/Expander";
import ASTNode from "./ASTNode";

function useParserDiff() {
    // We have a string of input

    // String is passed to parse, which returns an array of statements
}


export default function ParserPanel({ input }: { input: string; }) {
    const program = useMemo(() => parse(input), [input]);

    useEffect(() => {
        console.log('Received new input ', input);
    }, [input]);

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




