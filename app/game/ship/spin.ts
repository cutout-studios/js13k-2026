import { _ } from "~/alias";
import { ActionSchedule, createActionSequencer } from "~/clock";
import { createRoll } from "../actions.ts";
import { Ship } from "./types.ts";

const smoothstep = (x: number) => x * x * (3 - 2 * x);

export const createSpinSequence = (
  [, , , originalSequence, , _snapshot]: Ship,
) => {
  const totalTime = _snapshot[19],
    roll = createRoll(1, smoothstep);

  return createActionSequencer([
    [([object, , , , resources], t, e, d) => {
      roll(object, t, e, d);
      resources[6] = 1;
    }, totalTime],
    [
      (ship) => {
        ship[3] = originalSequence;
        ship[4][6] = 0;
      },
    ],
  ] as ActionSchedule<Ship>, 1);
};
