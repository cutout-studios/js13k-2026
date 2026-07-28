import {
  createRotationTransform,
  createTranslationTransform,
  type ObjectTransform,
} from "~scenes";
import { SECONDS_TO_MS } from "~common";

export enum Command {
  MOVE_FORWARD,
  MOVE_BACKWARD,
  MOVE_LEFT,
  MOVE_RIGHT,
  LOOK_UP,
  LOOK_DOWN,
  LOOK_LEFT,
  LOOK_RIGHT,
}

export const COMMAND_KEYCODE_MAP: Record<string, Command> = {
  // NOTE: Browser key codes ignore keyboard layout.
  "KeyW": Command.LOOK_UP,
  "KeyA": Command.LOOK_LEFT,
  "KeyS": Command.LOOK_DOWN,
  "KeyD": Command.LOOK_RIGHT,
  "ArrowLeft": Command.MOVE_LEFT,
  "ArrowRight": Command.MOVE_RIGHT,
  "ArrowUp": Command.MOVE_FORWARD,
  "ArrowDown": Command.MOVE_BACKWARD,
};

export const VIEWPORT_STARTING_ADJUSTMENT = createTranslationTransform([
  0,
  0,
  5,
]);

export const VIEWPORT_MOVE_SPEED = 2 / SECONDS_TO_MS;

export const VIEWPORT_ADJUSTMENT_MAP: Record<
  Command,
  (deltaMS: number) => ObjectTransform
> = {
  [Command.MOVE_FORWARD]: (deltaMS) =>
    createTranslationTransform([0, 0, -VIEWPORT_MOVE_SPEED * deltaMS]),
  [Command.MOVE_BACKWARD]: (deltaMS) =>
    createTranslationTransform([0, 0, VIEWPORT_MOVE_SPEED * deltaMS]),
  [Command.MOVE_LEFT]: (deltaMS) =>
    createTranslationTransform([-VIEWPORT_MOVE_SPEED * deltaMS, 0, 0]),
  [Command.MOVE_RIGHT]: (deltaMS) =>
    createTranslationTransform([VIEWPORT_MOVE_SPEED * deltaMS, 0, 0]),
  [Command.LOOK_UP]: (deltaMS) =>
    createRotationTransform([1, 0, 0], VIEWPORT_MOVE_SPEED * deltaMS),
  [Command.LOOK_DOWN]: (deltaMS) =>
    createRotationTransform([1, 0, 0], -VIEWPORT_MOVE_SPEED * deltaMS),
  [Command.LOOK_LEFT]: (deltaMS) =>
    createRotationTransform([0, 1, 0], VIEWPORT_MOVE_SPEED * deltaMS),
  [Command.LOOK_RIGHT]: (deltaMS) =>
    createRotationTransform([0, 1, 0], -VIEWPORT_MOVE_SPEED * deltaMS),
};

export const MUSICBOX_TEST_TEMPO = 200;
export const MUSICBOX_TEST_SCORE = `
  melody: A5 * C#5 * E5 * C#5 * | A5  * D5 * *     *  E5 B5
  chords: AM * *   * *  * *   * | D3M * *  * E3M7  *  *  *  
  bass:   A2 * *   * *  * *   * | D1  * *  * E1    *  *  * 
`;
