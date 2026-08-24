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

import { doTimes } from "~/common";
import { length } from "~/alias";

import { PLAYER_SHEET_OPTIONS } from "../options/constants.ts";
import { Player } from "./types.ts";

export const getData = (
  [, [[shield, fuel, armor], equipment], inventory]: Player,
): number[] => {
  const percentModifier: number[] = [], additionModifier: number[] = [];
  for (const index of equipment) {
    if (index === undefined) continue;
    for (const [name, value] of inventory[index][4]) {
      const type = PLAYER_SHEET_OPTIONS[name][1],
        target = type === 2 ? additionModifier : percentModifier;
      target[name] = (target[name] ?? 0) +
        (type === 2 ? value : type === 1 ? -value / 100 : value / 100);
    }
  }
  const base = PLAYER_SHEET_OPTIONS.map(([, , , value]) => value);
  const _fold = (index: number) =>
    base[index] * (1 + (percentModifier[index] ?? 0)) +
    (additionModifier[index] ?? 0);
  const quality = _fold(17);
  for (
    const [level, ...stats] of [[shield, 21, 22], [fuel, 11, 14], [
      armor,
      0,
    ]] as const
  ) {
    const growth = quality ** level;
    for (const i of stats) base[i] *= growth;
  }
  const result = doTimes(length(PLAYER_SHEET_OPTIONS), _fold);

  // special case - lowestResource. armor weighted x10
  const pools = [21, 0, 11], weights = [1, 10, 1];
  let lowest = 0;
  for (let i = 1; i < 3; i++) {
    if (
      result[pools[i]] * weights[i] < result[pools[lowest]] * weights[lowest]
    ) lowest = i;
  }
  result[pools[lowest]] *= 1 + (percentModifier[18] ?? 0);

  return result;
};
