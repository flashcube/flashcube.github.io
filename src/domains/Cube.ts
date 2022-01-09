const stickers = ['y', 'g', 'b', 'o', 'r', 'w', 'x'] as const;
export type Sticker = typeof stickers[number];

export const faces = ['u', 'b', 'r', 'f', 'l', 'd'] as const;
export type Face = typeof faces[number];
