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

import { readHeading, readOrigin } from "~/3D";
import { min } from "~/alias";
import { ActionSequencer, createActionSequencer } from "~/clock";

import { isPointVisible } from "../../../elements/mainCanvas.ts";
import { createPullAction } from "../../actions.ts";
import { BULLET_MAX_RANGE, ENEMY_BULLET_RAMP_TIME } from "../../constants.ts";
import { Bullet } from "../types.ts";

// used by ships that haven't been given their own {color}BulletSequencerFactory
// (see ship/schedules/*.ts) - a straight shot with no jitter. kept in its own
// leaf module (no GameOptions import) since ship/schedules/*.ts files need to
// import this without creating a cycle back through options/module.ts
export const defaultBulletSequencerFactory = (
  [[coordinates]]: Bullet,
  speed: number,
  isEnemy: boolean,
): ActionSequencer<Bullet> => {
  const pullAction = createPullAction(
    readHeading(coordinates),
    speed,
    isEnemy
      ? (elapsedTime: number) => min(1, elapsedTime / ENEMY_BULLET_RAMP_TIME)
      : () => 1,
  );

  return createActionSequencer([[
    (bullet: Bullet, ...args) => {
      pullAction(bullet[0], ...args);

      const newOrigin = readOrigin(coordinates);

      return newOrigin[2] >= 0 ||
        newOrigin[2] < -BULLET_MAX_RANGE ||
        !isPointVisible(newOrigin);
    },
  ]]);
};
