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

import { readOrigin } from "~/3D";
import { join } from "~/alias";
import { doTimes, flat } from "~/common";
import GameOptions from "./game/options/module.ts";
import { PROPERTY_NAMES } from "./game/ship/constants.ts";
import { Resources, Ship, ShipSnapshot } from "./game/ship/types.ts";

const RESOURCE_NAMES = [
    "shield",
    "fuel",
    "segments",
    "armor",
    "invulnerable",
    "ejecting",
  ],
  properties = (values: number[], offset = 0) =>
    Object.fromEntries(
      doTimes(
        values,
        (value, index) => [PROPERTY_NAMES[index + offset], value],
      ),
    ),
  resources = (
    [
      shieldDamage,
      fuelDamage = 0,
      segmentDamage = 0,
      armorDamage = 0,
      invulnerableFlag,
      ejectingFlag,
    ]: Resources,
    s: ShipSnapshot,
  ) => ({
    shield: { now: s[15] - shieldDamage, max: s[15] },
    fuel: { now: s[4] - fuelDamage, max: s[4] },
    segments: { now: s[8] - segmentDamage, max: s[8] },
    armor: { now: s[0] - armorDamage, max: s[0] },
    invulnerable: { now: +(invulnerableFlag ?? false), max: 1 },
    ejecting: { now: +(ejectingFlag ?? false), max: 1 },
  });

export const logShip = (ship: Ship, label = "SHIP") => {
  const [[coordinates], heading, weapons, , damages, snapshot, optionsIndex] =
    ship;
  console.groupCollapsed(`${label} ${GameOptions[optionsIndex][0]}`);
  console.log("origin", join(readOrigin(coordinates)));
  console.log("heading", join(flat(heading)));
  console.table(resources(damages, snapshot));
  console.table(properties(snapshot));
  doTimes(weapons, (weapon, index) => {
    console.groupCollapsed(`weapon (${["L", "R"][index]})`);
    console.table(properties(weapon[4], 22));
    console.groupEnd();
  });
  console.groupEnd();
};

export const logDamage = (target: Ship, source: string, apply: () => void) => {
  const before = [...target[4]] as Resources;
  apply();
  const deltas = doTimes(
    target[4],
    (
      value,
      index,
    ) => [RESOURCE_NAMES[index], +(value ?? 0) - +(before[index] ?? 0)],
  ).filter(([, delta]) => delta);
  if (!deltas.length) return;
  const snapshot = target[5];
  console.log(
    `%c${source} → ${GameOptions[target[6]][0]}`,
    "color:#F4AD32",
    Object.fromEntries(deltas),
    `shield ${snapshot[15] - target[4][0]}/${snapshot[15]}`,
    `armor ${snapshot[0] - (target[4][3] ?? 0)}/${snapshot[0]}`,
  );
};
