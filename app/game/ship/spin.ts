import { TAU } from "~/alias";
import { ActionSchedule, createActionSequencer } from "~/clock";
import { Ship } from "./types.ts";

const RECOVERY_TIME = 0.2;

// "back ease out" - overshoots past 1 before settling exactly at 1, so the
// ship spins a little further than a full turn, then springs back
const overshoot = (x: number) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2;

export const createSpinSequence = (
  [, , , originalSequence, , _snapshot]: Ship,
  direction: 1 | -1 = 1,
) => {
  const totalTime = _snapshot[15];

  return createActionSequencer([
    // actively countering - reflects hits, can't be re-triggered
    [([, , , , resources], _t, e, d) => {
      resources[6] = overshoot(e / d) * direction * TAU;
      resources[4] = 1;
    }, totalTime],
    // recovering - no longer reflecting, but still can't spin again yet
    [([, , , , resources]) => {
      resources[4] = 0;
      resources[5] = 1;
    }, RECOVERY_TIME],
    [
      (ship) => {
        ship[3] = originalSequence;
        ship[4][5] = 0;
        ship[4][6] = 0;
      },
    ],
  ] as ActionSchedule<Ship>, 1);
};
