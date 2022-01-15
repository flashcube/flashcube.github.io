import { center, Cube, FaceCells, posMod4 } from './cube';

describe('Cube', () => {
  describe('Cube#direct', () => {
    const initial = new Cube();
    test('d is u', async () => {
      expect(initial.direct('u').view(cs => center(cs))).toStrictEqual({
        u: 'd',
        f: 'b',
        r: 'r',
        b: 'f',
        l: 'l',
        d: 'u',
      });
    });
    test('d is f', async () => {
      expect(initial.direct('f').view(cs => center(cs))).toStrictEqual({
        u: 'b',
        f: 'u',
        r: 'r',
        b: 'd',
        l: 'l',
        d: 'f',
      });
    });
    test('d is r', async () => {
      expect(initial.direct('r').view(cs => center(cs))).toStrictEqual({
        u: 'l',
        f: 'f',
        r: 'u',
        b: 'b',
        l: 'd',
        d: 'r',
      });
    });
    test('d is b', async () => {
      expect(initial.direct('b').view(cs => center(cs))).toStrictEqual({
        u: 'f',
        f: 'd',
        r: 'r',
        b: 'u',
        l: 'l',
        d: 'b',
      });
    });
    test('d is l', async () => {
      expect(initial.direct('l').view(cs => center(cs))).toStrictEqual({
        u: 'r',
        f: 'f',
        r: 'd',
        b: 'b',
        l: 'u',
        d: 'l',
      });
    });
    test('d is d', async () => {
      expect(initial.direct('d').view(cs => center(cs))).toStrictEqual({
        u: 'u',
        f: 'f',
        r: 'r',
        b: 'b',
        l: 'l',
        d: 'd',
      });
    });
  });

  const marked = new Cube({
    u: [
      'u1',
      'u2',
      'u3',
      'u4',
      'u5',
      'u6',
      'u7',
      'u8',
      'u9',
    ] as unknown as FaceCells,
    f: [
      'f1',
      'f2',
      'f3',
      'f4',
      'f5',
      'f6',
      'f7',
      'f8',
      'f9',
    ] as unknown as FaceCells,
    r: [
      'r1',
      'r2',
      'r3',
      'r4',
      'r5',
      'r6',
      'r7',
      'r8',
      'r9',
    ] as unknown as FaceCells,
    b: [
      'b1',
      'b2',
      'b3',
      'b4',
      'b5',
      'b6',
      'b7',
      'b8',
      'b9',
    ] as unknown as FaceCells,
    l: [
      'l1',
      'l2',
      'l3',
      'l4',
      'l5',
      'l6',
      'l7',
      'l8',
      'l9',
    ] as unknown as FaceCells,
    d: [
      'd1',
      'd2',
      'd3',
      'd4',
      'd5',
      'd6',
      'd7',
      'd8',
      'd9',
    ] as unknown as FaceCells,
  });
  describe('Cube#x', () => {
    test('n=0', async () => {
      expect(marked.x(0).state()).toStrictEqual({
        u: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9'],
        f: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9'],
        r: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9'],
        b: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9'],
        l: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9'],
        d: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9'],
      });
    });
    test('n=1', async () => {
      expect(marked.x().state()).toStrictEqual({
        u: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9'],
        f: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9'],
        r: ['r7', 'r4', 'r1', 'r8', 'r5', 'r2', 'r9', 'r6', 'r3'],
        b: ['u9', 'u8', 'u7', 'u6', 'u5', 'u4', 'u3', 'u2', 'u1'],
        l: ['l3', 'l6', 'l9', 'l2', 'l5', 'l8', 'l1', 'l4', 'l7'],
        d: ['b9', 'b8', 'b7', 'b6', 'b5', 'b4', 'b3', 'b2', 'b1'],
      });
    });
    test('n=2', async () => {
      expect(marked.x(2).state()).toStrictEqual(marked.x().x().state());
    });
    test('n=3', async () => {
      expect(marked.x(3).state()).toStrictEqual(marked.x().x().x().state());
      expect(marked.x(3).state()).toStrictEqual(marked.x(-1).state());
    });
  });

  describe('Cube#y', () => {
    test('n=0', async () => {
      expect(marked.y(0).state()).toStrictEqual({
        u: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9'],
        f: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9'],
        r: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9'],
        b: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9'],
        l: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9'],
        d: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9'],
      });
    });
    test('n=1', async () => {
      expect(marked.y().state()).toStrictEqual({
        u: ['u7', 'u4', 'u1', 'u8', 'u5', 'u2', 'u9', 'u6', 'u3'],
        f: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9'],
        r: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9'],
        b: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9'],
        l: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9'],
        d: ['d3', 'd6', 'd9', 'd2', 'd5', 'd8', 'd1', 'd4', 'd7'],
      });
    });
    test('n=2', async () => {
      expect(marked.y(2).state()).toStrictEqual(marked.y().y().state());
    });
    test('n=3', async () => {
      expect(marked.y(3).state()).toStrictEqual(marked.y().y().y().state());
      expect(marked.y(3).state()).toStrictEqual(marked.y(-1).state());
    });
  });

  describe('Cube#z', () => {
    test('n=0', async () => {
      expect(marked.z(0).state()).toStrictEqual({
        u: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9'],
        f: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9'],
        r: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9'],
        b: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9'],
        l: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9'],
        d: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9'],
      });
    });
    test('n=1', async () => {
      expect(marked.z().state()).toStrictEqual({
        u: ['l7', 'l4', 'l1', 'l8', 'l5', 'l2', 'l9', 'l6', 'l3'],
        f: ['f7', 'f4', 'f1', 'f8', 'f5', 'f2', 'f9', 'f6', 'f3'],
        r: ['u7', 'u4', 'u1', 'u8', 'u5', 'u2', 'u9', 'u6', 'u3'],
        b: ['b3', 'b6', 'b9', 'b2', 'b5', 'b8', 'b1', 'b4', 'b7'],
        l: ['d7', 'd4', 'd1', 'd8', 'd5', 'd2', 'd9', 'd6', 'd3'],
        d: ['r7', 'r4', 'r1', 'r8', 'r5', 'r2', 'r9', 'r6', 'r3'],
      });
    });
    test('n=2', async () => {
      expect(marked.z(2).state()).toStrictEqual(marked.z().z().state());
    });
    test('n=3', async () => {
      expect(marked.z(3).state()).toStrictEqual(marked.z().z().z().state());
      expect(marked.z(3).state()).toStrictEqual(marked.z(-1).state());
    });
  });
});

test('posMod4', async () => {
  expect(posMod4(-4)).toBe(0);
  expect(posMod4(-3)).toBe(1);
  expect(posMod4(-2)).toBe(2);
  expect(posMod4(-1)).toBe(3);
  expect(posMod4(0)).toBe(0);
  expect(posMod4(1)).toBe(1);
  expect(posMod4(2)).toBe(2);
  expect(posMod4(3)).toBe(3);
  expect(posMod4(4)).toBe(0);
});
