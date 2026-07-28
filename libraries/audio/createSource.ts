import { api } from "./api.ts";
import { masterBus } from "./masterBus.ts";

import { Envelope, Source } from "./types.ts";

// TODO: manually trigger a source in MS

export const createSource = (
  type: OscillatorType,
  envelope: Envelope = [[0, 0], [0, 1]],
): Source => {
  return (
    frequencies,
    duration,
    delay = 0,
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

      const startTime = api.currentTime + delay;
      oscillator.frequency.setValueAtTime(
        frequency,
        startTime,
      );
      panKnob.pan.setValueAtTime(pan, startTime);

      let elapsedTime = startTime;
      ampKnob.gain.setValueAtTime(0, elapsedTime);
      for (const [timeBreakpointMS, velocityBreakpoint] of envelope) {
        elapsedTime += timeBreakpointMS;
        ampKnob.gain.linearRampToValueAtTime(
          velocityBreakpoint,
          elapsedTime,
        );
      }
      ampKnob.gain.linearRampToValueAtTime(
        0,
        startTime + duration,
      );

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    }
  };
};
