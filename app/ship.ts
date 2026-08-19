import { cos, hypot, max, PI, sin } from "~alias";
import { doTimes } from "~common";
import {
  createCoordinates,
  createPaintMaterial,
  createPaintPalette,
  crossXYZ,
  normalizeXYZ,
  scaleXYZ,
  subtractXYZ,
  XOObject,
  XYZ,
  XYZ_LENGTH,
} from "~3D";
import { approach, create as createEnvelope } from "~envelope";

import { mapClientXY } from "./canvas.ts";
// export { getBaseStats } from "./stats.ts";
import { createPyramid } from "./shapes.ts";

import { MAX_DISTANCE } from "./constants.ts";
import { keyboard, pointer } from "./controller.ts";

const TEMP_STRAFE_SPEED = 5,
  TEMP_TRACKING_TIME = 0.6,
  STRAFE_KEYS = ["KeyD", "KeyA", "KeyW", "KeyS"],
  strafeEnvelopes = doTimes(
    STRAFE_KEYS.length,
    () => createEnvelope(0.30, 0.35),
  ),
  WHITE = createPaintPalette(0xFFFFFF);

export const ship = {
  object: new XOObject(
    createPyramid([0.25, 0.1, 0.25], 6),
    [0, 0, -5],
    [[0, 1, 0], PI],
    createPaintMaterial(WHITE),
  ),
  roll: 0,
  aim: [0, 0, -MAX_DISTANCE] as XYZ,
  adjust(tickLength: number) {
    const strafeMagnitudes: XYZ = [0, 0, 0];
    doTimes(STRAFE_KEYS.length, (index: number) => {
      const value = strafeEnvelopes[index](
        tickLength,
        !keyboard.has(STRAFE_KEYS[index]),
      );
      strafeMagnitudes[index >> 1] += index & 1 ? -value : value;
    });

    this.object.adjust(
      scaleXYZ(
        strafeMagnitudes,
        TEMP_STRAFE_SPEED * tickLength / max(1, hypot(...strafeMagnitudes)),
      ),
    );

    if (pointer) {
      const target = mapClientXY(pointer[0]);
      const ratio = tickLength / TEMP_TRACKING_TIME;
      const aim = this.aim = doTimes(
        XYZ_LENGTH,
        (index) => approach(ship.aim[index], target[index], ratio),
      ) as XYZ;

      const zAxis = normalizeXYZ(subtractXYZ(ship.object.position, aim)),
        right = normalizeXYZ(crossXYZ([0, 1, 0], zAxis)),
        up = crossXYZ(zAxis, right),
        s = sin(this.roll),
        c = cos(this.roll);

      this.object.coordinates = createCoordinates(
        doTimes(XYZ_LENGTH, (index) => right[index] * c + up[index] * s) as XYZ,
        doTimes(XYZ_LENGTH, (index) => up[index] * c - right[index] * s) as XYZ,
        zAxis,
        this.object.position,
      );
    }
  },
};
