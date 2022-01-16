import { entries, repeat, rotate, times } from '../../Util';

const cells = ['u', 'f', 'r', 'b', 'l', 'd'] as const;
type Cell = typeof cells[number];
export namespace CellValues {
  export const [u, f, r, b, l, d] = cells;
}

export const sideFaces = ['f', 'r', 'b', 'l'] as const;
export type SideFace = typeof sideFaces[number];

export const faces = ['u', ...sideFaces, 'd'] as const;
export type Face = typeof faces[number];

export type PllState = { [f in SideFace]: SideFace[] };

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

  state(): PllState {
    return sideFaces.reduce(
      (acc, face, index) => ({
        ...acc,
        [face]: this.data[index],
      }),
      {} as PllState
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

export type FaceCells = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

export function center(cells: FaceCells): Cell {
  return cells[4];
}

function clockwise(fcs: FaceCells, n: number = 1): FaceCells {
  return times(posMod4(n)).reduce(
    acc => [6, 3, 0, 7, 4, 1, 8, 5, 2].map(c => acc[c]) as FaceCells,
    fcs
  );
}

export class Cube {
  constructor(
    private readonly data = {
      u: repeat(CellValues.u, 9) as FaceCells,
      f: repeat(CellValues.f, 9) as FaceCells,
      r: repeat(CellValues.r, 9) as FaceCells,
      b: repeat(CellValues.b, 9) as FaceCells,
      l: repeat(CellValues.l, 9) as FaceCells,
      d: repeat(CellValues.d, 9) as FaceCells,
    }
  ) {}

  direct(d: Face): Cube {
    switch (d) {
      case center(this.data.u):
        return this.x(2);
      case center(this.data.f):
        return this.x(-1);
      case center(this.data.r):
        return this.z();
      case center(this.data.b):
        return this.x();
      case center(this.data.l):
        return this.z(-1);
      case center(this.data.d):
        return this;
      default:
        throw new Error(`Invalid state: ${JSON.stringify(this.data)}`);
    }
  }

  x(n: number = 1): Cube {
    return new Cube(
      times(posMod4(n)).reduce(
        acc => ({
          u: acc.f,
          f: acc.d,
          r: clockwise(acc.r),
          b: clockwise(acc.u, 2),
          l: clockwise(acc.l, -1),
          d: clockwise(acc.b, 2),
        }),
        { ...this.data }
      )
    );
  }

  y(n: number = 1): Cube {
    return new Cube(
      times(posMod4(n)).reduce(
        acc => ({
          u: clockwise(acc.u),
          f: acc.r,
          r: acc.b,
          b: acc.l,
          l: acc.f,
          d: clockwise(acc.d, -1),
        }),
        { ...this.data }
      )
    );
  }

  z(n: number = 1): Cube {
    return new Cube(
      times(posMod4(n)).reduce(
        acc => ({
          u: clockwise(acc.l),
          f: clockwise(acc.f),
          r: clockwise(acc.u),
          b: clockwise(acc.b, -1),
          l: clockwise(acc.d),
          d: clockwise(acc.r),
        }),
        { ...this.data }
      )
    );
  }

  applyPll(pll: PllState): Cube {
    if (!this.solved()) {
      throw new Error(`Invalid state ${this.data}`);
    }
    const data = entries(pll).reduce(
      (acc, [face, cells]) => ({
        ...acc,
        [face]: [
          ...cells.map(c => center(this.data[c])),
          ...acc[face].slice(3),
        ],
      }),
      { ...this.data }
    );
    return new Cube(data);
  }

  solved(): boolean {
    return Object.values(this.data).every(cells => new Set(cells).size === 1);
  }

  state() {
    return this.data;
  }

  view<T>(map: (cs: FaceCells) => T): { [f in Face]: T } {
    return entries(this.data).reduce(
      (acc, [face, cells]) => ({ ...acc, [face]: map(cells) }),
      {} as { [f in Face]: T }
    );
  }
}

export function posMod4(i: number): 0 | 1 | 2 | 3 {
  return (((i % 4) + 4) % 4) as 0 | 1 | 2 | 3;
}
