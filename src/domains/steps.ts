export const Pll = {
    values: ['Aa', 'Ab', 'E', 'F', 'Ga', 'Gb', 'Gc', 'Gd', 'H', 'Ja', 'Jb', 'Na', 'Nb', 'Ra', 'Rb', 'T', 'Ua', 'Ub', 'V', 'Y', 'Z'] as const
}
export type Pll = typeof Pll.values[number];
