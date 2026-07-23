import { doTimes, XYZ } from "~common";
import { quadrangle } from "./polygons.ts";

type FaceXYZ = [p1: XYZ, p2: XYZ, p3: XYZ, p4: XYZ];

const FACE_COUNT = 6;
const FRONT_FACE: FaceXYZ = [
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
];

export const cube = () => {
  let localOrientation = (xyz: XYZ): XYZ => xyz;
  let down = false;
  return doTimes(FACE_COUNT, (index) => {
    if (index) {
      down = !down;
      const previous = localOrientation;
      const roll = down
        ? ([x, y, z]: XYZ): XYZ => [x, z, -y]  // hinge about local X
        : ([x, y, z]: XYZ): XYZ => [z, y, -x]; // hinge about local Y
      localOrientation = (xyz: XYZ) => previous(roll(xyz));
    }

    return quadrangle(...FRONT_FACE.map(localOrientation) as FaceXYZ);
  }).flat();
};
