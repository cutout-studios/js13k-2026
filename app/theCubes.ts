import { doTimes, repeat, XYZ } from "~common";
import {
  CUBE_FACE_COLORS,
  CUBE_OFFSETS,
  POLYGONS_PER_CUBE_FACE,
} from "./constants.ts";

import { createCubeGeometry, paint } from "~objects";
import { XOObject } from "../libraries/objects/test.ts";

const geometry = createCubeGeometry();
const placements = CUBE_OFFSETS.map((offset) => [offset, 0, 0] as XYZ);

export const getCubePaint = (shift: number) =>
  paint(...CUBE_FACE_COLORS.map((_, index) =>
    repeat(
      POLYGONS_PER_CUBE_FACE,
      CUBE_FACE_COLORS[(index + shift) % CUBE_FACE_COLORS.length],
    )
  ));

export const theCubes = doTimes(CUBE_OFFSETS.length, (index) =>
  new XOObject(
    geometry,
    placements[index],
    undefined,
    getCubePaint(index),
  ));
