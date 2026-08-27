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

import { repeat } from "~/common";

import { Player } from "./types.ts";
import { createShip } from "../ship/module.ts";
import colorOptions from "../options/module.ts";
import { Resources } from "../ship/types.ts";
import { setOrigin } from "../../../libraries/3D/coordinates.ts";
import { PLAYER_Z_PLANE } from "./constants.ts";
import { ENEMY_Z_PLANE } from "../world/constants.ts";

const ship = createShip(colorOptions[0]);

setOrigin(ship[0][0], [0, 0, -PLAYER_Z_PLANE]);

ship[1] = [0, 0, -ENEMY_Z_PLANE];

export default [
  ship,
  repeat(5, 0) as Resources,

  // inventory
  [],
] as Player;
