import * as pieces from "./pieces";
import {
  eliminate,
  findShadow,
  hasOverlap,
  merge,
  move,
  tryRotateRight,
} from "./actions";
import { OrientedPiece, Vec } from "./pieces";
import { count } from "../../utils";

export const emptyBoard = count(22).map((y) => count(10).map((_) => 0));

export type TetrisState = {
  board: number[][];
  piece: OrientedPiece | null;
  lastAction: "start" | "tick" | "move" | "drop" | "rotate" | "punish";
  lines: number;
  over: boolean;
};

type TetrisTick = {
  type: "tetris/tick";
};

type TetrisDrop = {
  type: "tetris/drop";
};

type TetrisMove = {
  type: "tetris/move";
} & Vec;

type TetrisRotate = {
  type: "tetris/rotate";
};

type TetrisPunish = {
  type: "tetris/punish";
  lines: number;
};

type TetrisReset = {
  type: "tetris/reset";
};

export type TetrisAction =
  | TetrisTick
  | TetrisDrop
  | TetrisMove
  | TetrisRotate
  | TetrisPunish
  | TetrisReset;

export const tetrisReducer = (
  state: TetrisState,
  action: TetrisAction
): TetrisState => {
  if (action.type === "tetris/reset") {
    return tetrisInitialState();
  }

  if (state.over) {
    return state;
  }

  if (
    state.piece &&
    state.piece.y < 4 &&
    hasOverlap(state.board, state.piece)
  ) {
    return {
      ...state,
      over: true,
    };
  }

  if (!state.piece) {
    const piece = Object.values(pieces)[Math.floor(Math.random() * 7)];
    return {
      ...state,
      piece,
      lastAction: "tick",
    };
  }

  switch (action.type) {
    default:
    case "tetris/drop":
      const { y } = findShadow(state.board, state.piece);
      const { removed, board } = eliminate(
        merge(state.board, [{ ...state.piece, y }])
      );
      return {
        ...state,
        piece: Object.values(pieces)[Math.floor(Math.random() * 7)],
        board,
        lastAction: "tick",
        lines: state.lines + removed.size,
      };

    case "tetris/tick":
      const shadow = findShadow(state.board, state.piece);

      if (
        shadow.y == state.piece.y &&
        ["rotate", "move"].includes(state.lastAction)
      ) {
        return {
          ...state,
          lastAction: "tick",
        };
      }

      if (shadow.y <= state.piece.y) {
        const { removed, board } = eliminate(merge(state.board, [state.piece]));
        return {
          ...state,
          piece: Object.values(pieces)[Math.floor(Math.random() * 7)],
          board,
          lastAction: "tick",
          lines: state.lines + removed.size,
        };
      }

      return {
        ...state,
        lastAction: "tick",
        piece: move(state.piece, { x: 0, y: +1 }),
      };

    case "tetris/move":
      const next = move(state.piece, action);
      if (hasOverlap(state.board, next)) {
        return state;
      }

      return {
        ...state,
        piece: next,
        lastAction: "move",
      };

    case "tetris/rotate":
      const piece = tryRotateRight(state.board, state.piece);
      return {
        ...state,
        piece,
        lastAction: "rotate",
      };

    case "tetris/punish":
      return {
        ...state,
        board: [
          ...state.board.slice(action.lines),
          ...count(action.lines).map(() =>
            count(state.board[0].length).map(() => +(Math.random() > 0.2))
          ),
        ],
        lastAction: "punish",
      };
  }
};

export const tetrisInitialState = () =>
  ({
    board: emptyBoard,
    piece: null,
    lastAction: "tick",
    lines: 0,
  } as TetrisState);
