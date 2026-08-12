/**
 *    Copyright 2026 Cutout Studios LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { doTimes, repeat } from "~common";
import {
  makeSquare,
  paintMaterial,
  TRIANGLES_PER_SQUARE,
  XOGeometry,
  XOObject,
  XYZ,
} from "~3D";

import { CUBE_FACE_COLORS, CUBE_OFFSETS } from "./constants.ts";

type FaceGeometry = [
  topLeft: XYZ,
  topRight: XYZ,
  bottomRight: XYZ,
  bottomLeft: XYZ,
];

const FACE_COUNT = 6;
const DEFAULT_FACE: FaceGeometry = [
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
];

const makeCube = (): XOGeometry => {
  let [localOrientation, down] = [(xyz: XYZ): XYZ => xyz, true];
  return doTimes(FACE_COUNT, (index) => {
    if (index) {
      down = !down;
      const previous = localOrientation;
      const roll = down
        ? ([x, y, z]: XYZ): XYZ => [x, z, -y] // hinge about local X
        : ([x, y, z]: XYZ): XYZ => [z, y, -x]; // hinge about local Y
      localOrientation = (xyz: XYZ) => previous(roll(xyz));
    }

    return makeSquare(...(DEFAULT_FACE.map(localOrientation) as FaceGeometry));
  }).flat();
};

const geometry = makeCube();
const placements = CUBE_OFFSETS.map((offset) => [offset, 0, 0] as XYZ);

export const paintCube = (shift: number) =>
  paintMaterial(...CUBE_FACE_COLORS.map((_, index) =>
    repeat(
      TRIANGLES_PER_SQUARE,
      CUBE_FACE_COLORS[(index + shift) % CUBE_FACE_COLORS.length],
    )
  ));

export const theCubes = doTimes(CUBE_OFFSETS.length, (index) =>
  new XOObject(
    geometry,
    placements[index],
    undefined,
    paintCube(index),
  ));
