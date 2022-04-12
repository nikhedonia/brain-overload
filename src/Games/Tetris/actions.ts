import { count } from "../../utils";
import { collisionMap } from "./collision-map";
import { OrientedPiece, Vec } from "./pieces";

export const rotateRight = (p: OrientedPiece) => {
  const d = p.b.length;
  return {
    ...p,
    r: (p.r + 1) % 4,
    b: [...count(d)].map((y) => [...count(d)].map((x) => p.b[d - x - 1][y])),
  };
};

export const move = (p: OrientedPiece, { x, y }: Vec) => ({
  ...p,
  x: p.x + x,
  y: p.y + y,
});

export const tryRotateRight = (board: number[][], p: OrientedPiece) => {
  const d = p.b.length;

  if (d < 3 || d > 4) {
    return p;
  }

  const next = (p.r + 1) % 4;

  const tests = collisionMap[`${d}${p.r}${next}`];

  const rotated = rotateRight(p);

  const offset = tests.find((dx: Vec) => !hasOverlap(board, move(rotated, dx)));
  if (offset) {
    return move(rotated, offset);
  }
  return p;
};

export const hasOverlap = (board: number[][], piece: OrientedPiece) =>
  piece.b
    .flatMap((row, y) => row.map((cell, x) => [cell, x + piece.x, y + piece.y]))
    .filter(([c]) => c)
    .find(
      ([_, x, y]) => !board[y] || board[y][x] > 0 || board[y][x] === undefined
    );

const asShadow = (piece: OrientedPiece) => ({
  ...piece,
  b: piece.b.map((r) => r.map((c) => +!!c * 8)),
});

export const findShadow = (
  board: number[][],
  piece: OrientedPiece
): OrientedPiece => {
  const overlapped = hasOverlap(board, piece);
  if (overlapped) {
    return asShadow({
      ...piece,
      y: piece.y - 1,
    });
  }
  return findShadow(board, { ...piece, y: piece.y + 1 });
};

export const eliminate = (
  board: number[][]
): { removed: Set<number>; board: number[][] } => {
  const toRemove = new Set(
    board
      .map((row, y) => {
        if (row.find((x) => !x) === undefined) {
          return y;
        }
        return null;
      })
      .filter((x) => x !== null)
  ) as Set<number>;

  return {
    removed: toRemove,
    board: [
      ...count(toRemove.size).map((_) =>
        [...count(board[0].length)].map((_) => 0)
      ),
      ...board.filter((_, i) => !toRemove.has(i)),
    ],
  };
};

export const extractPiece = (piece: OrientedPiece, x: number, y: number) => {
  const i = x - piece.x;
  const j = y - piece.y;
  return (piece.b[j] || [])[i] || 0;
};

export const merge = (board: number[][], pieces: (OrientedPiece | null)[]) => [
  ...count(22).map((y) =>
    [...count(10)].map((x) =>
      pieces
        .filter((p) => p)
        .map((piece) => extractPiece(piece!, x, y))
        .reduce((a, b) => a || b, board[y][x])
    )
  ),
];
