import deepmerge from 'deepmerge';

const overwriteMerge = (dest: any[], src: any[]) => src;

export function deepMerge<T1, T2>(
  x: Partial<T1>,
  y: Partial<T2>,
  options?: deepmerge.Options
): T1 & T2 {
  return deepmerge(x, y, options || { arrayMerge: overwriteMerge });
}

export function identity<A>(a: A): A {
  return a;
}

export function times(n: number): number[] {
  return Array.from(Array(n), (_, k) => k);
}

export function rotate<T>(xs: readonly T[], n: number = 1): T[] {
  return times(n).reduce(
    acc => {
      const [head, ...tail] = acc;
      return [...tail, head];
    },
    [...xs]
  );
}
