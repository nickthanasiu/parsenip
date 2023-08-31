import { Token, TokenType } from "../../interpreter/token";

interface Props {
    token: Token;
}

export default function TokenCard({ token }: Props) {
    const { type, literal } = token;

    const tokenColor =
        type === TokenType.ILLEGAL
        ? 'red'
        : '#4666ff'
    ;

    const styles = {
        border: '1px solid',
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        height: '70px',
        minWidth: '70px',
        width: 'auto',
        borderColor: tokenColor,
        color: tokenColor,
    };

    return (
        <div style={styles}>
            <div>{type}</div>
            <div>{literal}</div>
        </div>
    );
}