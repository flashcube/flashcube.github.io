export const stickers = {
  values: ['y', 'g', 'b', 'o', 'r', 'w', 'x'],
} as const;
export type Sticker = typeof stickers.values[number];

export const faces = {
  values: ['u', 'b', 'r', 'f', 'l', 'd'],
} as const;
export type Face = typeof faces.values[number];
