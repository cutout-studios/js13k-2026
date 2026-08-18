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

type Ship = {
  object: XOObject;
  roll: number;
};
export const TEMP_STRAFE_SPEED = 4;

export const ship = {
  object: new XOObject(
    createPyramid([0.25, 0.1, 0.25]),
    [0, 0, -7],
    [[0, 1, 0], PI],
    paintMaterial(0xFFFFFF),
  ),
  roll: 0,
};

export const aimShip = (ship: Ship, target: XYZ) => {
  const zAxis = normalizeXYZ(subtractXYZ(ship.object.position, target)),
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

export const getStrafeBindings = (speed: number): Record<string, XYZ> => ({
  KeyW: [0, speed, 0],
  KeyA: [-speed, 0, 0],
  KeyS: [0, -speed, 0],
  KeyD: [speed, 0, 0],
});
