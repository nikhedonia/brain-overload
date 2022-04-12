import { Vec } from "./pieces";

// lookup table of collision tests to be performed when rotating.
// before we rotate a piece we need to check if rotation is possible
// if it is not we move the piece.
// the key is [dimension][currentOrientation][nextOrientation]
// where orientation is encoded as a number between 0 and 3
// Lookup table based on original nes game
export const collisionMap = {
  301: [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: +1 },
    { x: +0, y: -2 },
    { x: -1, y: -2 },
  ],
  310: [
    { x: 0, y: 0 },
    { x: +1, y: 0 },
    { x: +1, y: -1 },
    { x: +0, y: +2 },
    { x: +1, y: +2 },
  ],
  312: [
    { x: 0, y: 0 },
    { x: +1, y: 0 },
    { x: +1, y: -1 },
    { x: +0, y: +2 },
    { x: +1, y: +2 },
  ],
  321: [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: +1 },
    { x: +0, y: -2 },
    { x: -1, y: -2 },
  ],
  323: [
    { x: 0, y: 0 },
    { x: +1, y: 0 },
    { x: +1, y: +1 },
    { x: +0, y: -2 },
    { x: +1, y: -2 },
  ],
  332: [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: +0, y: +2 },
    { x: -1, y: +2 },
  ],
  330: [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: +0, y: +2 },
    { x: -1, y: +2 },
  ],
  303: [
    { x: 0, y: 0 },
    { x: +1, y: 0 },
    { x: +1, y: +1 },
    { x: +0, y: -2 },
    { x: +1, y: -2 },
  ],
  401: [
    { x: 0, y: 0 },
    { x: -2, y: 0 },
    { x: +1, y: +0 },
    { x: -2, y: -1 },
    { x: +1, y: +2 },
  ],
  410: [
    { x: 0, y: 0 },
    { x: +2, y: 0 },
    { x: -1, y: -0 },
    { x: +2, y: +1 },
    { x: -1, y: -2 },
  ],
  412: [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: +2, y: -0 },
    { x: -1, y: +2 },
    { x: +2, y: -1 },
  ],
  421: [
    { x: 0, y: 0 },
    { x: +1, y: 0 },
    { x: -2, y: +0 },
    { x: +1, y: -2 },
    { x: -2, y: +1 },
  ],
  423: [
    { x: 0, y: 0 },
    { x: +2, y: 0 },
    { x: -1, y: +0 },
    { x: +2, y: +1 },
    { x: -1, y: -2 },
  ],
  432: [
    { x: 0, y: 0 },
    { x: -2, y: 0 },
    { x: +1, y: -0 },
    { x: -2, y: -1 },
    { x: +1, y: +2 },
  ],
  430: [
    { x: 0, y: 0 },
    { x: +1, y: 0 },
    { x: -2, y: -0 },
    { x: +1, y: -2 },
    { x: -2, y: +1 },
  ],
  403: [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: +2, y: +0 },
    { x: -1, y: +2 },
    { x: +2, y: -1 },
  ],
} as { [k: string]: Vec[] };

// Example:
// 301 -> 3 dim, org turn right

// org position  -> right
//     .xx           .x.
//     xx.           .xx
//     ...           ..x

// with obstacle denoted as O, conflicted region denoted as C
//     org       (0,0)                  (-1,0)
//     .xx        .x.    resolution      x..
//     xxO  ->    .xC  -------------->   xxO
//     O.O        ..C    (shift left)    OxO
