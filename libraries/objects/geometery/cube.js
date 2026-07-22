import { create } from "./create.js";
import { quadrangle } from "./polygons.js";

const CUBE_FACE_COUNT = 6;
export const cube = () => {
  const faces = [/* TODO: INIT FACE */];
  let direction = "down";
  while (faces.length < CUBE_FACE_COUNT) {
    faces.push(
      direction === "down"
        ? [] // TODO
        : [], // TODO
    );

    direction = direction === "down" ? "right" : "down";
  }

  const triangles = [];
  for (const face of faces) {
    triangles.push(...quadrangle(...face));
  }

  return create(triangles);
};

/*

  *
  _
  * | *
      _
      * | *
          _
          *
*/
