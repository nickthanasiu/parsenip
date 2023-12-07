import { Token, TokenType } from "../../interpreter/token";
import { colors } from "./colors";

interface Props {
    token: Token;
}

export default function TokenCard({ token }: Props) {
    const { type, literal } = token;

    const tokenColor =
        type === TokenType.ILLEGAL
        ? colors.red
        : colors.blue
    ;

    const isIllegal = type === TokenType.ILLEGAL;

    const styles = {
        border: '1px solid',
        display: 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
        borderColor: tokenColor,
        color: tokenColor,
    };

    const keyColor = isIllegal ? colors.red : colors.gold;
    const valueColor = isIllegal ? colors.red: colors.seafoam;

    return (
        <div style={styles}>
            <div>
                <span style={{ color: keyColor }}>type: </span>
                <span style={{ color: valueColor }}>{type}</span>
            </div>
            <div>
                <span style={{ color: keyColor }}>value: </span>
                <span style={{ color: valueColor }}>{literal}</span>
            </div>
        </div>
    );
}