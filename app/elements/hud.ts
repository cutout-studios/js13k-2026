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
import { createElement, DEFAULT_STYLES } from "~/dom";

// import { GameState } from "../state/types.ts";

import {
  FLEX_COLUMN,
  FLEX_ROW,
  FULL_SIZE,
  NUDGE,
  PADDED_FLEX_ROW,
} from "../styles.ts";
import { PLAYER_STATISTICS } from "../state/constants.ts";

const _tilt = (amount: number) => ({
  ...DEFAULT_STYLES,
  transform: `rotate(${amount}deg);`,
});
const [TILT_LEFT, TILT_RIGHT] = [30, -30].map(_tilt);

const [DEFAULT_ARMOR, DEFAULT_FUEL, DEFAULT_SHIELD] = [0, 11, 21].map((index) =>
  PLAYER_STATISTICS[index].at(-1) as number
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
  [FULL_SIZE, FLEX_COLUMN, {
    ["pointer-events"]: "none",
    position: "absolute",
    top: 0,
    left: 0,
  }],
  undefined,
  createElement(
    "header",
    [PADDED_FLEX_ROW],
    undefined,
    _createMeter([
      "F",
      DEFAULT_FUEL,
      DEFAULT_FUEL,
      DEFAULT_FUEL / 15,
    ], [TILT_RIGHT, NUDGE(2.5)]),
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
    ], [TILT_LEFT, NUDGE(2.5)]),
  ),
  createElement(
    "footer",
    [PADDED_FLEX_ROW],
    undefined,
    createElement(
      "span",
      [TILT_LEFT, NUDGE(2.5, "bottom")],
      { id: "D" },
      "".padStart(16, "0"),
    ),
    createElement(
      "span",
      [TILT_RIGHT, NUDGE(2.5, "bottom")],
      { id: "W" },
      "0, 0",
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
