import { Token, TokenType } from "../../interpreter/token";
import { colors } from "./colors";

interface Props {
    token: Token;
    highlighted: boolean;
}

export default function TokenCard({ token, highlighted }: Props) {
    const { type, literal } = token;

    const isIllegal = type === TokenType.ILLEGAL;
    const chipColor = isIllegal ? colors.red : highlighted ? colors.gold : colors.blue;

    const cardStyle = {
        backgroundColor: highlighted ? 'rgba(181, 137, 0, 0.15)' : 'var(--base02)',
        border: `1px solid ${highlighted ? 'var(--yellow)' : 'var(--base01)'}`,
        borderRadius: '4px',
        padding: '8px 10px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '6px',
    };

    const chipStyle = {
        display: 'inline-block',
        backgroundColor: chipColor,
        color: '#fff',
        fontSize: '0.68rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        padding: '2px 6px',
        borderRadius: '3px',
        alignSelf: 'flex-start' as const,
    };

    const literalStyle = {
        fontFamily: 'monospace',
        fontSize: '0.85rem',
        color: 'var(--base1)',
    };

    return (
        <div style={cardStyle}>
            <span style={chipStyle}>{type}</span>
            <span style={literalStyle}>{literal}</span>
        </div>
    );
}
