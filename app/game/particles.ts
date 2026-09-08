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
  createCoordinates,
  createObject,
  createPaintMaterialWithPalette as paint,
  createSphere,
  scaleXYZ,
  X_AXIS,
  XOGeometry,
  XOObject,
  XYZ,
  Y_AXIS,
  Z_AXIS,
} from "~/3D";
import { createActionSequencer } from "~/clock";
import { Band, doTimes, flat, spliceTable } from "~/common";
import { randomDirection, rollBand } from "~/random";

import { createColorTransitionAction } from "./actions.ts";

const PARTICLE_GEOMETRY = flat([0.04], createSphere(0.04)) as XOGeometry;

type Particle = [
  object: XOObject,
  sequence: (object: XOObject, tickLength: number) => boolean | void,
];

// one flat list, rendered as one group per particle (like dropped items) -
// each particle fades/tints independently, so they can't share a material
export const particles: Particle[] = [];

export const spawnParticle = (
  origin: XYZ,
  direction: XYZ,
  speed: number,
  lifetime: number,
  fromColor: number,
  toColor: number,
) => {
  const object = createObject([origin], PARTICLE_GEOMETRY, paint(fromColor)),
    fade = createColorTransitionAction(fromColor, toColor);

  particles.push([
    object,
    createActionSequencer([[
      (obj: XOObject, tickLength: number, elapsedTime: number, duration: number) => {
        const scale = 1 - elapsedTime / duration;

        obj[0] = createCoordinates(
          scaleXYZ(X_AXIS, scale),
          scaleXYZ(Y_AXIS, scale),
          scaleXYZ(Z_AXIS, scale),
          addXYZ(origin, scaleXYZ(direction, speed * elapsedTime)),
        );
        fade(obj, tickLength, elapsedTime, duration);
      },
      lifetime,
    ]], 1),
  ]);
};

// spawn `count` particles radiating outward from `origin` - e.g. an explosion
export const createBurst = (
  origin: XYZ,
  count: number,
  speed: Band,
  lifetime: Band,
  fromColor: number,
  toColor: number,
) =>
  doTimes(
    count,
    () =>
      spawnParticle(
        origin,
        randomDirection(),
        rollBand(speed),
        rollBand(lifetime),
        fromColor,
        toColor,
      ),
  );

export const updateParticles = (tickLength: number) => {
  const dead = [] as number[];

  doTimes(
    particles,
    ([object, sequence], index: number) =>
      sequence(object, tickLength) && dead.push(index),
  );

  spliceTable([particles], dead);
};
