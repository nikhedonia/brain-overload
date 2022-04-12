import { useEffect, useReducer, useRef } from "react";
import { useKeyboardAction } from "../../Devices/keyboard";
import { useTimer } from "../../Devices/timer";
import { Submission } from "../game";
import { modalities, NBackBoard } from "./Board";

type Modalities = {
  [k: string]: (string | number)[];
};

type NBackEntry = {
  [k: string]: string | number;
};

type NBackSubmission = Submission<Set<string>> & {
  wrong: string[]
  matched: string[]
  missing: string[]
};

export type NBackState = {
  n: number;
  p: number;
  modalities: Modalities;
  stack: NBackEntry[];
  time: number;
  submission: NBackSubmission | null;
  submissions: (NBackSubmission)[];
};

type NBackTick = {
  type: "nback/tick";
  time: number;
};

type NBackSubmissionAction = {
  type: "nback/submission";
  value: Set<string>;
  partial: boolean;
  time: number;
};

type NBackAction = NBackTick | NBackSubmissionAction;

function getNBacks(state: NBackState) {
  if (state.stack.length < state.n) return [];

  const candidates = Object.entries(state.stack.at(-1) || {});
  const previous = state.stack.at(-state.n-1) || {};

  return candidates.filter(([k, v]) => previous[k] === v).map(([k]) => k);
}

function validate(state: NBackState, submission: Set<string>) {
  const nbacks = getNBacks(state);
  const nBackSet = new Set(nbacks);
  const matches = nbacks.map((x) => [x, submission?.has(x)]);
  const matched = matches.filter(([_, hit]) => hit).map(([x]) => x) as string[];
  const missing = matches.filter(([_, hit]) => !hit).map(([x]) => x) as string[];
  const wrong = [...(submission || [])].filter(
    (x) => !nBackSet.has(x)
  ) as string[];

  return {
    matched,
    missing,
    wrong,
    correct: !missing.length && !wrong.length,
  };
}

function randomPick<T>(xs: T[]): T {
  return xs[Math.floor(Math.random() * xs.length)];
}

function nextItem(state: NBackState) {
  const potentialNBacks =
    state.stack.length >= state.n ? state.stack.at(-(state.n - 1))! : {};
  return Object.fromEntries(
    Object.entries(state.modalities).map(([k, options]) => [
      k,
      Math.random() < state.p
        ? potentialNBacks[k]
        : randomPick(options as string[]),
    ])
  );
}

export function nbackReducer(
  state: NBackState,
  action: NBackAction
): NBackState {
  switch (action.type) {
    case "nback/submission":

      if (state.stack.length <= state.n) {
        return state;
      }

      const value = new Set([...(state?.submission?.value || []), ...action.value]);

      return {
        ...state,
        submission: {
          value,
          time: state?.submission?.wrong.length ? state?.submission?.time : action.time - state.time,
          ...validate(state, value),
        },
      };
    case "nback/tick":
      const submissions =
        state.n <= state.stack.length
          ? [
              ...state.submissions,
              {
                ...(state?.submission || { time: 0, value: new Set() }),
                ...validate(state, state?.submission?.value || new Set<string>()),
              },
            ]
          : [];

      return {
        ...state,
        time: action.time,
        stack: [...state.stack, nextItem(state)],
        submissions,
        submission: null,
      };
  }
}

export function nbackInitialState(
  n: number,
  modalities: Modalities
): NBackState {
  return {
    n,
    p: 0.3,
    stack: [],
    time: 0,
    submission: null,
    submissions: [],
    modalities,
  };
}

const blink = (sel: string, color: string, duration = 100, iterations = 3) => {
  console.log(document.querySelector(sel));
  document
    .querySelector(sel)
    ?.animate(
      [{ background: "#eee" }, { background: color }, { background: "#eee" }],
      {
        duration,
        iterations,
      }
    );
};

const submit = (x: string): NBackAction => ({
  type: "nback/submission",
  partial: true,
  time: Date.now(),
  value: new Set([x]),
});

type NBackProps = {
  timer: number;
  game: NBackState;
  dispatch: React.Dispatch<NBackAction>;
};

export function NBack({ timer, game, dispatch }: NBackProps) {
  useTimer(() => dispatch({ type: "nback/tick", time: +Date.now() }), timer);

  const keyMap = {
    h: () => dispatch(submit("positions")),
    j: () => dispatch(submit("colors")),
    k: () => dispatch(submit("icons")),
    l: () => dispatch(submit("numbers")),
  };

  useKeyboardAction("keyup", keyMap);

  const submission = game.submissions.at(-1);

  useEffect(() => {
    [...(submission?.missing || []), ...(submission?.wrong || [])].forEach(
      (x) => {
        blink(`#${x}-btn`, "red");
      }
    );

    (submission?.matched || []).forEach((x) => {
      blink(`#${x}-btn`, "green", 200, 1);
    });
  }, [submission]);

  const colorOf = (name: string) =>
    game.submission?.value.has(name) ? "#ccc" : "inherit";

  return (
    <div
      style={{
        padding: '1em',
        width: "100%",
        flexGrow: 1,
        display: "grid",
        gridTemplateColumns: "2em 1fr 2em",
        gridTemplateRows: "2em 1fr 2em",
      }}
    >
      <div />
      <button
        onClick={keyMap["h"]}
        id="positions-btn"
        style={{
          background: colorOf("positions"),
          fontSize: "1.5em",
        }}
      >
        position (h)
      </button>
      <div />
      <button
        onClick={keyMap["k"]}
        id="icons-btn"
        style={{
          background: colorOf("icons"),
          writingMode: "vertical-lr",
          fontSize: "1.3em",
        }}
      >
        s y m b o l (k)
      </button>
      <NBackBoard game={game} />
      <button
        onClick={keyMap["j"]}
        id="colors-btn"
        style={{
          background: colorOf("colors"),
          writingMode: "vertical-lr",
          fontSize: "1.3em",
        }}
      >
        c o l o r s (j)
      </button>
      <div />
      <button
        onClick={keyMap["l"]}
        id="numbers-btn"
        style={{
          background: colorOf("numbers"),
          fontSize: "1.5em",
        }}
      >
        numbers (l)
      </button>
      <div />
    </div>
  );
}
