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
  adjustObject,
  aimObject,
  readOrigin,
  scaleXYZ,
  setOrigin,
  subtractXYZ,
} from "~/3D";
import { _, max, min } from "~/alias";
import { createEnvelope } from "~/clock";
import { doTimes } from "~/common";
import { bindButton, bindPointer } from "~/controller";

import { menu, title } from "../../elements/handles.ts";
import { mapClientXYToZPlane } from "../../elements/mainCanvas.ts";
import { resetMenu } from "../../elements/menu.ts";
import GameState from "../module.ts";
import { createSpinSequence } from "../ship/spin.ts";

import { STRAFE_ATTACK_TIME, STRAFE_RELEASE_TIME } from "./constants.ts";

const [[playerShip]] = GameState,
  [wEnvelope, aEnvelope, sEnvelope, dEnvelope] = doTimes(
    4,
    () => createEnvelope(STRAFE_ATTACK_TIME, STRAFE_RELEASE_TIME),
  );

export const checkMousePointer = bindPointer(
  (tickLength: number, x: number, y: number) => {
    [x, y] = scaleXYZ(
      subtractXYZ(mapClientXYToZPlane(x, y), playerShip[1]),
      tickLength / playerShip[5][21],
    );

    playerShip[1][0] += x;
    playerShip[1][1] += y;
  },
);

export const checkLMouseButton = bindButton("LClick", () => {
  GameState[2] = true;
  title.style.opacity = "0";
}, (t) => playerShip[2][0][3](playerShip, t));

export const checkRMouseButton = bindButton(
  "RClick",
  _,
  (t) => playerShip[2][1][3](playerShip, t),
);

const strafe = [0, 0, 0, 0];
export const checkWKey = bindButton(
  "KeyW",
  (t) => strafe[0] = wEnvelope(t, true),
  (t) => strafe[0] = wEnvelope(t, true),
  (t) => strafe[0] = wEnvelope(t),
  (t) => strafe[0] = wEnvelope(t),
);
export const checkAKey = bindButton(
  "KeyA",
  (t) => strafe[1] = aEnvelope(t, true),
  (t) => strafe[1] = aEnvelope(t, true),
  (t) => strafe[1] = aEnvelope(t),
  (t) => strafe[1] = aEnvelope(t),
);
export const checkSKey = bindButton(
  "KeyS",
  (t) => strafe[2] = sEnvelope(t, true),
  (t) => strafe[2] = sEnvelope(t, true),
  (t) => strafe[2] = sEnvelope(t),
  (t) => strafe[2] = sEnvelope(t),
);
export const checkDKey = bindButton(
  "KeyD",
  (t) => strafe[3] = dEnvelope(t, true),
  (t) => strafe[3] = dEnvelope(t, true),
  (t) => strafe[3] = dEnvelope(t),
  (t) => strafe[3] = dEnvelope(t),
);

export const checkSpaceBar = bindButton(
  "Space",
  () =>
    playerShip[3] = createSpinSequence(playerShip, [
      strafe[3] - strafe[1],
      strafe[0] - strafe[2],
      0,
    ]),
);

export const checkEscapeKey = bindButton(
  "Escape",
  () => menu.open ? menu.close() : (menu.showModal(), resetMenu()),
);

export const applyInputToPlayerShip = (tickLength: number) => {
  const strafeX = strafe[3] - strafe[1],
    strafeY = strafe[0] - strafe[2];

  adjustObject(playerShip[0], [scaleXYZ(
    [strafeX, strafeY, 0],
    playerShip[5][20] * (playerShip[4][6] ? playerShip[5][18] : 1) *
    tickLength,
  )]);

  aimObject(playerShip[0], playerShip[1]);

  // clamp ship to camera bounds
  const [x, y, z] = readOrigin(playerShip[0][0]);
  setOrigin(playerShip[0][0], [
    min(2.8, max(-2.8, x)),
    min(2.1, max(-2.1, y)),
    z,
  ]);
};
