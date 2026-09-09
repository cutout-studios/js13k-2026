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

import { Ship } from "../ship/types.ts";

// a leaf module on purpose: anything that needs "the current player" (e.g.
// an enemy schedule picking an aim target) should import from here, NOT
// from app/game/module.ts directly to avoid cycles

let playerShip: Ship;

export const setPlayerShip = (ship: Ship) => playerShip = ship;
export const getPlayerShip = () => playerShip;
