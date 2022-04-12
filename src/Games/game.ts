export type Submission<T> = {
  value: T;
  time: number;
  correct?: boolean;
};

export type Score = {
  score: number;
  total: number;
};

export type Game<T, S> = {
  next: () => void;
  score: () => Score;
  current: () => T;
  submitPartial: (x: S) => number;
  submit: (x: S) => void;
};
