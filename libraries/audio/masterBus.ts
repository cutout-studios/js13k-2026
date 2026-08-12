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

import { api } from "./api.ts";

import {
  MASTER_BUS_COMPRESSION_ATTACK,
  MASTER_BUS_COMPRESSION_KNEE,
  MASTER_BUS_COMPRESSION_RATIO,
  MASTER_BUS_COMPRESSION_RELEASE,
  MASTER_BUS_COMPRESSION_THRESHOLD,
  MASTER_BUS_LOWPASS_FREQUENCY,
  MASTER_BUS_LOWPASS_SPREAD,
} from "./constants.ts";

const [output, lowpass, compression] = [
  api.createGain(),
  api.createBiquadFilter(),
  api.createDynamicsCompressor(),
];

lowpass.type = "lowpass";
lowpass.frequency.value = MASTER_BUS_LOWPASS_FREQUENCY;
lowpass.Q.value = MASTER_BUS_LOWPASS_SPREAD;

compression.threshold.value = MASTER_BUS_COMPRESSION_THRESHOLD;
compression.knee.value = MASTER_BUS_COMPRESSION_KNEE;
compression.ratio.value = MASTER_BUS_COMPRESSION_RATIO;
compression.attack.value = MASTER_BUS_COMPRESSION_ATTACK;
compression.release.value = MASTER_BUS_COMPRESSION_RELEASE;

output.connect(lowpass).connect(compression).connect(api.destination);

export const masterBus = output;
