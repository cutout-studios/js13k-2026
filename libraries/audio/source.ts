import { system } from "./system.ts";

export const create = (type: OscillatorType, envelope = [[0, 0], [0, 1]]) => {
  return (
    frequencies = [],
    durationS: number,
    delayS = 0,
    direction = 0,
  ) => {
    for (const frequency of frequencies) {
      const [oscillator, ampKnob, panKnob] = [
        system.createOscillator(),
        system.createGain(),
        system.createStereoPanner(),
      ];
      oscillator.type = type;
      oscillator.connect(ampKnob).connect(panKnob).connect(system.destination);

      const startTimeS = system.currentTime + delayS;
      oscillator.frequency.setValueAtTime(frequency, startTimeS);
      panKnob.pan.setValueAtTime(direction, startTimeS);

      let elapsedTimeS = startTimeS;
      ampKnob.gain.setValueAtTime(0, elapsedTimeS);
      for (const [timeBreakpointS, velocityBreakpoint] of envelope) {
        elapsedTimeS += timeBreakpointS;
        ampKnob.gain.linearRampToValueAtTime(velocityBreakpoint, elapsedTimeS);
      }
      ampKnob.gain.linearRampToValueAtTime(0, startTimeS + durationS);

      oscillator.start(startTimeS);
      oscillator.stop(startTimeS + durationS);
    }
  };
};
