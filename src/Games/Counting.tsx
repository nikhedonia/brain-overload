import React, { useMemo } from "react";
import { useKeyboard } from "../Devices/keyboard";
import { Submission } from "./game";
import { last } from "../utils";
import { useTimer } from "../Devices/timer";

function* count() {
  let i = 0;
  while (true) {
    yield i;
    ++i;
  }
}

function* generatePoints(maxX = 10, maxY = 10) {
  for (const _ of count()) {
    const x = Math.ceil(Math.random() * maxX);
    const y = Math.ceil(Math.random() * maxY);
    yield { x, y };
  }
}

function* generateUniquePoints(maxX = 10, maxY = 10) {
  let points = new Set<string>([]);
  for (const p of generatePoints(maxX, maxY)) {
    const str = p.x + "|" + p.y;
    if (!points.has(str)) yield p;
    points.add(str);
  }
}

function* take<T>(n: number, seq: Iterable<T>) {
  for (const x of seq) {
    if (!n) return;
    yield x;
    --n;
  }
}

export type CountingState = {
  min: number;
  max: number;
  stack: number[];
  time: number;
  complete: boolean;
  submission: Submission<number> | null;
  submissions: Submission<number>[];
};

type CountingTick = {
  type: "counting/tick";
  time: number;
  max?: number;
};

type CountingSubmission = {
  type: "counting/submission";
  value: number;
  partial: boolean;
  time: number;
};

export type CountingAction = CountingTick | CountingSubmission;

export function countingReducer(
  state: CountingState,
  action: CountingAction
): CountingState {
  switch (action.type) {
    case "counting/submission":
      if (state.submission) {
        return state;
      }

      const value = action.value;

      return {
        ...state,
        submission: {
          value,
          time: action.time - state.time,
          correct: (last(state.stack) || 0) % 10 === value,
        },
      };
    case "counting/tick":
      const submissions = state.stack.length
        ? [
            ...state.submissions,
            {
              ...(state?.submission || { time: 0, value: 0, correct: false }),
            },
          ]
        : [];

      return {
        ...state,
        max: action.max || state.max,
        time: action.time,
        stack: [
          ...state.stack,
          Math.floor(Math.random() * (state.max - state.min)) + state.min,
        ],
        submissions,
        submission: null,
      };
  }
}

export function countingInitialState(min: number, max: number): CountingState {
  return {
    min,
    max,
    stack: [],
    time: 0,
    submission: null,
    submissions: [],
    complete: false,
  };
}

export type CountingGameProps = {
  timer: number;
  game: CountingState;
  dispatch: React.Dispatch<CountingAction>;
};

export function CountingGame({ timer, game, dispatch }: CountingGameProps) {
  useTimer(() => {
    dispatch({
      type: "counting/tick",
      time: +Date.now(),
    });
  }, timer);

  useKeyboard((c: string) => {
    if (c.match(/[0123456789]/)) {
      dispatch({
        type: "counting/submission",
        partial: game.max > 9,
        value: parseInt(c),
        time: +Date.now(),
      });
    }
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "stretch",
      }}
    >
      <View game={game} />
    </div>
  );
}

export function View({ game }: { game: CountingState }) {
  const n = last(game.stack) || 0;

  // memoize random generation to ensure configuration doesn't change between renders
  const points = useMemo(
    () => [...take(n, generateUniquePoints(10, 10))],
    [game.time, n]
  );

  const color = !game?.submission?.value
    ? "black"
    : game.submission.correct
    ? "green"
    : "red";

  return (
    <svg
      viewBox="-20 -20 130 130"
      style={{
        width: "100%",
        aspectRatio: "1/1",
        border: `solid 3px ${color}`,
      }}
    >
      {points.map((p, i) => (
        <circle key={i} cx={p.x * 10} cy={p.y * 10} r={4} />
      ))}
    </svg>
  );
}
