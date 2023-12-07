interface Props {
    handleClick: any;
    displayName: string;
    active: boolean; 
}

export default function Tab({ handleClick, displayName, active }: Props) {
    let tabStyles = {
        width: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    };

    const activeStyles = {
        borderBottom: active ? '3px solid #4666ff' : '',
        color: active ? 'black' : 'gray',
    };

    if (active) {
        tabStyles = {
            ...tabStyles,
            ...activeStyles
        };
    }

    return (
        <div onClick={handleClick} style={tabStyles}>
            {displayName}
        </div>
    );
}
