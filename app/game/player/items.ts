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
  createObject,
  createPaintMaterialWithPalette as paint,
  setOrigin,
  XOGeometry,
  XOOrientation,
  Z_AXIS,
} from "~/3D";
import { _, length, min } from "~/alias";
import { createActionSequencer } from "~/clock";
import { doTimes, flat } from "~/common";

import { bell, oneOf, rollBand } from "~/random";

import { createPull, orbit } from "../actions.ts";
import { createDeck, drawCard, insertCard } from "../decks.ts";
import GameOptions from "../options/module.ts";

import { ModifierOptions } from "../options/types.ts";
import { levelCurve, levelRoll } from "../world/levels.ts";

import { Item } from "./types.ts";

const _itemDeck = createDeck(4),
  _itemRankRoll = (
    level: number,
    roll = bell() + levelCurve(level),
  ) => length([0.85, 1.35].filter((threshold) => roll >= threshold)) + 1;

const [[, , [ITEM_GEOMETRY]]] = GameOptions;

export const createItem = (
  colorID: number,
  typeID: number = drawCard(_itemDeck),
  level: number = 1,
  rank: number = _itemRankRoll(level),
): Item => {
  const [, value, , [[
      baseMass,
      baseModifierCount,
      baseBulletCount,
      baseBulletRate,
      baseBulletDamage,
    ], modifiers]] = GameOptions[colorID],
    modifierDeck = [] as ModifierOptions[],
    pull = createPull(Z_AXIS, 0.01, () => 1, 0.07);

  doTimes(modifiers, (modifier) => {
    if (modifier[0] == typeID || modifier[0] == 0) {
      insertCard(modifierDeck, modifier);
    }
  });

  return [
    createObject(
      ...flat(ITEM_GEOMETRY[typeID]) as [XOOrientation, XOGeometry],
      paint(value),
    ),
    createActionSequencer([[
      ([object], ...args) => (pull(object, ...args), orbit(object, ...args)),
    ]]),
    typeID,
    colorID,
    rank,
    doTimes(
      min(
        modifierDeck.length,
        (typeID <= 1 ? rank - 1 : rank) + baseModifierCount,
      ),
      () => {
        const [, propertyID, type, valueBand] = drawCard(modifierDeck);

        return [propertyID, type, levelRoll(valueBand, rank - 1, 1.5)];
      },
    ),
    rollBand(baseMass),
    (typeID < 2)
      ? [
        baseBulletCount,
        levelRoll(baseBulletRate, level),
        levelRoll(baseBulletDamage, level),
      ]
      : _,
  ];
};

export const combineItems = (
  level: number,
  ...items: Item[]
): Item | undefined =>
  setItemInFrame(createItem(
    oneOf(doTimes(items, ([, , , colorID]) => colorID)),
    oneOf(doTimes(items, ([, , typeID]) => typeID)),
    level,
    min(3, min(...doTimes(items, ([, , , , rank]) => rank)) + 1),
  ));

// specifically used to set at item inside the equip menu frame
export const setItemInFrame = (item: Item) => {
  setOrigin(item[0][0], [0, 0, -1.5]);

  item[1] = createActionSequencer([[
    ([object], ...args) => orbit(object, ...args),
  ]]);

  return item;
};
