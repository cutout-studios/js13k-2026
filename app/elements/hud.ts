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
import { doTimes, SECONDS_TO_MS } from "~/common";
import { createElement } from "~/dom";
import { Game } from "../game/types.ts";
import {
  distanceCounter,
  gasMeter,
  hpMeter,
  rezMeter,
  waveCounter,
} from "./handles.ts";

const _meterUpdate = (element: HTMLElement) => {
    const meters: HTMLMeterElement[] = [];
    return (meterAttributes: [max: number, value: number][]) => {
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
    };
  },
  gasUpdate = _meterUpdate(gasMeter),
  hpUpdate = _meterUpdate(hpMeter),
  rezUpdate = _meterUpdate(rezMeter);

let gameDuration = 0;

export const updateHUD = (
  [
    [[
      ,
      ,
      ,
      ,
      [damage, gasUsed = 0, cansUsed = 0, rez = 0],
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
  rezUpdate(
    doTimes(_snapshot[0], (index: number) => [1, +(index >= rez)]),
  );
  hpUpdate([[_snapshot[15], _snapshot[15] - damage]]);
  gasUpdate(
    doTimes(_snapshot[8], (index: number) => [
      _snapshot[4],
      (_snapshot[8] - 1 - index) < cansUsed
        ? 0
        : (_snapshot[8] - 1 - index) > cansUsed
        ? _snapshot[4]
        : _snapshot[4] - gasUsed,
    ]),
  );
};
