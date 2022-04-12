import { count } from "../utils";
import seedRandom from "seedrandom";

type RandomState = [string, unknown];

export const createSeed = (seed: string): [string, unknown] => {
  return [seed, true];
};

export function randInt([seed, state]: RandomState): [RandomState, number] {
  const rng = seedRandom(seed, {
    state: state as boolean,
  });
  const value = rng.int32();
  const nextState = rng.state();
  return [[seed, nextState], value];
}

export function randFloat([seed, state]: RandomState): [RandomState, number] {
  const rng = seedRandom(seed, {
    state: state as boolean,
  });
  const value = rng.quick();
  const nextState = rng.state();
  return [[seed, nextState], value];
}

export function randIntArray(
  [seed, state]: RandomState,
  n: number
): [RandomState, number[]] {
  const rng = seedRandom(seed, {
    state: state as boolean,
  });

  const value = count(n).map(() => rng.int32());
  const nextState = rng.state();
  return [[seed, nextState], value];
}
