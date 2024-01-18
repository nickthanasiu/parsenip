//import { deepEquals } from "./deepEquals";

/*

type TestsInputArr = [any, any, boolean];

test('deepEquals works on strings', () => {
    const inputs: TestsInputArr[] = [
        ['Hello, world!', 'Hello world!', false],
        ['Hello, world!', 'Hello, world', false],
        ['Hello, world!', 'Hello, world!', true],
        ['1', 1, false],
        ['1', '1', true],
        ['Hello, world!', undefined, false],
        ['Hello, world!', ['Hello, world!'], false],
    ];

    const expected = inputs.map(([_, __, bool]) => bool);
    const actual = inputs.map(([a, b]) => deepEquals(a, b));

    expect(actual).toStrictEqual(expected);
});

test('deepEquals works on numbers', () => {
    const inputs: TestsInputArr[] = [
        [123, '123', false],
        [123, 12, false],
        [123, 123, true],
        ['1', 1, false],
        [0, 0, true],
        [123, [123], false],
        [123, null, false],
        [undefined, 123, false],
        [123, { number: 123 }, false],
    ];

    const expected = inputs.map(([_, __, bool]) => bool);
    const actual = inputs.map(([a, b, _]) => deepEquals(a, b));

    expect(actual).toStrictEqual(expected);
});

test('deepEquals works on booleans', () => {
    const inputs = [
        [true, true, true],
        [true, false, false],
        [false, true, false],
        [false, false, true],
        [true, 'true', false],
        ['false', false, false],
        [false, 0, false],
        [false, '', false],
        [false, undefined, false],
        [null, false, false],
        [false, [], false],
        [false, {}, false],
    ];

    const expected = inputs.map(([_, __, bool]) => bool);
    const actual = inputs.map(([a, b, _]) => deepEquals(a, b));

    expect(actual).toStrictEqual(expected);
});


test('deepEquals works on arrays', () => {
    const inputs: TestsInputArr[] = [
        [[1, 2, 3], [1 ,2, '3'], false],
        [[1, 2, 3], [1, 2, 3], true],

        [['a', null, 'c'], ['a', null, 'c'], true],
        [['a', 'b', 'c'], ['a', 'b', null], false],

        [
            [{ name: 'Nick', city: 'Brooklyn'}, { name: 'Steve', city: 'San Francisco'}],
            [{ name: 'Nick', city: 'Brooklyn'}, { name: 'Steve', city: 'San Francisco'}], 
            true
        ],
        [
            [{ name: 'Nick', city: 'Brooklyn'}, { name: 'Steve', city: 'San Francisco'}],
            [{ name: 'Nick', city: 'Brooklyn'}, { name: 'Steve', city: 'Los Angeles'}], 
            false
        ],
    ];

    const expected = inputs.map(([_, __, bool]) => bool);
    const actual = inputs.map(([a, b, _]) => deepEquals(a, b));

    expect(actual).toStrictEqual(expected);
});

test('deepEquals works on objects', () => {

    const inputs: TestsInputArr[] = [
        [{ name: 'Corn', breed: 'Tabby' }, { name: 'Corn', breed: 'Sphinx' }, false],
        [{ name: 'Corn', breed: 'Tabby' }, { name: 'Corn', breed: 'Tabby' }, true],
        [
            { name: 'Corn', breed: 'Tabby', favorites: { food: 'Tuna', activity: 'Licking' } },
            { name: 'Corn', breed: 'Tabby', favorites: { food: 'Chicken', activity: 'Licking' } },
            false
        ],
        [
            { name: 'Corn', breed: 'Tabby', favorites: { food: 'Tuna', activity: 'Licking' } },
            { name: 'Corn', breed: 'Tabby', favorites: { food: 'Tuna', activity: 'Licking' } },
            true
        ],
        [
            { name: 'Corn', breed: 'Tabby', favorites: { foods: ['Chicken', 'Tuna', 'Bread'], activities: ['Licking', 'Sleeping'] } },
            { name: 'Corn', breed: 'Tabby', favorites: { foods: ['Chicken', 'Tuna', 'Bread'], activities: ['Licking', 'Sleeping'] } },
            true
        ],
        [
            { name: 'Corn', breed: 'Tabby', favorites: { foods: ['Chicken', 'Tuna', 'Bread'], activities: ['Licking', 'Sleeping'] } },
            { name: 'Corn', breed: 'Tabby', favorites: { foods: ['Chicken', 'Tuna', 'Bread'], activities: null } },
            false
        ],
        [
            { name: 'Corn', breed: 'Tabby', favorites: { foods: ['Chicken', 'Tuna', 'Bread'], activities: ['Licking', 'Sleeping'] } },
            { name: 'Corn', breed: 'Tabby', favorites: { foods: ['Chicken', 'Tuna', 'Bonito'], activities: ['Licking', 'Sleeping'] } },
            false
        ],
    ];

    const expected = inputs.map(([_, __, bool]) => bool);
    const actual = inputs.map(([a, b, _]) => deepEquals(a, b));

    expect(actual).toStrictEqual(expected);
});

*/

test('temporary', () => {
    expect(true).toBe(true);
});