import { Settings } from '../components/Settings';

export function validateColorSetting(color: Settings['color']): boolean {
  return Object.values(color).every(value => validateColor(value));
}
export function validateColor(color: string): boolean {
  return /^#[0-9a-fA-F]+$|^[a-zA-Z]+$/.test(color);
}
