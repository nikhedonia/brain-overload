export function count(n: number) {
  return Array.from({ length: n }).map((_, i) => i);
}

export function last<T>(xs: T[]): T | undefined {
  return xs.slice(-1)[0];
}
