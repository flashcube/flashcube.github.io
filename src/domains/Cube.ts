import { rotate, times } from '../Util';

const stickers = ['y', 'g', 'b', 'o', 'r', 'w', 'x'] as const;
export type Sticker = typeof stickers[number];

export const sideFaces = ['f', 'r', 'b', 'l'] as const;
export type SideFace = typeof sideFaces[number];
export const faces = ['u', ...sideFaces, 'd'] as const;
export type Face = typeof faces[number];

export type LastLayerState = { [f in SideFace]: SideFace[] };
export class LastLayer {
  private expression: SideFace[];
  constructor(flattenExp: string[]) {
    this.expression = this.assertLlStates(flattenExp);
  }

  pattern(turns: 0 | 1 | 2 | 3): LastLayer {
    const rotated = rotate(sideFaces, turns);
    const map = sideFaces.reduce(
      (acc, _, idx) => ({
        ...acc,
        [sideFaces[idx]]: rotated[idx],
      }),
      {} as { [face in SideFace]: SideFace }
    );
    return new LastLayer(this.expression.map(f => map[f]));
  }

  rotate(turns: 0 | 1 | 2 | 3): LastLayer {
    const newExp = times(turns).reduce(acc => {
      const [_1, _2, _3, ...tail] = acc;
      return [...tail, _1, _2, _3];
    }, this.expression);
    return new LastLayer(newExp);
  }

  state(): LastLayerState {
    return {
      f: this.expression.slice(0, 3),
      r: this.expression.slice(3, 6),
      b: this.expression.slice(6, 9),
      l: this.expression.slice(9),
    };
  }

  private assertLlStates(fs: string[]): SideFace[] {
    if (
      fs.length === 12 &&
      fs.every(f => (sideFaces as readonly string[]).includes(f))
    )
      return fs as SideFace[];
    else throw new Error('AssertError');
  }
}
