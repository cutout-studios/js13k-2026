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

import { doTimes, repeat } from "~/common";
import { cos, length, PI, sin, TAU } from "~/alias";

import { XYZ_LENGTH } from "./constants.ts";
import type { XYZ } from "./types.ts";

const DEFAULT_SCALE = repeat(XYZ_LENGTH, 1) as XYZ;

export const createTriangle = (
  p1: XYZ,
  p2: XYZ,
  p3: XYZ,
): XYZ[] => [p1, p2, p3];

export const createSquare = (
  p1: XYZ,
  p2: XYZ,
  p3: XYZ,
  p4: XYZ,
): XYZ[] => [...createTriangle(p1, p2, p3), ...createTriangle(p1, p3, p4)];

export const createPyramid = (
  scale: XYZ = DEFAULT_SCALE,
  divisions = 4,
): XYZ[] =>
  _lathe([[0, -1], [_inscribe(divisions), -1], [0, 1]], scale, divisions);

export const createPrism = (
  scale: XYZ = DEFAULT_SCALE,
  divisions = 4,
): XYZ[] => {
  const radius = _inscribe(divisions);
  return _lathe(
    [[0, -1], [radius, -1], [radius, 1], [0, 1]],
    scale,
    divisions,
  );
};

export const createSphere = (radius = 1, divisions = 10): XYZ[] =>
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
): XYZ[] => {
  const _getVertex = (loopIndex: number, divisionIndex: number): XYZ => {
    const [radius, distance] = edgeLoops[loopIndex],
      angle = TAU * (divisionIndex + 0.5) / loopDivisions;
    return [
      radius * cos(angle) * scaleX,
      radius * sin(angle) * scaleY,
      distance * scaleZ,
    ];
  };

  const result: XYZ[] = [];

  doTimes(
    length(edgeLoops) - 1,
    (ringIndex: number) =>
      doTimes(
        loopDivisions,
        (divisionIndex: number) =>
          result.push(...createSquare(
            _getVertex(ringIndex, divisionIndex),
            _getVertex(ringIndex, divisionIndex + 1),
            _getVertex(ringIndex + 1, divisionIndex + 1),
            _getVertex(ringIndex + 1, divisionIndex),
          )),
      ),
  );

  return result;
};

const _inscribe = (sides: number) => 1 / cos(PI / sides);
