//import { deepEquals } from '../utils/deepEquals';
//import { parse } from './parser';

/*
test('compare programs', () => {

    const p1 = parse(`
    let x = 5;
    let y = 1;

    let add = fn(a, b) {
        return a + b;
    }

    add(x, y);
`)

    const p2 = parse(`
    let x = 5;
    let y = 1;

    let add = fn(a, b) {
        return a + b;
    }

    add(x, y);
`);

    expect(deepEquals(p1, p2)).toBe(true);
});
*/

test('temporary', () => {
    expect(true).toBe(true);
});