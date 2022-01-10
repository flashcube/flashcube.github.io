import { Settings } from '../components/Settings';

const stickers = ['y', 'g', 'b', 'o', 'r', 'w', 'x'] as const;
export type Sticker = typeof stickers[number];

export function validateColorSetting(color: Settings['color']): boolean {
  return Object.values(color).every(value => validateColor(value));
}

export function validateColor(color: string): boolean {
  return /^#[0-9a-fA-F]+$|^[a-zA-Z]+$/.test(color);
}
