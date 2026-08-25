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

import { ceil, min, round } from "~/alias";
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

const _createMeter = (
  name: string,
  style: object[] = [],
): [HTMLElement, (meters: [max: number, value: number][]) => void] => {
  const meters = [createElement("meter") as HTMLMeterElement];

  const element = createElement(
    "span",
    [FLEX_ROW, ...style],
    { id: name },
    createElement("label", undefined, { innerText: name }),
    ...meters,
  );

  return [element, (meterAttributes: [max: number, value: number][]) => {
    while (meters.length < meterAttributes.length) {
      meters.push(
        element.appendChild(createElement("meter")) as HTMLMeterElement,
      );
    }

    while (meters.length < meterAttributes.length) meters.pop()!.remove();

    meters.forEach((meter, index) =>
      [meter.max, meter.value] = meterAttributes[index]
    );
  }];
};

const [fuelMeter, fuelUpdate] = _createMeter("F", [CORNER(false, true)]),
  [shieldMeter, shieldUpdate] = _createMeter("S"),
  [armorMeter, armorUpdate] = _createMeter("A", [CORNER(true, true)]);

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
  undefined,
  createElement(
    "header",
    [PADDED_FLEX_ROW, JUSTIFY()],
    undefined,
    fuelMeter,
    shieldMeter,
    armorMeter,
  ),
  createElement(
    "footer",
    [PADDED_FLEX_ROW, JUSTIFY()],
    undefined,
    distanceCounter,
    waveCounter,
  ),
);

let gameDuration = 0;
export const updateHUD = (
  [
    [[, , [shieldDamage, fuelDamage, armorDamage]], [, , data]],
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

  armorUpdate(doTimes(data[0], (index) => [1, +(index < armorDamage)]));
  shieldUpdate([[data[21], data[21] - shieldDamage]]);
  fuelUpdate(
    doTimes(
      ceil(data[11] / FUEL_SEGMENT_SIZE),
      () => {
        const result = [
          FUEL_SEGMENT_SIZE,
          min(FUEL_SEGMENT_SIZE, fuelDamage),
        ] as [number, number];

        fuelDamage -= FUEL_SEGMENT_SIZE;

        return result;
      },
    ),
  );
};
