import TokenCard from "./TokenCard";
import { Token } from "../../interpreter/token";
import { lex } from "../../interpreter/lexer";

export default function TokensPanel({ input, cursorPosition }: { input: string; cursorPosition: number }) {
    const tokens = lex(input);

    function cursorIsOverToken(token: Token) {
        const { start, end } = token.position;
        return cursorPosition >= start && cursorPosition <= end;
    }

    return (
        <div style={{ 
            backgroundColor: '#fff',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            rowGap: '10px',
            //columnGap: '10px',
            padding: '15px',
            height: 'min-content',
        }}>
            {tokens.map(t => <TokenCard token={t} highlighted={cursorIsOverToken(t)} />)}
        </div>
    );
}
