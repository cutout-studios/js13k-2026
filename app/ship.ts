import { doTimes } from "~common";
import {
  createCoordinates,
  crossXYZ,
  normalizeXYZ,
  paintMaterial,
  subtractXYZ,
  XOObject,
  XYZ,
  XYZ_LENGTH,
} from "~3D";
import { cos, PI, sin } from "~alias";

// export { getBaseStats } from "./stats.ts";
import { createPyramid } from "./shapes.ts";

import { approach } from "../libraries/envelope.ts";
import { MAX_DISTANCE } from "./constants.ts";

type Ship = {
  object: XOObject;
  roll: number;
  aim: XYZ;
};
export const TEMP_STRAFE_SPEED = 5, TEMP_TRACKING_TIME = 0.6;

export const ship = {
  object: new XOObject(
    createPyramid([0.25, 0.1, 0.25]),
    [0, 0, -7],
    [[0, 1, 0], PI],
    paintMaterial(0xFFFFFF),
  ),
  roll: 0,
  aim: [0, 0, -MAX_DISTANCE] as XYZ,
};

export const aimShip = (ship: Ship, target: XYZ, tickLength: number) => {
  const ratio = tickLength / TEMP_TRACKING_TIME;
  const aim = ship.aim = doTimes(
    XYZ_LENGTH,
    (index) => approach(ship.aim[index], target[index], ratio),
  ) as XYZ;

  const zAxis = normalizeXYZ(subtractXYZ(ship.object.position, aim)),
    right = normalizeXYZ(crossXYZ([0, 1, 0], zAxis)),
    up = crossXYZ(zAxis, right),
    s = sin(ship.roll),
    c = cos(ship.roll);

  ship.object.coordinates = createCoordinates(
    doTimes(XYZ_LENGTH, (index) => right[index] * c + up[index] * s) as XYZ,
    doTimes(XYZ_LENGTH, (index) => up[index] * c - right[index] * s) as XYZ,
    zAxis,
    ship.object.position,
  );
};
