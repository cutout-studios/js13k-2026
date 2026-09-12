import { TAU } from "~/alias";
import { ActionSchedule, createActionSequencer } from "~/clock";
import { Ship } from "./types.ts";

export const createSpinSequence = (
  [, , , originalSequence, , _snapshot]: Ship,
  direction: 1 | -1 = 1,
) => createActionSequencer([
    // actively countering - reflects hits, can't be re-triggered
    [([, , , , resources], _t, e, d) => {
      resources[6] = (1 + 2.7 * ((e / d) - 1) ** 3 + 1.7 * ((e / d) - 1) ** 2) *
        direction * TAU;
      resources[4] = 1;
    }, _snapshot[15]],
    // recovering - no longer reflecting, but still can't spin again yet
    [([, , , , resources]) => {
      resources[4] = 0;
      resources[5] = 1;
    }, 0.2],
    [
      (ship) => {
        ship[3] = originalSequence;
        ship[4][5] = 0;
        ship[4][6] = 0;
      },
    ],
  ] as ActionSchedule<Ship>, 1);