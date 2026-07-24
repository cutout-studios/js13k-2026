export enum Command {
  MOVE_FORWARD = "M_F",
  MOVE_BACKWARD = "M_B",
  MOVE_LEFT = "M_L",
  MOVE_RIGHT = "M_R",
  ROTATE_UP = "R_U",
  ROTATE_DOWN = "R_D",
  ROTATE_LEFT = "R_L",
  ROTATE_RIGHT = "R_R"
}

const COMMAND_KEY_MAP: Record<string, Command> = {
  // NOTE: Browser key codes ignore keyboard layout.
  "KeyW": Command.ROTATE_UP,
  "KeyA": Command.ROTATE_DOWN,
  "KeyS": Command.ROTATE_LEFT,
  "KeyD": Command.ROTATE_RIGHT,
  "ArrowLeft": Command.MOVE_FORWARD,
  "ArrowRight": Command.MOVE_BACKWARD,
  "ArrowUp": Command.MOVE_RIGHT,
  "ArrowDown": Command.MOVE_LEFT,
};

export const activeCommands = new Set<Command>();

globalThis.addEventListener(
  "keydown",
  (event) => activeCommands.add(COMMAND_KEY_MAP[event.code]),
);

globalThis.addEventListener(
  "keyup",
  (event) => activeCommands.delete(COMMAND_KEY_MAP[event.code]),
);
