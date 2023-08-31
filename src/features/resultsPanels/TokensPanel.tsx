import TokenCard from "./TokenCard";
import { lex } from "../../interpreter/lexer";

export default function TokensPanel({ input }: { input: string; }) {
    const tokens = lex(input);

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
            {tokens.map(t => <TokenCard token={t} />)}
        </div>
    );
}
