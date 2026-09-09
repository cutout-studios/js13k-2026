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

import { addXYZ, readOrigin, subtractXYZ } from "~/3D";
import { hypot } from "~/alias";
import { createActionSequencer } from "~/clock";
import { Band, clamp, doTimes, repeat, spread } from "~/common";
import { randomPoint } from "~/random";

import { isPointVisible } from "../../../elements/mainCanvas.ts";

import {
  createAimAction,
  createOrbitAction,
  EASE_IN,
  EASE_OUT,
} from "../../actions.ts";
import {
  PLAYER_AIM_Z_PLANE,
  PLAYER_X_BOUND,
  PLAYER_Y_BOUND,
} from "../../constants.ts";
import { getPlayerShip } from "../../player/ship.ts";

import { Ship } from "../types.ts";

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
    // mirrored through the start/field midpoint - orbitFromAction ends up
    // tracing the SAME circle in the SAME rotational direction as
    // orbitToAction (continuing the loop back to the spawn point) instead of
    // retracing the inbound arc backwards
    mirroredReferencePoint = addXYZ(
      startingPoint,
      subtractXYZ(fieldPoint, referencePoint),
    ),
    travelTime = hypot(...subtractXYZ(fieldPoint, startingPoint)) /
      _ship[5][16],
    // fast near the spawn point on both legs, slow near the field point -
    // keeps distant travel readable as depth without lingering on the way in
    orbitToAction = createOrbitAction(fieldPoint, referencePoint, EASE_OUT),
    orbitFromAction = createOrbitAction(
      startingPoint,
      mirroredReferencePoint,
      EASE_IN,
    ),
    aimAction = createAimAction(
      _ship[1],
      () => readOrigin(getPlayerShip()[0][0]),
      () => _ship[5][17],
    ),
    fireWeapons = (tickLength: number) =>
      isPointVisible(readOrigin(_ship[0][0])) &&
      doTimes(_ship[2], (weapon) => weapon[2](_ship, tickLength));

  return createActionSequencer([
    [(_ship: Ship, ...args) => {
      orbitToAction(_ship[0], ...args);
      aimAction(_ship[0], ...args);
      fireWeapons(args[0]);
    }, travelTime],
    [(_ship: Ship, ...args) => {
      aimAction(_ship[0], ...args);
      fireWeapons(args[0]);
    }, clamp(4 / _ship[5][16], [2, 10])],
    [(_ship: Ship, ...args) => {
      orbitFromAction(_ship[0], ...args);
      aimAction(_ship[0], ...args);
      fireWeapons(args[0]);
    }, travelTime],
  ]);
};
