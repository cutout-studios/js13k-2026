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

import { adjustObject, readOrigin, scaleXYZ, setOrigin, XYZ } from "~/3D";
import { createEnvelope } from "~/clock";
import { clamp, doTimes, spread } from "~/common";
import { bindButton, bindPointer } from "~/controller";

import { getPanFromCoordinates } from "../../../libraries/audio/pan.ts";
import { menu, title } from "../../elements/handles.ts";
import { mapClientXYToZPlane } from "../../elements/mainCanvas.ts";
import { resetMenu } from "../../elements/menu.ts";
import { createAimAction } from "../actions.ts";
import GameState from "../module.ts";
import { PLAYER_X_BOUND, PLAYER_Y_BOUND } from "../options/base.ts";
import { defaultWeaponSequencerFactory } from "../options/defaults.ts";
import { createSpinSequence } from "../ship/spin.ts";
import { Weapon } from "../ship/types.ts";
import { canAffordWeapon, fireWeapon } from "../ship/weapons.ts";
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
  strafeEnvelopes = doTimes(
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

let mouseTarget: XYZ = playerAim;
export const checkMousePointer = bindPointer(
  (_tickLength: number, x: number, y: number) =>
    mouseTarget = mapClientXYToZPlane(x, y),
);

const bindWeaponKey = (code: string, weapon: Weapon, weaponIndex: number) => {
  const hold = (t: number) => weapon[2](playerShip, t),
    reset = (t: number) => {
      if (!GameState[2]) {
        GameState[2] = true;
        title.style.opacity = "0";
      }
      if (canAffordWeapon(playerShip, weaponIndex)) {
        weapon[2] = defaultWeaponSequencerFactory(
          fireWeapon(weaponIndex),
          weapon[3],
        );
      }
      hold(t);
    };

  return bindButton(code, reset, hold);
};

export const checkLMouseButton = bindWeaponKey("LClick", leftWeapon, 0);
export const checkRMouseButton = bindWeaponKey("RClick", rightWeapon, 1);

const strafe = [0, 0, 0, 0],
  bindStrafeKey = (code: string, index: number) => {
    const envelope = strafeEnvelopes[index],
      onDown = (t: number) => strafe[index] = envelope(t, true),
      onUp = (t: number) => strafe[index] = envelope(t);

    return bindButton(code, onDown, onDown, onUp, onUp);
  };

export const checkWKey = bindStrafeKey("KeyW", 0);
export const checkAKey = bindStrafeKey("KeyA", 1);
export const checkSKey = bindStrafeKey("KeyS", 2);
export const checkDKey = bindStrafeKey("KeyD", 3);

export const checkSpaceBar = bindButton(
  "Space",
  () => {
    const resources = playerShip[4];

    if (resources[3] || resources[4] || resources[5]) return; // invulnerable, or still recovering

    if (GameState[2]) {
      const totalGasUsed = resources[1] + snapshot[9] * snapshot[5];
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

export const checkFKey = bindButton(
  "KeyF",
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
};
