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
    "hp",
    "gas",
    "rez",
    "invulnerable",
    "countering",
    "flinching",
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
      damage,
      gasDamage = 0,
      rez = 0,
      invulnerableFlag,
    ]: Resources,
    s: ShipSnapshot,
  ) => ({
    hp: { now: s[11] - damage, max: s[11] },
    gas: { now: s[4] - gasDamage, max: s[4] },
    rez: { now: s[0] - rez, max: s[0] },
    invulnerable: { now: +(invulnerableFlag ?? false), max: 1 },
  });

export const logShip = (ship: Ship, label = "SHIP") => {
  const [[coordinates], aim, weapons, , damages, snapshot, optionsIndex] = ship;
  console.groupCollapsed(`${label} ${GameOptions[optionsIndex][0]}`);
  console.log("origin", join(readOrigin(coordinates)));
  console.log("aim", join(flat(aim)));
  console.table(resources(damages, snapshot));
  console.table(properties(snapshot));
  doTimes(weapons, (weapon, index) => {
    console.groupCollapsed(`weapon (${["L", "R"][index]})`);
    console.table(properties(weapon[3], 18));
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
    `hp ${snapshot[11] - target[4][0]}/${snapshot[11]}`,
    `rez ${snapshot[0] - (target[4][2] ?? 0)}/${snapshot[0]}`,
  );
};
