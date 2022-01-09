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
