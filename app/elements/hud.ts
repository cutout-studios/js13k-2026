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

import { GameState } from "../state/types.ts";

import { DEFAULTS, FLEX_COLUMN, FLEX_ROW, FULL_SIZE } from "../styles.ts";

const _tilt = (amount: number) => ({ transform: `rotate(${amount}deg);` });
const [TILT_LEFT, TILT_RIGHT] = [30, -30].map(_tilt);

export const createHUD = (
  [[ship, [, , stats]], world]: GameState,
) => {
  const [stage, wave, distance] = world;
  const { damage: [shieldDamage, fuelDamage, armorDamage] } = ship;
  const fuel = stats[11], armor = stats[0], shield = stats[21];

  return createElement(
    "nav",
    {
      position: "absolute",
      top: 0,
      left: 0,
      ...FULL_SIZE,
      ...FLEX_COLUMN,
      ["pointer-events"]: "none",
    },
    undefined,
    createElement(
      "header",
      FLEX_ROW,
      undefined,
      _createMeter(TILT_LEFT, {
        name: "F",
        limit: fuel,
        value: fuel - fuelDamage,
        segments: fuel / 15,
      }),
      _createMeter({}, {
        name: "S",
        limit: shield,
        value: shield - shieldDamage,
      }),
      _createMeter(TILT_RIGHT, {
        name: "A",
        limit: armor,
        segments: armor,
        value: armor - armorDamage,
      }),
    ),
    createElement(
      "footer",
      FLEX_ROW,
      undefined,
      createElement(
        "span",
        { ...DEFAULTS, ...TILT_RIGHT },
        undefined,
        `${distance}`.padStart(16, "0"),
      ),
      createElement(
        "span",
        { ...DEFAULTS, ...TILT_LEFT },
        undefined,
        `${stage}, ${wave}`,
      ),
    ),
  );
};

const _createMeter = (
  style: object,
  { name, limit, value, segments = 1 }: {
    name: string;
    limit: number;
    value: number;
    segments?: number;
  },
) =>
  createElement(
    "span",
    { ...DEFAULTS, ...FLEX_ROW, ...style },
    undefined,
    createElement("label", { innerText: name }),
    ...doTimes(segments, (index) =>
      createElement("meter", {
        max: limit / segments,
        value: value - limit / segments * index,
      })),
  );
