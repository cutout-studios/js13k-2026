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
import { createElement } from "~/dom";

// import { GameState } from "../state/types.ts";

import {
  CORNER,
  FLEX_COLUMN,
  FLEX_ROW,
  JUSTIFY,
  PADDED_FLEX_ROW,
} from "../styles.ts";
import { PLAYER_SHEET_OPTIONS } from "../state/constants.ts";

const [DEFAULT_ARMOR, DEFAULT_FUEL, DEFAULT_SHIELD] = [0, 11, 21].map((index) =>
  PLAYER_SHEET_OPTIONS[index][3] as number
);

const _createMeter = (
  [name, limit, value, segments = 1]: [
    name: string,
    limit: number,
    value: number,
    segments?: number,
  ],
  style: object[] = [],
) =>
  createElement(
    "span",
    [FLEX_ROW, ...style],
    { id: name },
    createElement("label", undefined, { innerText: name }),
    ...doTimes(segments, (index) =>
      createElement("meter", undefined, {
        max: limit / segments,
        value: value - limit / segments * index,
      })),
  );

export const hud = createElement(
  "nav",
  [FLEX_COLUMN, JUSTIFY("between"), {
    position: "absolute",
    inset: 0,
    ["pointer-events"]: "none",
  }],
  undefined,
  createElement(
    "header",
    [PADDED_FLEX_ROW, JUSTIFY()],
    undefined,
    _createMeter([
      "F",
      DEFAULT_FUEL,
      DEFAULT_FUEL,
      DEFAULT_FUEL / 15,
    ], [CORNER(false, true)]),
    _createMeter([
      "S",
      DEFAULT_SHIELD,
      DEFAULT_FUEL,
    ]),
    _createMeter([
      "A",
      DEFAULT_ARMOR,
      DEFAULT_ARMOR,
      DEFAULT_ARMOR,
    ], [CORNER(true, true)]),
  ),
  createElement(
    "footer",
    [PADDED_FLEX_ROW, JUSTIFY()],
    undefined,
    createElement(
      "span",
      [CORNER(true)],
      { id: "D" },
      "".padStart(16, "0"),
    ),
    createElement(
      "span",
      [CORNER()],
      { id: "W" },
      "1, 1",
    ),
  ),
);

// export const updateHUD = ([[ship, [, , stats]], world]: GameState) => {
//   const [stage, wave, distance] = world;
//   const { damage: [shieldDamage, fuelDamage, armorDamage] } = ship;
//   const fuel = stats[11], armor = stats[0], shield = stats[21];

//   hud.querySelector("#F")!.value = fuel - fuelDamage;
//   hud.querySelector("#S")!.value = shield - shieldDamage;
//   hud.querySelector("#T")!.value = armor - armorDamage;

//   hud.querySelector("#W")!.innerText = `${stage}, ${wave}`;
//   hud.querySelector("#D")!.innerText = `${distance}`.padStart(16, "0");
// };
