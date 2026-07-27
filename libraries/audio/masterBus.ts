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
