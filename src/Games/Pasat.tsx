import { useReducer } from "react";
import { useKeyboard } from "../Devices/keyboard";
import { useSound } from "../Devices/sound";
import { useTimer } from "../Devices/timer";
import { last } from "../utils";
import { Submission } from "./game";

type PasatState = {
  n: number;
  stack: number[];
  time: number;
  complete: boolean;
  submission: Submission<number> | null;
  submissions: Submission<number>[];
};

type PasatTick = {
  type: "pasat/tick";
  time: number;
  n?: number;
};

type PasatSubmission = {
  type: "pasat/submission";
  value: number;
  partial: boolean;
  time: number;
};

type PasatAction = PasatTick | PasatSubmission;

function addLastN(n: number, xs: number[]) {
  return xs.slice(-n).reduce((a, b) => a + b, 0);
}

export function pasatReducer(
  state: PasatState,
  action: PasatAction
): PasatState {
  switch (action.type) {
    case "pasat/submission":
      if (state.submission) {
        return state;
      }

      const { value } = action;
      console.log({
        state,
        value,
        sum: addLastN(state.n, state.stack)
      });

      return {
        ...state,
        submission: {
          value,
          time: action.time - state.time,
          correct: (addLastN(state.n, state.stack) % 10) === +value,
        },
      };
    case "pasat/tick":
      const submissions =
        state.n > state.stack.length
          ? state.submissions
          : [
              ...state.submissions,
              {
                ...(state?.submission || { time: 0, value: 0, correct: false }),
              },
            ];

      return {
        ...state,
        n: action?.n || state.n,
        time: action.time,
        stack: [...state.stack, Math.floor(Math.random() * 9) + 1],
        submissions,
        submission: null,
      };
  }
}

export function pasatInitialState(n: number): PasatState {
  return {
    n,
    stack: [],
    time: 0,
    submission: null,
    submissions: [],
    complete: false,
  };
}

export type PasatProps = {
  timer: number;
  game: PasatState;
  dispatch: React.Dispatch<PasatAction>;
};

export function Pasat({ timer, game, dispatch }: PasatProps) {
  useKeyboard((x) => {
    if (x.match(/[0123456789]/)) {
      dispatch({
        type: "pasat/submission",
        value: parseInt(x),
        partial: true,
        time: +Date.now(),
      });
    }
  });

  useTimer(() => {
    dispatch({
      type: "pasat/tick",
      time: +Date.now(),
    });
  }, timer);

  return <View game={game} />;
}

export function View({ game: g }: { game: PasatState }) {
  const value = last(g.stack);

  useSound(`${value}`, [g.time]);

  const color = g.submission === null 
    ? "black"
    : g.submission?.correct 
        ? "green"
        : "red"

  return (
    <div style={{flexGrow:1, border: `solid 2px ${color}`}}>
      <h1>PASAT N={g.n}</h1>
    </div>
  );
}
