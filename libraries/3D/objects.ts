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

import { abs, cos, F32, hypot, length, max, sin /* PI */ } from "~/alias";
import { Band, clamp, doTimes, flatDoTimes, repeat } from "~/common";
import { randomPoint } from "~/random";
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
  readHeading,
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
import { add, cross, dot, normalize, scale, subtract } from "./xyz.ts";

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

export const aimObject = (object: XOObject, aim: XYZ, roll = 0) => {
  const origin = readOrigin(object[0]),
    zAxis = normalize(subtract(aim, origin)),
    right = normalize(cross(Y_AXIS, zAxis)),
    up = cross(zAxis, right),
    c = cos(roll),
    s = sin(roll);

  // I still don't understand rotation...
  object[0] = createCoordinates(
    add(scale(right, c), scale(up, s)),
    add(scale(up, c), scale(right, -s)),
    zAxis,
    origin,
  );
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
      objects.reduce(
        (halfLength, [coordinates, [, , partHalfLength = 0]]) =>
          max(
            halfLength,
            abs(readOrigin(coordinates)[2]) +
              partHalfLength * abs(readHeading(coordinates)[2]),
          ),
        0,
      ),
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

const _getCapsule = ([coordinates, [radius, , halfLength = 0]]: XOObject) => {
  const origin = readOrigin(coordinates),
    offset = scale(readHeading(coordinates), halfLength);

  return [radius, subtract(origin, offset), add(origin, offset)] as const;
};

const _segmentDistance = (
  leftStart: XYZ,
  leftEnd: XYZ,
  rightStart: XYZ,
  rightEnd: XYZ,
) => {
  const leftDirection = subtract(leftEnd, leftStart),
    rightDirection = subtract(rightEnd, rightStart),
    startOffset = subtract(leftStart, rightStart),
    leftLengthSquared = dot(leftDirection, leftDirection),
    rightLengthSquared = dot(rightDirection, rightDirection),
    rightDotOffset = dot(rightDirection, startOffset),
    leftDotOffset = dot(leftDirection, startOffset);

  let leftT = 0, rightT = 0;
  if (leftLengthSquared || rightLengthSquared) {
    if (!leftLengthSquared) {
      // left is just a point; slide along the right segment only
      rightT = clamp(rightDotOffset / rightLengthSquared);
    } else if (!rightLengthSquared) {
      // right is just a point; slide along the left segment only
      leftT = clamp(-leftDotOffset / leftLengthSquared);
    } else {
      const crossTerm = dot(leftDirection, rightDirection),
        denominator = leftLengthSquared * rightLengthSquared -
          crossTerm * crossTerm;

      leftT = denominator
        ? clamp(
          (crossTerm * rightDotOffset - leftDotOffset * rightLengthSquared) /
            denominator,
        )
        : 0;
      rightT = (crossTerm * leftT + rightDotOffset) / rightLengthSquared;

      if (rightT < 0) {
        rightT = 0;
        leftT = clamp(-leftDotOffset / leftLengthSquared);
      } else if (rightT > 1) {
        rightT = 1;
        leftT = clamp((crossTerm - leftDotOffset) / leftLengthSquared);
      }
    }
  }

  return hypot(
    ...subtract(
      add(leftStart, scale(leftDirection, leftT)),
      add(rightStart, scale(rightDirection, rightT)),
    ),
  );
};

export const getCollisionPairs = (
  leftGroup: XOObject[],
  rightGroup: XOObject[],
) => {
  const leftResult = [] as number[],
    rightResult = [] as number[],
    leftCapsules = leftGroup.map(_getCapsule),
    rightCapsules = rightGroup.map(_getCapsule);

  doTimes(leftCapsules, ([leftRadius, leftStart, leftEnd], leftIndex) => {
    doTimes(
      rightCapsules,
      ([rightRadius, rightStart, rightEnd], rightIndex) => {
        if (
          _segmentDistance(leftStart, leftEnd, rightStart, rightEnd) >=
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
  ...objects: XOObject[]
) =>
  doTimes(objects, ([coords]) => setOrigin(coords, randomPoint(boxDimensions)));
