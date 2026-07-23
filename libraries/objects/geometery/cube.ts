import { doTimes, XYZ } from "~common";
import { create } from "./create.ts";
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
  let last = FRONT_FACE, down = false;
  return create(
    doTimes(FACE_COUNT, (index) => {
      down = !down;
      if (index) {
        last = last.map(([x, y, z]) =>
          down ? [x, z, -y] : [z, y, -x]
        ) as FaceXYZ;
      }
      return quadrangle(...last);
    })
      .flat(),
  );
};
