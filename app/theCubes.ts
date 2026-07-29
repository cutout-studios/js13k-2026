import { doTimes, repeat } from "~common";
import {
  CUBE_FACE_COLORS,
  CUBE_OFFSETS,
  POLYGONS_PER_CUBE_FACE,
} from "./constants.ts";

import {
  createTranslation,
  fromRigid,
  multiply,
  RigidTransform,
  toRigid,
} from "~transforms";
import { createCubeGeometry, createObject, paint } from "~objects";

const geometry = createCubeGeometry();
const placements = CUBE_OFFSETS.map((offset) =>
  createTranslation([offset, 0, 0])
);

export const getCubePaint = (shift: number) =>
  paint(...CUBE_FACE_COLORS.map((_, index) =>
    repeat(
      POLYGONS_PER_CUBE_FACE,
      CUBE_FACE_COLORS[(index + shift) % CUBE_FACE_COLORS.length],
    )
  ));

export const getCubeAdjustment = (index: number, adjustment: RigidTransform) =>
  toRigid(multiply(fromRigid(placements[index]), fromRigid(adjustment)));

export const theCubes = doTimes(CUBE_OFFSETS.length, (index) =>
  createObject({
    geometry: geometry,
    transform: placements[index],
    material: getCubePaint(index),
  }));
