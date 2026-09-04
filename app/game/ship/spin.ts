import { createCoordinates, setOrigin, XYZ } from "~/3D";
import { _ } from "~/alias";
import { getPanFromCoordinates } from "~/audio";
import { ActionSchedule, createActionSequencer } from "~/clock";
import { createPull, createRoll } from "../actions.ts";
import { Ship } from "./types.ts";

const smoothstep = (x: number) => x * x * (3 - 2 * x);

export const createSpinSequence = (
  [, , , originalSequence, , _snapshot]: Ship,
  direction: XYZ,
) => {
  const totalTime = _snapshot[19],
    spinSign =
      (getPanFromCoordinates(setOrigin(createCoordinates(), direction), 1) > 0)
        ? 1
        : -1,
    rollPull = createPull(
      direction,
      0.1,
      smoothstep,
    ),
    roll = createRoll(1.2 * spinSign, smoothstep),
    rollRecovery = createRoll(-.2 * spinSign, smoothstep),
    rollTime = totalTime * (1.2 / 1.4),
    rollRecoveryTime = totalTime * (.2 / 1.4);

  return createActionSequencer([
    [([object, , , , resources], t, e, d) => {
      rollPull(object, t, e, totalTime);
      roll(object, t, e, d);
      resources[6] = 1;
    }, rollTime],
    [([object, , , , resources], t, e, d) => {
      rollPull(object, t, e + rollTime, totalTime);
      rollRecovery(object, t, e, d);
      resources[6] = 0;
    }, rollRecoveryTime],
    [
      (ship) => ship[3] = originalSequence,
    ],
  ] as ActionSchedule<Ship>, 1);
};
