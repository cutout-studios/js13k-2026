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

import { doTimes } from "~/common";
import { F32, hypot, max } from "~/alias";
import { create as createPaintMaterial } from "./materials/paint.ts";

import type {
  XOGeometry,
  XOMaterial,
  XOObject,
  XOOrientation,
  XYZ,
} from "./types.ts";
import {
  COORDINATE_SIDE_LENGTH,
  RGBA_LENGTH,
  XYZ_LENGTH,
  Y_AXIS,
} from "./constants.ts";
import {
  createCoordinates,
  createRotation,
  localize,
  POSITION_INDEX,
  readOrigin,
  setOrigin,
} from "./coordinates.ts";
import { cross, normalize, subtract } from "./xyz.ts";

export const createObject = (
  [position, rotation]: XOOrientation = [],
  geometry: XOGeometry = [0, []],
  material?: XOMaterial,
): XOObject => [
  setOrigin(createRotation(rotation), position),
  geometry,
  material,
];

export const adjustObject = (
  object: XOObject,
  [position, rotation]: XOOrientation,
) => {
  if (position) {
    doTimes(
      XYZ_LENGTH,
      (index) => object[0][POSITION_INDEX + index] += position[index],
    );
  }

  if (rotation) object[0] = localize(createRotation(rotation), object[0]);
};

export const aimObject = (object: XOObject, heading: XYZ) => {
  const origin = readOrigin(object[0]),
    zAxis = normalize(subtract(heading, origin)),
    right = normalize(cross(Y_AXIS, zAxis));
  object[0] = createCoordinates(right, cross(zAxis, right), zAxis, origin);
};

// CRUCIAL NOTE!!: assumes all materials are paint materials
export const flattenObjects = (...objects: XOObject[]): XOObject => {
  const vertices = objects.flatMap(([coordinates, [, verticies = []]]) =>
    verticies.map(([x, y, z]) =>
      doTimes(XYZ_LENGTH, (row) =>
        coordinates[row] * x +
        coordinates[COORDINATE_SIDE_LENGTH + row] * y +
        coordinates[COORDINATE_SIDE_LENGTH * 2 + row] * z +
        coordinates[POSITION_INDEX + row]) as XYZ
    )
  );

  return [
    createRotation(),
    [
      objects.reduce(
        (radius, [coordinates, [partRadius]]) =>
          max(radius, hypot(...readOrigin(coordinates)) + partRadius),
        0,
      ),
      vertices,
    ],
    createPaintMaterial(
      new F32(
        objects.flatMap(([, [, verticies = []], [, data = new F32()] = []]) =>
          doTimes(
            verticies.length / XYZ_LENGTH * RGBA_LENGTH,
            (index) => data[index % data.length],
          )
        ),
      ),
    ),
  ];
};

export const getCollisionPairs = (
  group1: XOObject[],
  group2: XOObject[],
) => {
  const result: [XOObject, XOObject][] = [];

  for (const object1 of group1) {
    for (const object2 of group2) {
      const [coord1, [radius1]] = object1, [coord2, [radius2]] = object2;

      if (
        hypot(...subtract(readOrigin(coord1), readOrigin(coord2))) >=
          radius1 + radius2
      ) continue;

      result.push([object1, object2]);
    }
  }

  return result;
};
