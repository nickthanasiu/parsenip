import { PropsWithChildren, MouseEventHandler } from "react";

type Props = {
    onClick?: MouseEventHandler;
    icon?: JSX.Element;
}

export default function Button({ onClick, icon, children }: PropsWithChildren<Props>) {
    const styles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    };

    return (    
        <button
            onClick={onClick}
            style={styles}
        >
            {icon}
            {children}
        </button>
    );
}