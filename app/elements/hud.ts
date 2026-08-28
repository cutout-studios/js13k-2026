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

import { _, length, round } from "~/alias";
import { doTimes, SECONDS_TO_MS } from "~/common";
import { createElement } from "~/dom";

import { Game } from "../game/types.ts";

import {
  CORNER,
  FLEX_COLUMN,
  FLEX_ROW,
  JUSTIFY,
  PADDED_FLEX_ROW,
} from "../styles.ts";

const FLEX_FILL = { flex: 1 };
const MIN_WIDTH = (width: number = 200) => ({ ["min-width"]: `${width}px` });

const _createMeter = (
  name: string,
  style: object[] = [],
): [HTMLElement, (meters: [max: number, value: number][]) => void] => {
  const meters = [createElement("meter", [FLEX_FILL]) as HTMLMeterElement];

  const element = createElement(
    "span",
    [FLEX_ROW, ...style],
    { id: name },
    createElement("label", _, { innerText: name }),
    ...meters,
  );

  return [element, (meterAttributes: [max: number, value: number][]) => {
    while (length(meters) < length(meterAttributes)) {
      meters.push(
        element.appendChild(
          createElement("meter", [FLEX_FILL]),
        ) as HTMLMeterElement,
      );
    }

    while (length(meters) < length(meterAttributes)) meters.pop()!.remove();

    doTimes(
      meters,
      (meter, index) => [meter.max, meter.value] = meterAttributes[index],
    );
  }];
};

const [fuelMeter, fuelUpdate] = _createMeter("F", [
    CORNER(false, true),
    MIN_WIDTH(),
  ]),
  [shieldMeter, shieldUpdate] = _createMeter("S", [MIN_WIDTH(350)]),
  [armorMeter, armorUpdate] = _createMeter("A", [
    CORNER(true, true),
    MIN_WIDTH(),
  ]);

const distanceCounter = createElement(
    "span",
    [CORNER(true)],
  ),
  waveCounter = createElement(
    "span",
    [CORNER()],
  );

export const hud = createElement(
  "nav",
  [FLEX_COLUMN, JUSTIFY("between"), {
    position: "absolute",
    inset: 0,
    ["pointer-events"]: "none",
  }],
  _,
  createElement(
    "header",
    [PADDED_FLEX_ROW, JUSTIFY()],
    _,
    fuelMeter,
    shieldMeter,
    armorMeter,
  ),
  createElement(
    "footer",
    [PADDED_FLEX_ROW, JUSTIFY()],
    _,
    distanceCounter,
    waveCounter,
  ),
);

let gameDuration = 0;
export const updateHUD = (
  [
    [[
      ,
      ,
      ,
      ,
      [shieldDamage, fuelDamage = 0, fuelSegmentDamage = 0, armorDamage = 0],
      _snapshot,
    ]],
    [, , [stage, wave, lastWave]],
  ]: Game,
  tickDuration: number,
) => {
  gameDuration += tickDuration;
  distanceCounter.innerText = `${round(gameDuration * SECONDS_TO_MS)}`.padStart(
    16,
    "0",
  );
  waveCounter.innerText = `${stage}, ${wave} / ${lastWave}`;

  armorUpdate(
    doTimes(_snapshot[0], (index: number) => [1, +(index >= armorDamage)]),
  );
  shieldUpdate([[_snapshot[15], _snapshot[15] - shieldDamage]]);
  fuelUpdate(
    doTimes(
      _snapshot[8],
      (
        index: number,
      ) => [
        _snapshot[4],
        index >= fuelSegmentDamage ? _snapshot[4] - fuelDamage : 0,
      ],
    ),
  );
};
