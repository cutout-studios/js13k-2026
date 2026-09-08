import { _ } from "~/alias";
import { ActionSchedule, createActionSequencer } from "~/clock";
import { createRoll } from "../actions.ts";
import { Ship } from "./types.ts";

export const createSpinSequence = (
  [, , , originalSequence, , _snapshot]: Ship,
) => {
  const totalTime = _snapshot[15],
    roll = createRoll(1, (x: number) => x * x * (3 - 2 * x));

  return createActionSequencer([
    [([object, , , , resources], t, e, d) => {
      roll(object, t, e, d);
      resources[4] = 1;
    }, totalTime],
    [
      (ship) => {
        ship[3] = originalSequence;
        ship[4][4] = 0;
      },
    ],
  ] as ActionSchedule<Ship>, 1);
};
