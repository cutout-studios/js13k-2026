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
import { doTimes, repeat } from "~/common";
import {
  adjustObject,
  createObject,
  createPaintMaterialWithPalette as paint,
  XYZ,
} from "~/3D";
import { bell, range } from "~/random";

import { Item } from "./types.ts";
import { ITEM_RANK_FALLOFF, ITEM_RANK_THRESHOLDS } from "./constants.ts";

import { levelCurve, levelRoll } from "../world/levels.ts";
import { ColorOptions, ModifierOptions } from "../options/types.ts";

import { createDeck, drawCard, insertCard } from "../decks.ts";
import { createActionSequencer } from "~/clock";

import GameOptions from "../options/module.ts";

const _itemDeck = createDeck(4),
  _itemRankRoll = (
    level: number,
    quality = 0,
    roll = bell() + levelCurve(level) + quality,
  ) =>
    length(ITEM_RANK_THRESHOLDS.filter((threshold) => roll >= threshold)) + 1;

const [[, , [ITEM_GEOMETRY]]] = GameOptions;

export const createItem = (
  [, value, , [[
    baseMass,
    baseModifierCount,
    baseBulletCount,
    baseBulletRate,
    baseBulletDamage,
  ], modifiers]]: ColorOptions,
  level: number = 1,
  quality = 0,
): Item => {
  const rank = _itemRankRoll(level, quality),
    typeID = drawCard(_itemDeck),
    modifierDeck = [] as ModifierOptions[];
  doTimes(modifiers, (modifier) => {
    if (modifier[0] === typeID || modifier[0] === 0) {
      insertCard(modifierDeck, modifier);
    }
  });

  return [
    createObject(...ITEM_GEOMETRY[typeID], paint(value)),
    createActionSequencer([[
      ([object], tickLength) =>
        adjustObject(object, [undefined, [
          repeat(3, tickLength) as XYZ,
          tickLength,
        ]]),
    ]]),
    typeID,
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
