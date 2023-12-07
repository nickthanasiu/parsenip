import { parse } from "../../interpreter/parser";

export default function ParserPanel({ input }: { input: string; }) {
    const program = parse(input);

    return (
        <div style={{ 
            backgroundColor: '#fff',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            rowGap: '10px',
            columnGap: '10px',
            padding: '15px',
            height: 'min-content'
        }}>
            {program.statements.map(statement => {
                console.log('Statement :: ', statement);
                return <div>Statement: </div>
            })}
        </div>
    );
}
