import { SECONDS_TO_MS } from "~common";
import { api } from "./api.ts";
import { masterBus } from "./masterBus.ts";

import { Envelope, Source } from "./types.ts";

export const createSource = (
  type: OscillatorType,
  envelope: Envelope = [[0, 0], [0, 1]],
): Source => {
  return (
    frequencies,
    durationMS,
    delayMS = 0,
    pan = 0,
  ) => {
    for (const frequency of frequencies) {
      const [oscillator, ampKnob, panKnob] = [
        api.createOscillator(),
        api.createGain(),
        api.createStereoPanner(),
      ];
      oscillator.type = type;
      oscillator.connect(ampKnob).connect(panKnob).connect(masterBus);

      const startTimeMS = (api.currentTime * SECONDS_TO_MS) + delayMS;
      oscillator.frequency.setValueAtTime(
        frequency,
        startTimeMS / SECONDS_TO_MS,
      );
      panKnob.pan.setValueAtTime(pan, startTimeMS / SECONDS_TO_MS);

      let elapsedTimeMS = startTimeMS;
      ampKnob.gain.setValueAtTime(0, elapsedTimeMS / SECONDS_TO_MS);
      for (const [timeBreakpointMS, velocityBreakpoint] of envelope) {
        elapsedTimeMS += timeBreakpointMS;
        ampKnob.gain.linearRampToValueAtTime(
          velocityBreakpoint,
          elapsedTimeMS / SECONDS_TO_MS,
        );
      }
      ampKnob.gain.linearRampToValueAtTime(
        0,
        (startTimeMS + durationMS) / SECONDS_TO_MS,
      );

      oscillator.start(startTimeMS / SECONDS_TO_MS);
      oscillator.stop((startTimeMS + durationMS) / SECONDS_TO_MS);
    }
  };
};
