type StyleOpts = { 
    base?: string[];
    conditional?: { condition: boolean, styles: string | string[] }[];
};

export function _style({ base, conditional }: StyleOpts) {
    const styles = base || [];

    if (conditional) {
        for (const cs of conditional) {
            if (cs.condition) {
                addStyles(styles, cs.styles);
            }
        }
    }

    return styles.join(' ');

    function addStyles(stylesArr: string[], stylesToAdd: string | string[]) {
        if (typeof stylesToAdd === "string") {
            return stylesArr.push(stylesToAdd);
        }

        stylesArr.push(...stylesToAdd.map(s => s));
    }
}