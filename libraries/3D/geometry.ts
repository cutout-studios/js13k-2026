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

import { abs, cos, hypot, length, max, PI, sin, TAU } from "~/alias";
import { doTimes, flat, repeat } from "~/common";

import { XYZ_LENGTH } from "./constants.ts";
import type { XOGeometry, XYZ } from "./types.ts";

const DEFAULT_SCALE = repeat(XYZ_LENGTH, 1) as XYZ;

const _bounds = (points: XYZ[]): [radius: number, halfLength: number] => [
  max(...points.map(([x, y, z]) => hypot(x, y, z))),
  max(...points.map(([, , z]) => abs(z))),
];

export const createTriangle = (p1: XYZ, p2: XYZ, p3: XYZ): XOGeometry => {
  const points = [p1, p2, p3], [radius, halfLength] = _bounds(points);
  return [radius, points, halfLength];
};

export const createSquare = (
  p1: XYZ,
  p2: XYZ,
  p3: XYZ,
  p4: XYZ,
): XOGeometry => {
  const [radiusA, a, halfA = 0] = createTriangle(p1, p2, p3),
    [radiusB, b, halfB = 0] = createTriangle(p1, p3, p4);
  return [max(radiusA, radiusB), flat(a, b), max(halfA, halfB)];
};

export const createPyramid = (
  scale: XYZ = DEFAULT_SCALE,
  divisions = 4,
): XOGeometry =>
  _lathe([[0, -1], [_inscribe(divisions), -1], [0, 1]], scale, divisions);

export const createPrism = (
  scale: XYZ = DEFAULT_SCALE,
  divisions = 4,
): XOGeometry => {
  const radius = _inscribe(divisions);
  return _lathe(
    [[0, -1], [radius, -1], [radius, 1], [0, 1]],
    scale,
    divisions,
  );
};

export const createSphere = (radius = 1, divisions = 10): XOGeometry =>
  _lathe(
    doTimes(divisions + 1, (index: number) => {
      const phi = PI * (index / divisions - 0.5);
      return [cos(phi), sin(phi)];
    }),
    [radius, radius, radius],
    divisions,
  );

const _lathe = (
  edgeLoops: Array<[radius: number, distance: number]>,
  [scaleX, scaleY, scaleZ]: XYZ = DEFAULT_SCALE,
  loopDivisions = 4,
): XOGeometry => {
  const result: XYZ[] = [];

  doTimes(
    length(edgeLoops) - 1,
    (ringIndex: number) =>
      doTimes(
        loopDivisions,
        (divisionIndex: number) => {
          const [radius0, distance0] = edgeLoops[ringIndex],
            [radius1, distance1] = edgeLoops[ringIndex + 1],
            angle0 = TAU * (divisionIndex + 0.5) / loopDivisions,
            angle1 = TAU * (divisionIndex + 1.5) / loopDivisions,
            [, square] = createSquare(
              [
                radius0 * cos(angle0) * scaleX,
                radius0 * sin(angle0) * scaleY,
                distance0 * scaleZ,
              ],
              [
                radius0 * cos(angle1) * scaleX,
                radius0 * sin(angle1) * scaleY,
                distance0 * scaleZ,
              ],
              [
                radius1 * cos(angle1) * scaleX,
                radius1 * sin(angle1) * scaleY,
                distance1 * scaleZ,
              ],
              [
                radius1 * cos(angle0) * scaleX,
                radius1 * sin(angle0) * scaleY,
                distance1 * scaleZ,
              ],
            );

          result.push(...square);
        },
      ),
  );

  const [radius, halfLength] = _bounds(result);
  return [radius, result, halfLength];
};

const _inscribe = (sides: number) => 1 / cos(PI / sides);
