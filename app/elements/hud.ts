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

import { length, round } from "~/alias";
import { doTimes, flat, repeat, SECONDS_TO_MS } from "~/common";
import { createElement, createTextNode, Style } from "~/dom";
import { WORDS } from "../game/ship/constants.ts";
import { Game } from "../game/types.ts";
import { AT, CONTENT, LAYOUT, OVERLAY, pct, TILT } from "./styles.ts";

const CONTROLS = [
  ["ESC", WORDS[25]],
  ["WASD", WORDS[21]],
  ["SPACE", WORDS[18]],
  ["CLICK", WORDS[22]],
];

const _createMeter = (
    innerText: string,
    style: Style[] = [],
  ): [HTMLElement, (meters: [max: number, value: number][]) => void] => {
    const meters = [
        createElement("meter", [{ flex: "1" }]) as HTMLMeterElement,
      ],
      element = createElement(
        [CONTENT()],
        style,
        createElement("label", { innerText }),
        ...meters,
      );
    return [element, (meterAttributes: [max: number, value: number][]) => {
      while (length(meters) < length(meterAttributes)) {
        meters.push(
          element.appendChild(createElement("meter")) as HTMLMeterElement,
        );
      }
      while (length(meters) > length(meterAttributes)) meters.pop()!.remove();
      doTimes(
        meters,
        (meter, index) => [meter.max, meter.value] = meterAttributes[index],
      );
    }];
  },
  [fuelMeter, fuelUpdate] = _createMeter(WORDS[5], [
    TILT(-1),
    AT("1/1", "start start"),
    { transformOrigin: "right bottom" },
  ]),
  [shieldMeter, shieldUpdate] = _createMeter(WORDS[17], [
    AT("1/2", "start center"),
    { width: pct(1) },
  ]),
  [armorMeter, armorUpdate] = _createMeter(WORDS[0], [
    TILT(1),
    AT("1/3", "start end"),
    { transformOrigin: "left bottom" },
  ]),
  distanceCounter = createElement([TILT(1), AT("2/1", "end start"), {
    transformOrigin: "right top",
  }]),
  waveCounter = createElement([TILT(-1), AT("2/3", "end end"), {
    transformOrigin: "left top",
  }]),
  controlLegend = createElement(
    [CONTENT(1), AT("3/1/4/4", "end center"), { opacity: "0.5" }],
    ...doTimes(
      CONTROLS,
      ([key, word]) =>
        createElement([CONTENT()], createTextNode(`[${key}]: ${word}`)),
    ),
  );

export const hud = createElement(
  flat(
    [LAYOUT(repeat(3, "1fr"), ["min-content", "1fr", "min-content"])],
    OVERLAY,
  ),
  fuelMeter,
  shieldMeter,
  armorMeter,
  distanceCounter,
  waveCounter,
  controlLegend,
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
    doTimes(_snapshot[8], (index: number) => [
      _snapshot[4],
      (_snapshot[8] - 1 - index) < fuelSegmentDamage
        ? 0
        : (_snapshot[8] - 1 - index) > fuelSegmentDamage
        ? _snapshot[4]
        : _snapshot[4] - fuelDamage,
    ]),
  );
};
