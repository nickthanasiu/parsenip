import { useReducer } from "react";

type ToggleState =
    | 'a'
    | 'b'
    | 'both'
;

type ToggleAction = {
    type: ToggleState;
}

function reducer(state: ToggleState, action: ToggleAction): ToggleState {
    if (action.type === 'both') {
        return 'both';
    }

    // If state === default OR state === action.type: return opposite,
    else if (state === 'both' || state === action.type) {
        return action.type === 'a' ? 'b' : 'a';
    }
    // Else, return 'default'
    else {
        return 'both';
    }
}

export function useDoubleToggle({ defaultState = 'both' }: { defaultState?: ToggleState; }) {
    const [state, dispatch] = useReducer(reducer, defaultState);

    const mStateToArr: Readonly<Record<ToggleState, [boolean, boolean]>> = {
        a: [true, false],
        b: [false, true],
        both: [true, true]
    };

    return {
        state: mStateToArr[state],
        toggleFns: [
            () => dispatch({ type: 'a' }),
            () => dispatch({ type: 'b' }),
        ],
        reset: () => dispatch({ type: 'both' })
    }
}

