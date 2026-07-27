import {
  createRotationTransform,
  createTranslationTransform,
  type ObjectTransform,
} from "~scenes";

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

export const COMMAND_KEYMAP: Record<string, Command> = {
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

export const VIEWPORT_STARTING_LOCATION = createTranslationTransform([0, 0, 5]);

export const VIEWPORT_COMMAND_ADJUSTMENT_MAP: Record<Command, ObjectTransform> =
  {
    [Command.MOVE_FORWARD]: createTranslationTransform([0, 0, -1]),
    [Command.MOVE_BACKWARD]: createTranslationTransform([0, 0, 1]),
    [Command.MOVE_LEFT]: createTranslationTransform([-1, 0, 0]),
    [Command.MOVE_RIGHT]: createTranslationTransform([1, 0, 0]),
    [Command.LOOK_UP]: createRotationTransform([1, 0, 0], Math.PI),
    [Command.LOOK_DOWN]: createRotationTransform([1, 0, 0], -Math.PI),
    [Command.LOOK_LEFT]: createRotationTransform([0, 0, 1], Math.PI),
    [Command.LOOK_RIGHT]: createRotationTransform([0, 0, 1], -Math.PI),
  };

export const MUSICBOX_TEST_TEMPO = 200;
export const MUSICBOX_TEST_SCORE = `
  melody: A5 * C#5 * E5 * C#5 * | A5  * D5 * *     *  E5 B5
  chords: AM * *   * *  * *   * | D3M * *  * E3M7  *  *  *  
  bass:   A2 * *   * *  * *   * | D1  * *  * E1    *  *  * 
`;
