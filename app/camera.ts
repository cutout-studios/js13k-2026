import { compose, createRotation, createTranslation } from "~objects";
import type { Camera, XYZ } from "~common";

import { activeCommands, Command } from "./commands.ts";

const DEFAULT_FOV = Math.PI / 2;
const STARTING_POSITION: XYZ = [0, 0, 4];
const MOVE_SPEED = 5;
const ROTATION_SPEED = 2;

const vectorMap: Record<Command, XYZ> = {
  [Command.MOVE_FORWARD]: [0, 0, -1],
  [Command.MOVE_BACKWARD]: [0, 0, 1],
  [Command.MOVE_LEFT]: [-1, 0, 0],
  [Command.MOVE_RIGHT]: [1, 0, 0],
  [Command.ROTATE_UP]: [1, 0, 0],
  [Command.ROTATE_DOWN]: [-1, 0, 0],
  [Command.ROTATE_LEFT]: [0, 1, 0],
  [Command.ROTATE_RIGHT]: [0, -1, 0],
};

let position: XYZ = STARTING_POSITION;
let rotation = createRotation([0, 1, 0], 0);
export function updateCamera(deltaTime: number, fov = DEFAULT_FOV): Camera {
  for (const command of activeCommands) {
    const vector = vectorMap[command];
    if (command.startsWith("R")) {
      rotation = compose(
        rotation,
        createRotation(vector, deltaTime * ROTATION_SPEED),
      );
    } else {
      const step = vector.map((v) => v * deltaTime * MOVE_SPEED) as XYZ;
      position = position.map((p, i) => p + step[i]) as XYZ;
    }
  }

  return { transform: compose(rotation, createTranslation(position)), fov };
}
