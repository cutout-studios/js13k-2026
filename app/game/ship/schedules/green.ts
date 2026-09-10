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

// TODO:
// - the green enemy spirals in from behind the player or from deep field,
//   constantly spewing bullets that splay outward
// - the groups enters in as a line
// - if they get out of view, they reverse their spiral

import { addXYZ, readHeading, readOrigin, subtractXYZ, XYZ } from "~/3D";
import { cos, hypot, min, NO_OP, PI, sin } from "~/alias";
import { ActionSequencer, createActionSequencer } from "~/clock";
import { Band, doTimes, repeat, spread } from "~/common";
import { randomPoint } from "~/random";

import { isPointVisible } from "../../../elements/mainCanvas.ts";

import {
  createAimAction,
  createOrbitAction,
  createPullAction,
} from "../../actions.ts";
import {
  BULLET_MAX_RANGE,
  ENEMY_BULLET_RAMP_TIME,
  PLAYER_AIM_Z_PLANE,
  PLAYER_X_BOUND,
  PLAYER_Y_BOUND,
} from "../../constants.ts";
import { getPlayerShip } from "../../player/ship.ts";

import { Bullet, Ship, WeaponSnapshot } from "../types.ts";

export const greenBulletSequencerFactory = (
  [[coordinates]]: Bullet,
  speed: number,
): ActionSequencer<Bullet> => {
  const pullAction = createPullAction(
    readHeading(coordinates),
    speed,
    (elapsedTime: number) => min(1, elapsedTime / ENEMY_BULLET_RAMP_TIME),
  );

  return createActionSequencer([[
    (bullet: Bullet, ...args) => {
      pullAction(bullet[0], ...args);

      const newOrigin = readOrigin(coordinates);

      // cull once it's passed the camera, out past the play field, or
      // drifted outside the visible frustum
      return newOrigin[2] >= 0 ||
        newOrigin[2] < -BULLET_MAX_RANGE ||
        !isPointVisible(newOrigin);
    },
  ]]);
};

// TODO: green-specific fire pattern (constantly spewing bullets, per the
// TODO above)
export const greenWeaponSequenceFactory = (
  fire: (ship: Ship) => void,
  snapshot: WeaponSnapshot,
): ActionSequencer<Ship> =>
  createActionSequencer([
    [fire],
    [NO_OP, 1 / snapshot[5]],
  ]);

const CIRCLE_LOOPS = 3, // full laps around the aim-plane point, each made
  // of 2 semicircle hops
  CIRCLE_RADIUS = 1.2;

export const greenSequencerFactory = (
  _ship: Ship,
  arcPointRange: [Band, Band, Band] = repeat(3, spread(1)) as [
    Band,
    Band,
    Band,
  ],
) => {
  const startingPoint = readOrigin(_ship[0][0]),
    fieldPoint = randomPoint([
      spread(PLAYER_X_BOUND),
      spread(PLAYER_Y_BOUND),
      spread(0.5, -PLAYER_AIM_Z_PLANE),
    ]),
    referencePoint = randomPoint(arcPointRange),
    // the ring green loops around once it reaches the aim plane - each
    // step is a semicircle hop to the diametrically opposite point, so
    // consecutive hops continue the same lap instead of retracing it
    circlePoint = (step: number): XYZ => [
      fieldPoint[0] + CIRCLE_RADIUS * cos(step * PI),
      fieldPoint[1] + CIRCLE_RADIUS * sin(step * PI),
      fieldPoint[2],
    ],
    circleReference = (step: number): XYZ => [
      fieldPoint[0] + CIRCLE_RADIUS * 2 * cos((step + 0.5) * PI),
      fieldPoint[1] + CIRCLE_RADIUS * 2 * sin((step + 0.5) * PI),
      fieldPoint[2],
    ],
    entryPoint = circlePoint(0),
    mirroredReferencePoint = addXYZ(
      startingPoint,
      subtractXYZ(entryPoint, referencePoint),
    ),
    travelTime = hypot(...subtractXYZ(entryPoint, startingPoint)) /
      _ship[5][16],
    circleTime = (CIRCLE_RADIUS * PI) / _ship[5][16],
    orbitToAction = createOrbitAction(entryPoint, referencePoint),
    orbitFromAction = createOrbitAction(startingPoint, mirroredReferencePoint),
    circleActions = doTimes(
      CIRCLE_LOOPS * 2,
      (step: number) =>
        createOrbitAction(circlePoint(step + 1), circleReference(step)),
    ),
    aimAction = createAimAction(
      _ship[1],
      () => readOrigin(getPlayerShip()[0][0]),
      () => _ship[5][17],
    ),
    // green fires at any depth, not just once it's near the aim plane
    fireWeapons = (tickLength: number) => {
      const origin = readOrigin(_ship[0][0]);

      return isPointVisible(origin) &&
        doTimes(_ship[2], (weapon) => weapon[2](_ship, tickLength));
    },
    hopSegment = (
      orbitAction: ReturnType<typeof createOrbitAction>,
      duration: number,
    ): [(ship: Ship, ...args: [number, number, number]) => void, number] => [
      (_ship: Ship, ...args) => {
        orbitAction(_ship[0], ...args);
        aimAction(_ship[0], ...args);
        fireWeapons(args[0]);
      },
      duration,
    ];

  return createActionSequencer([
    hopSegment(orbitToAction, travelTime),
    ...doTimes(circleActions, (action) => hopSegment(action, circleTime)),
    hopSegment(orbitFromAction, travelTime),
  ]);
};
