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

// import { length, min } from "~/alias";
// import { doTimes } from "~/common";
// import { bell } from "~/random";

// import { Item } from "./types.ts";
// import {
//   COLORS,
//   ITEM_DATA_BANDS,
//   ITEM_NAMES,
//   ITEM_RANK_FALLOFF,
//   ITEM_RANK_THRESHOLDS,
//   ITEM_WEAPON_DATA_NAMES,
//   PLAYER_SHEET_OPTIONS,
// } from "../options/constants.ts";

// import { levelCurve, roll as levelRoll } from "../world/module.ts";
// import { createDeck, drawCard, insertCard } from "../decks.ts";

// const _itemRankRoll = (
//   level: number,
//   quality = 0,
//   roll = bell() + levelCurve(level) + quality,
// ) => ITEM_RANK_THRESHOLDS.filter((threshold) => roll >= threshold).length + 1;

// const _itemDeck = createDeck(length(ITEM_NAMES));
// export const drawItem = (
//   colorType: number,
//   level: number,
//   quality = 0,
// ): ItemData => {
//   const [
//     ,
//     ,
//     mass,
//     ,
//     [count, damage, life, rate, bonusAffix, cost, bulletPattern],
//     affixes,
//   ] = COLORS[colorType];
//   const rank = _itemRankRoll(level, quality), type = drawCard(_itemDeck);
//   const pool: number[] = [];
//   for (const option of [...affixes[0]!, ...(affixes[type + 1] ?? [])]) {
//     insertCard(pool, option);
//   }

//   const affixCount = (type <= 1 ? rank - 1 : rank) + (bonusAffix ? 1 : 0);

//   const proxy = { damage, life, rate, cost, mass, affix: 0 };
//   const roll = (key: keyof typeof ITEM_DATA_BANDS, magnitude = proxy[key]) =>
//     levelRoll( // "stage" is "rank" in this instance
//       ITEM_DATA_BANDS[key][magnitude - 1],
//       (rank - 1) / 2,
//       ITEM_RANK_FALLOFF,
//     );

//   const result: Item = [
//     colorType,
//     type,
//     rank,
//     roll("mass"),
//     doTimes(min(affixCount, length(pool)), (): ItemAffix => {
//       const name = pool.pop()!,
//         [, affixType, magnitude] = PLAYER_SHEET_OPTIONS[name];
//       return [
//         name,
//         affixType === 2 ? magnitude * rank : roll("affix", magnitude),
//       ];
//     }) as ItemAffix[],
//   ];

//   if (type <= 1) { // e.g. is weapon
//     result.push(
//       count,
//       ...ITEM_WEAPON_DATA_NAMES.map((value) => roll(value)),
//       bulletPattern,
//     );
//   }

//   return result;
// };
