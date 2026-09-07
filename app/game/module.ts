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

import {
  createObject,
  createPaintMaterialWithPalette as paint,
  createSphere,
  readOrigin,
  setOrigin,
  XOGeometry,
  XOObject,
} from "~/3D";
import { _, cos, random, sin, TAU } from "~/alias";
import { Band, doTimes, flat, flatDoTimes } from "~/common";
import { rollBand } from "~/random";

import startingPlayer from "./player/module.ts";
import { getShipObjects } from "./ship/module.ts";
import { Game } from "./types.ts";
import startingWorld from "./world/module.ts";

export default [startingPlayer, startingWorld, false] as Game;

// TODO: bell parameter
const rollUniform = ([lo, hi]: Band) => lo + (hi - lo) * random();

const STAR_Z_PLANE = 300,
  STAR_WALL_COUNT = 6,
  STAR_WALL_CAPACITY = 256,
  STAR_TUNNEL_RADIUS = 80,
  STAR_LOCAL_SPREAD = 90,
  STAR_ROTATION_SPEED = 0.006,
  starGeometry = createSphere(0.1),
  // a hexagonal tunnel of star "walls" ringed around the camera's own
  // forward (Z) axis and slowly spinning in the XY plane
  starWalls: XOObject[][] = doTimes(STAR_WALL_COUNT, (wallIndex: number) => {
    const angle = wallIndex * TAU / STAR_WALL_COUNT,
      centerX = STAR_TUNNEL_RADIUS * cos(angle),
      centerY = STAR_TUNNEL_RADIUS * sin(angle);

    return doTimes(STAR_WALL_CAPACITY, () => {
      const object = createObject(
        _,
        flat([0.1], starGeometry) as XOGeometry,
        paint(0xFFFFFFFF - rollBand([0x00, 0xFF])),
      );

      setOrigin(object[0], [
        centerX + rollUniform([-STAR_LOCAL_SPREAD, STAR_LOCAL_SPREAD]),
        centerY + rollUniform([-STAR_LOCAL_SPREAD, STAR_LOCAL_SPREAD]),
        -STAR_Z_PLANE + rollUniform([-30, 30]),
      ]);

      return object;
    });
  });

export const updateBackgroundStars = (tickLength: number) => {
  const angle = STAR_ROTATION_SPEED * tickLength,
    c = cos(angle),
    s = sin(angle);

  doTimes(starWalls, (stars) =>
    doTimes(stars, ([coordinates]) => {
      const [x, y, z] = readOrigin(coordinates);
      setOrigin(coordinates, [x * c - y * s, x * s + y * c, z]);
    }));
};

export const getSceneObjects = (
  [[playerShip], [activeEnemyGroups, droppedItems]]: Game,
): XOObject[][] => {
  const [hull, ...rest] = getShipObjects(playerShip);
  return flat(
    starWalls,
    playerShip[4][4] && (Date.now() / 80 | 0) % 2 ? [] : [hull],
    rest,
    flatDoTimes(
      activeEnemyGroups,
      (ships) => flatDoTimes(ships, getShipObjects) as XOObject[][],
    ),
    doTimes(droppedItems, ([object]) => [object]),
  );
};
