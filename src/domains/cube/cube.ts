import { rotate } from '../../Util';

export const sideFaces = ['f', 'r', 'b', 'l'] as const;
export type SideFace = typeof sideFaces[number];

export const faces = ['u', ...sideFaces, 'd'] as const;
export type Face = typeof faces[number];

export type LastLayerState = { [f in SideFace]: SideFace[] };

export type Turn = 0 | 1 | 2 | 3;

export class LastLayer {
  // [
  //   [F, F, F],
  //   [R, R, R],
  //   [B, B, B],
  //   [L, L, L],
  // ]
  constructor(private readonly data: SideFace[][]) {}

  pattern(turns: Turn): LastLayer {
    const map = faceToFace(turns);
    return new LastLayer(this.data.map(cells => cells.map(c => map[c])));
  }

  rotate(turns: Turn): LastLayer {
    return new LastLayer(rotate(this.data, turns));
  }

  state(): LastLayerState {
    return sideFaces.reduce(
      (acc, face, index) => ({
        ...acc,
        [face]: this.data[index],
      }),
      {} as LastLayerState
    );
  }
}

// exp: [F,F,F,R,R,R,B,B,B,L,L,L]
export function parseLastLayerFromFlattenExp(exp: string[]): LastLayer {
  if (
    exp.length === 12 &&
    exp.every(f => (sideFaces as readonly string[]).includes(f))
  ) {
    return new LastLayer(
      [0, 3, 6, 9].map(index => exp.slice(index, index + 3) as SideFace[])
    );
  } else {
    throw new Error('AssertError');
  }
}

function faceToFace(turns: Turn) {
  const rotated = rotate(sideFaces, turns);
  return sideFaces.reduce(
    (acc, _, index) => ({
      ...acc,
      [sideFaces[index]]: rotated[index],
    }),
    {} as { [face in SideFace]: SideFace }
  );
}
