import { rotate, times } from '../../Util';

export const sideFaces = ['f', 'r', 'b', 'l'] as const;
export type SideFace = typeof sideFaces[number];

export const faces = ['u', ...sideFaces, 'd'] as const;
export type Face = typeof faces[number];

export type LastLayerState = { [f in SideFace]: SideFace[] };

export class LastLayer {
  // [F,F,F,R,R,R,B,B,B,L,L,L]
  private readonly data: SideFace[];

  // [F,F,F,R,R,R,B,B,B,L,L,L]
  constructor(flattenExp: string[]) {
    this.data = this.validate(flattenExp);
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
    return new LastLayer(this.data.map(f => map[f]));
  }

  rotate(turns: 0 | 1 | 2 | 3): LastLayer {
    const newExp = times(turns).reduce(acc => {
      const [_1, _2, _3, ...tail] = acc;
      return [...tail, _1, _2, _3];
    }, this.data);
    return new LastLayer(newExp);
  }

  state(): LastLayerState {
    return {
      f: this.data.slice(0, 3),
      r: this.data.slice(3, 6),
      b: this.data.slice(6, 9),
      l: this.data.slice(9),
    };
  }

  private validate(fs: string[]): SideFace[] {
    if (
      fs.length === 12 &&
      fs.every(f => (sideFaces as readonly string[]).includes(f))
    )
      return fs as SideFace[];
    else throw new Error('AssertError');
  }
}
