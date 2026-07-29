import { doTimes } from "~common";
import { Geometry, Point } from "./types.ts";
import { square } from "./polygons.ts";

type FaceGeometry = [
  topLeft: Point,
  topRight: Point,
  bottomRight: Point,
  bottomLeft: Point,
];

const FACE_COUNT = 6;
const DEFAULT_FACE: FaceGeometry = [
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
];

export const cube = (): Geometry => {
  let [localOrientation, down] = [(xyz: Point): Point => xyz, true];
  return doTimes(FACE_COUNT, (index) => {
    if (index) {
      down = !down;
      const previous = localOrientation;
      const roll = down
        ? ([x, y, z]: Point): Point => [x, z, -y] // hinge about local X
        : ([x, y, z]: Point): Point => [z, y, -x]; // hinge about local Y
      localOrientation = (xyz: Point) => previous(roll(xyz));
    }

    return square(...(DEFAULT_FACE.map(localOrientation) as FaceGeometry));
  }).flat();
};
