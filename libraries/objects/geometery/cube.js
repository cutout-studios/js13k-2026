import { create } from "./create.js";
import { quadrangle } from "./polygons.js";

const FACE_COUNT = 6;
const FRONT_FACE = [
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
];

export const cube = () => {
  const faces = [FRONT_FACE];
  let down = true; // true = roll right
  while (faces.length < FACE_COUNT) {
    faces.push(
      faces.at(-1).map(([x, y, z]) => down ? [x, z, -y] : [z, y, -x]),
    );
    down = !down;
  }

  const triangles = [];
  for (const face of faces) {
    triangles.push(...quadrangle(...face));
  }

  return create(triangles);
};
