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

import { _, length } from "~/alias";
import { doTimes } from "~/common";
import { createObject } from "~/3D";
import { bell, range } from "~/random";

import { Item } from "./types.ts";
import { ITEM_RANK_FALLOFF, ITEM_RANK_THRESHOLDS } from "./constants.ts";

import { levelCurve, levelRoll } from "../world/levels.ts";
import { ColorOptions, ModifierOptions } from "../options/types.ts";

import { createDeck, drawCard, insertCard } from "../decks.ts";
import { createActionSequencer } from "~/clock";

const _itemDeck = createDeck(4),
  _itemRankRoll = (
    level: number,
    quality = 0,
    roll = bell() + levelCurve(level) + quality,
  ) =>
    length(ITEM_RANK_THRESHOLDS.filter((threshold) => roll >= threshold)) + 1;

export const createItem = (
  options: ColorOptions[],
  colorID: number,
  level: number,
  quality = 0,
): Item => {
  const [, , [geometry]] = options[0];

  const [
    [
      baseMass,
      baseModifierCount,
      baseBulletCount,
      baseBulletRate,
      baseBulletDamage,
    ],
    modifiers,
  ] = options[colorID][3]!;
  const rank = _itemRankRoll(level, quality),
    typeID = drawCard(_itemDeck),
    modifierDeck = [] as ModifierOptions[];
  doTimes(modifiers, (modifier) => {
    if (modifier[0] === typeID || modifier[0] === 0) {
      insertCard(modifierDeck, modifier);
    }
  });

  return [
    createObject(...geometry[typeID]),
    createActionSequencer([[(item: Item) => item]]),
    typeID,
    colorID,
    rank,
    doTimes((typeID <= 1 ? rank - 1 : rank) + baseModifierCount, () => {
      const [, propertyID, type, valueBand] = drawCard(modifierDeck);

      return [propertyID, type, levelRoll(valueBand, rank, ITEM_RANK_FALLOFF)];
    }),
    range(...baseMass),
    (typeID < 2)
      ? [
        baseBulletCount,
        levelRoll(baseBulletRate, level),
        levelRoll(baseBulletDamage, level),
      ]
      : _,
  ];
};
