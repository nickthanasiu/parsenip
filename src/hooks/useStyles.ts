interface UseStylesOpts {
    base: React.CSSProperties;
    conditional: Array<{
      condition: boolean;
      styles: React.CSSProperties;
    }>
  }

interface UseClassNamesOpts {
base: string[];
conditional: Array<{
    condition: boolean;
    styles: string[];
}>
}

export function useStyles({ base, conditional }: UseStylesOpts) {
    return conditional
        .filter(c => c.condition)
        .reduce((prev, curr) => ({
            ...prev, ...curr.styles
        }), base);
}

export function useClasses({ base, conditional }: UseClassNamesOpts) {
    return [
        ...base,
        conditional
        .filter(c => c.condition)
        .map(c => c.styles)
    ].join(' ');
}