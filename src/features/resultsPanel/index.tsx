import TokenCard from "./TokenCard";
import { lex } from "../../interpreter/lexer";

interface Props {
    input: string;
}

export default function ResultsPanel({ input }: Props) {
    const tokens = lex(input);

    console.log(tokens);

    return (
        <div style={{ 
            backgroundColor: 'black',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            rowGap: '10px',
            columnGap: '10px',
            padding: '15px',
            height: 'min-content'
        }}>
          {tokens.map(t => <TokenCard token={t} />)}
        </div>
    );
}