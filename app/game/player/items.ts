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
  adjustObject,
  createObject,
  createPaintMaterialWithPalette as paint,
  XOObject,
  XYZ,
} from "~/3D";
import { _, cos, length, min, random, sin, TAU } from "~/alias";
import { Action, createActionSequencer } from "~/clock";
import { doTimes, repeat } from "~/common";

import { bell, oneOf, range } from "~/random";

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

// TODO: generalize
const _tempMeanderActionFactory = (
  driftAmount = 0.0005,
  driftSpeed = 0.25,
): Action<[XOObject]> => {
  const phase = random() * TAU;

  return ([object], tickLength) => {
    return adjustObject(object, [
      [
        ...doTimes([sin, cos], (f) => f(tickLength + phase) * driftAmount),
        driftSpeed * tickLength,
      ] as XYZ,
    ]);
  };
};

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
  ], modifiers]] = GameOptions[colorID];
  const modifierDeck = [] as ModifierOptions[];
  doTimes(modifiers, (modifier) => {
    if (modifier[0] === typeID || modifier[0] === 0) {
      insertCard(modifierDeck, modifier);
    }
  });

  const meander = _tempMeanderActionFactory();

  return [
    createObject(...ITEM_GEOMETRY[typeID], paint(value)),
    createActionSequencer([[
      ([object], tickLength) => {
        meander([object], tickLength, 0, 0);
        adjustObject(object, [undefined, [
          repeat(3, tickLength) as XYZ,
          tickLength,
        ]]);
      },
    ]]),
    typeID,
    colorID,
    rank,
    doTimes((typeID <= 1 ? rank - 1 : rank) + baseModifierCount, () => {
      const [, propertyID, type, valueBand] = drawCard(modifierDeck);

      return [propertyID, type, levelRoll(valueBand, rank, 2)];
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

export const combineItems = (
  level: number,
  ...items: Item[]
): Item | undefined => {
  if (length(items) < 3) return;
  return createItem(
    oneOf(doTimes(items, ([, , , colorID]) => colorID)),
    oneOf(doTimes(items, ([, , typeID]) => typeID)),
    level,
    min(3, min(...doTimes(items, ([, , , , rank]) => rank)) + 1),
  );
};
