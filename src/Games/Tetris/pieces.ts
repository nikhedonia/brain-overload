export type Vec = {
  x: number;
  y: number;
};

export type OrientedPiece = Vec & {
  b: number[][];
  r: number;
};

const asPiece = (b: number[][], r = 0) => ({
  x: 4,
  y: 0,
  b,
  r,
});

export const I = asPiece(
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ],
  1
);

export const B = asPiece([
  [2, 2],
  [2, 2],
]);

export const T = asPiece([
  [0, 3, 0],
  [3, 3, 3],
  [0, 0, 0],
]);

export const S = asPiece([
  [0, 4, 4],
  [4, 4, 0],
  [0, 0, 0],
]);

export const Z = asPiece([
  [5, 5, 0],
  [0, 5, 5],
  [0, 0, 0],
]);

export const L = asPiece([
  [0, 0, 6],
  [6, 6, 6],
  [0, 0, 0],
]);

export const J = asPiece([
  [7, 0, 0],
  [7, 7, 7],
  [0, 0, 0],
]);
