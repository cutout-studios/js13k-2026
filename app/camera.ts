import {
  compose,
  createRotation,
  createTranslation,
  getDefaultTransform,
} from "~objects";
import type { Camera, XYZ } from "~common";

import {
  activeCommands,
  Command,
} from "./commands.ts";

const DEFAULT_FOV = Math.PI / 2;
const MOVE_SPEED = 5;
const ROTATION_SPEED = 2;

const vectorMap: Record<Command, XYZ> = {
  [Command.MOVE_FORWARD]: [0, 1, 0],
  [Command.MOVE_BACKWARD]: [0, -1, 0],
  [Command.MOVE_LEFT]: [-1, 0, 0],
  [Command.MOVE_RIGHT]: [1, 0, 0],
  [Command.ROTATE_UP]: [1, 0, 0],
  [Command.ROTATE_DOWN]: [-1, 0, 0],
  [Command.ROTATE_LEFT]: [0, 0, 1],
  [Command.ROTATE_RIGHT]: [0, 0, -1],
};

let transform = getDefaultTransform();
export function updateCamera(deltaTime: number, fov = DEFAULT_FOV): Camera {
  transform = compose(
    transform,
    ...([...activeCommands].map((command) => {
      const vector = vectorMap[command];

      if (command.startsWith("R")) {
        return createRotation(vector, deltaTime * ROTATION_SPEED);
      }

      return createTranslation(
        vector.map((value) => value * deltaTime * MOVE_SPEED) as XYZ,
      );
    })),
  );

  return { transform, fov };
}
