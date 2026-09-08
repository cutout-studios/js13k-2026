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
  addXYZ,
  createObject,
  createPaintMaterialWithPalette as paint,
  createSphere,
  readOrigin,
  scaleXYZ,
  setOrigin,
  XYZ,
  Z_AXIS,
} from "~/3D";
import { round } from "~/alias";
import { ActionSchedule, createActionSequencer } from "~/clock";
import { doTimes } from "~/common";
import { randomDirection } from "~/random";

import { createPullAction, orbitAction } from "../actions.ts";
import { Bullet, Ship } from "./types.ts";

const SCATTER_BULLET_SPEED = 4,
  SCATTER_BULLET_LIFETIME = 1,
  SCATTER_BULLET_RADIUS = 0.05;

const createScatterBullet = (origin: XYZ, heading: XYZ): Bullet => {
  const object = createObject(
    [origin],
    [SCATTER_BULLET_RADIUS, ...createSphere(SCATTER_BULLET_RADIUS)],
    paint(0xF4AD32FF),
  );

  return [
    object,
    createActionSequencer([[
      (
        [[coordinates], , lifetime]: Bullet,
        tickLength: number,
        elapsedTime: number,
      ) => {
        if (elapsedTime >= lifetime) return true;

        setOrigin(
          coordinates,
          addXYZ(
            readOrigin(coordinates),
            scaleXYZ(heading, SCATTER_BULLET_SPEED * tickLength),
          ),
        );
      },
    ]] as ActionSchedule<Bullet>),
    SCATTER_BULLET_LIFETIME,
  ];
};

// a bomb is just a Bullet living in the weapon's own bullet pool - it drifts
// forward like a dropped item, then on expiry pushes `damage` fresh bullets
// (scattering in random directions) back into that same pool, which the
// weapon then keeps advancing as normal bullets from the next tick on
export const createBomb = (
  ship: Ship,
  weaponIndex: number,
  damage: number,
  driftSpeed: number,
  lifetime: number,
): Bullet => {
  const [, , weapons] = ship,
    [, [bullets, instanceGroup]] = weapons[weaponIndex],
    object = createObject(
      [readOrigin(ship[0][0])],
      [0.1, ...createSphere(0.1)],
      paint(0x222222FF),
    );

  return [
    object,
    createActionSequencer([[
      (
        [bombObject, , bombLifetime]: Bullet,
        tickLength: number,
        elapsedTime: number,
        duration: number,
      ) => {
        if (elapsedTime >= bombLifetime) {
          const origin = readOrigin(bombObject[0]);

          doTimes(round(damage), () => {
            const scatterBullet = createScatterBullet(
              origin,
              randomDirection(),
            );

            bullets.push(scatterBullet);
            instanceGroup.push(scatterBullet[0]);
          });

          return true;
        }

        createPullAction(Z_AXIS, driftSpeed)(
          bombObject,
          tickLength,
          elapsedTime,
          duration,
        );
        orbitAction(bombObject, tickLength, elapsedTime, duration);
      },
    ]] as ActionSchedule<Bullet>),
    lifetime,
  ];
};
