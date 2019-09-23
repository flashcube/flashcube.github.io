export const Sticker = {
    values: ['y', 'g', 'b', 'o', 'r', 'w', 'x'] as const
};
export type Sticker = typeof Sticker.values[number];

export const Face = {
    values: ['u', 'b', 'r', 'f', 'l', 'd'] as const
};
export type Face = typeof Face.values[number];
