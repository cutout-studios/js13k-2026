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

import { F32, hypot, length, max, min, PI } from "~/alias";
import { Band, doTimes, flatDoTimes, repeat } from "~/common";
import { rollBand } from "~/random";
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
import { create as createPaintMaterial } from "./materials/paint.ts";
import type {
  XOGeometry,
  XOMaterial,
  XOObject,
  XOOrientation,
  XYZ,
} from "./types.ts";
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
      (index: number) => object[0][POSITION_INDEX + index] += position[index],
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
  const vertices = flatDoTimes(
    objects,
    ([coordinates, [, _verticies = []]]) =>
      doTimes(
        _verticies,
        ([x, y, z]: XYZ) =>
          doTimes(XYZ_LENGTH, (row: number) =>
            coordinates[row] * x +
            coordinates[COORDINATE_SIDE_LENGTH + row] * y +
            coordinates[COORDINATE_SIDE_LENGTH * 2 + row] * z +
            coordinates[POSITION_INDEX + row]) as XYZ,
      ),
  );

  return [
    createRotation(),
    [
      objects.reduce(
        (radius, [coordinates, [partRadius]]) =>
          max(radius, hypot(...readOrigin(coordinates)) + partRadius),
        0,
      ),
      vertices as XYZ[],
    ],
    createPaintMaterial(
      new F32(
        flatDoTimes(
          objects,
          ([, [, verticies = []], [, data = repeat(4, 1)] = []]) =>
            doTimes(
              length(verticies) / XYZ_LENGTH * RGBA_LENGTH,
              (index: number) => data[index % length(data)],
            ),
        ),
      ),
    ),
  ];
};

export const getCollisionPairs = (
  leftGroup: XOObject[],
  rightGroup: XOObject[],
) => {
  const leftResult = [] as number[], rightResult = [] as number[];

  doTimes(leftGroup, ([leftCoords, [leftRadius]]: XOObject, leftIndex) => {
    doTimes(
      rightGroup,
      ([rightCoords, [rightRadius]]: XOObject, rightIndex) => {
        if (
          hypot(...subtract(readOrigin(leftCoords), readOrigin(rightCoords))) >=
            leftRadius + rightRadius
        ) return;
        leftResult.push(leftIndex), rightResult.push(rightIndex);
      },
    );
  });

  return [leftResult, rightResult];
};

export const scatterObjects = (
  boxDimensions: [Band, Band, Band],
  cantOverlap: boolean,
  ...objects: XOObject[]
) => {
  // guard against objects that can't fit in the scatter box - stripped for
  // size once game balance is tuned; uncomment to debug scatter configs
  // const scatterBoxDimensions = doTimes(boxDimensions, ([lo, hi]) => hi - lo),
  //   scatterBoxVolume = scatterBoxDimensions.reduce(
  //     (product, value) => product * value,
  //     1,
  //   );
  // let maxObjectDiameter = -Infinity, totalObjectVolume = 0;
  // doTimes(objects, ([, [radius]]) => {
  //   maxObjectDiameter = max(maxObjectDiameter, radius * 2);
  //   totalObjectVolume += (4 * PI / 3) * radius ** 3;
  // });
  // if (
  //   min(...scatterBoxDimensions) < maxObjectDiameter ||
  //   scatterBoxVolume < totalObjectVolume * 3
  // ) throw new Error("Objects won't fit!");

  const placedObjects: XOObject[] = [];
  while (length(objects)) {
    const objectToPlace = objects.pop()!;

    setOrigin(
      objectToPlace[0],
      doTimes(boxDimensions, (band) => rollBand(band)) as XYZ,
    );

    placedObjects.push(objectToPlace);

    if (cantOverlap && length(getCollisionPairs(objects, placedObjects)[0])) {
      objects.push(placedObjects.pop()!);
    }
  }
};
