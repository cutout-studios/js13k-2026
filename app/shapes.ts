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

import { createSquare, createTriangle, XOGeometry, XYZ } from "~3D";

import { cos, length, PI, sin } from "./alias.ts";

export const createPyramid = ([x, y, z]: XYZ = [1, 1, 1]): XOGeometry => {
  const apex: XYZ = [0, 0, z];
  const base = [
    [-x, -y],
    [-x, y],
    [x, y],
    [x, -y],
  ].map(
    (pair) => [...pair, -z] as XYZ,
  ) as [XYZ, XYZ, XYZ, XYZ];

  return [
    ...createSquare(...base),
    ...base.flatMap((vertex, index) =>
      createTriangle(base[(index + 1) % length(base)], vertex, apex)
    ),
  ];
};

export const createSphere = (
  radius: number = 1,
  divisions = 10,
): XOGeometry => {
  const result: XOGeometry = [];

  let index = divisions ** 2;
  while (index--) {
    const latitude = (index / divisions) | 0, longitude = index % divisions;

    const [p1, p2, p3, p4] = [[0, 0], [0, 1], [1, 1], [1, 0]].map(
      ([latitudeOffset, longitudeOffset]) => {
        const phi = PI * ((latitude + latitudeOffset) / divisions - 0.5),
          theta = (2 * PI * (longitude + longitudeOffset)) / divisions;

        const ring = radius * cos(phi);
        return [ring * cos(theta), ring * sin(theta), radius * sin(phi)] as XYZ;
      },
    );

    result.push(
      ...(latitude === 0
        ? createTriangle(p1, p3, p4)
        : latitude === divisions - 1
        ? createTriangle(p1, p2, p3)
        : createSquare(p1, p2, p3, p4)),
    );
  }

  return result;
};
