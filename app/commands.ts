export enum Command {
  MOVE_FORWARD = "M_F",
  MOVE_BACKWARD = "M_B",
  MOVE_LEFT = "M_L",
  MOVE_RIGHT = "M_R",
  ROTATE_UP = "R_U",
  ROTATE_DOWN = "R_D",
  ROTATE_LEFT = "R_L",
  ROTATE_RIGHT = "R_R",
}

const COMMAND_KEY_MAP: Record<string, Command> = {
  // NOTE: Browser key codes ignore keyboard layout.
  "KeyW": Command.ROTATE_UP,
  "KeyA": Command.ROTATE_LEFT,
  "KeyS": Command.ROTATE_DOWN,
  "KeyD": Command.ROTATE_RIGHT,
  "ArrowLeft": Command.MOVE_LEFT,
  "ArrowRight": Command.MOVE_RIGHT,
  "ArrowUp": Command.MOVE_FORWARD,
  "ArrowDown": Command.MOVE_BACKWARD,
};

export const activeCommands = new Set<Command>();

globalThis.addEventListener(
  "keydown",
  (event) =>
    COMMAND_KEY_MAP[event.code] &&
    activeCommands.add(COMMAND_KEY_MAP[event.code]),
);

globalThis.addEventListener(
  "keyup",
  (event) =>
    COMMAND_KEY_MAP[event.code] &&
    activeCommands.delete(COMMAND_KEY_MAP[event.code]),
);
