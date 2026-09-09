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
  // particles: cut for now - see particles.ts
  // createCoordinates,
  // localize,
  // normalizeXYZ,
  readOrigin,
  scaleXYZ,
  setOrigin,
  XYZ,
} from "~/3D";
// import { _ } from "~/alias";
import { createEnvelope } from "~/clock";
import { clamp, doTimes, spread } from "~/common";
import { bindButton, bindPointer } from "~/controller";

import { getPanFromCoordinates } from "../../../libraries/audio/pan.ts";
import { menu, title } from "../../elements/handles.ts";
import { mapClientXYToZPlane } from "../../elements/mainCanvas.ts";
import { resetMenu } from "../../elements/menu.ts";
import { createAimAction } from "../actions.ts";
import { PLAYER_X_BOUND, PLAYER_Y_BOUND } from "../constants.ts";
import GameState from "../module.ts";
// import GameOptions from "../options/module.ts";
// import { spawnParticle } from "../particles.ts";
import { createSpinSequence } from "../ship/spin.ts";
import { playerSpinSound } from "../sounds.ts";

import {
  SPIN_BOOST_AMOUNT,
  SPIN_BOOST_ATTACK_TIME,
  SPIN_BOOST_RELEASE_TIME,
  STRAFE_ATTACK_TIME,
  STRAFE_RELEASE_TIME,
} from "./constants.ts";

const [[playerShip]] = GameState,
  [playerShipObject, playerAim, [leftWeapon, rightWeapon], , , snapshot] =
    playerShip,
  [wEnvelope, aEnvelope, sEnvelope, dEnvelope] = doTimes(
    4,
    () => createEnvelope(STRAFE_ATTACK_TIME, STRAFE_RELEASE_TIME),
  ),
  spinBoostEnvelope = createEnvelope(
    SPIN_BOOST_ATTACK_TIME,
    SPIN_BOOST_RELEASE_TIME,
  ),
  aimAction = createAimAction(
    playerAim,
    () => mouseTarget,
    () => snapshot[17],
    () => playerShip[4][6],
  );

// particles: cut for now - see particles.ts
// approximate engine mount, local to the ship (-Z is behind - +Z is the
// heading/nose per aimObject) - comment out along with the thruster spawn
// below to cut particles entirely
// const ENGINE_MOUNT = createCoordinates(_, _, _, [0, 0, -0.3]);

let mouseTarget: XYZ = playerAim;
export const checkMousePointer = bindPointer(
  (_tickLength: number, x: number, y: number) =>
    mouseTarget = mapClientXYToZPlane(x, y),
);

const startGame = () => {
  GameState[2] = true;
  title.style.opacity = "0";
};

export const checkLMouseButton = bindButton(
  "LClick",
  startGame,
  (t) => leftWeapon[2](playerShip, t),
);

export const checkRMouseButton = bindButton(
  "RClick",
  startGame,
  (t) => rightWeapon[2](playerShip, t),
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
  () => {
    const resources = playerShip[4];

    if (resources[3] || resources[4] || resources[5]) return; // invulnerable, or still recovering

    if (GameState[2]) {
      const totalGasUsed = resources[1] + snapshot[9];
      if (totalGasUsed >= snapshot[4]) return;
      resources[1] = totalGasUsed;
    }

    playerSpinSound(getPanFromCoordinates(playerShip[0][0]));
    playerShip[3] = createSpinSequence(
      playerShip,
      strafe[3] - strafe[1] < 0 ? -1 : 1,
    );
  },
);

export const checkEscapeKey = bindButton(
  "Escape",
  () => menu.open ? menu.close() : (menu.showModal(), resetMenu()),
);

export const applyInputToPlayerShip = (tickLength: number) => {
  const strafeX = strafe[3] - strafe[1],
    strafeY = strafe[0] - strafe[2],
    speedBoost = 1 +
      spinBoostEnvelope(tickLength, !!playerShip[4][4]) * SPIN_BOOST_AMOUNT *
        snapshot[14];

  adjustObject(playerShipObject, [
    scaleXYZ([strafeX, strafeY, 0], snapshot[16] * speedBoost * tickLength),
  ]);

  aimAction(playerShipObject, tickLength, 0, 1);

  // clamp ship to camera bounds
  const [x, y, z] = readOrigin(playerShipObject[0]);
  setOrigin(playerShipObject[0], [
    clamp(x, spread(PLAYER_X_BOUND)),
    clamp(y, spread(PLAYER_Y_BOUND)),
    z,
  ]);

  // particles: cut for now - see particles.ts
  // if (strafeX || strafeY) {
  //   // exhaust trails opposite the ship's actual motion, not the aim heading -
  //   // strafing is independent of where you're aiming
  //   const weaponColor = GameOptions[leftWeapon[4]][1];
  //
  //   spawnParticle(
  //     readOrigin(localize(ENGINE_MOUNT, playerShipObject[0])),
  //     scaleXYZ(normalizeXYZ([strafeX, strafeY, 0]), -1),
  //     2,
  //     0.15,
  //     weaponColor,
  //     weaponColor & 0xFFFFFF00,
  //   );
  // }
};
