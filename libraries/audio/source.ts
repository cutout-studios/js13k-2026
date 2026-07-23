import { system } from "./system.ts";

export const create = (type: OscillatorType, envelope = [[0, 0], [0, 1]]) => {
  const [oscillator, ampKnob, panKnob] = [
    system.createOscillator(),
    system.createGain(),
    system.createStereoPanner(),
  ];

  oscillator.type = type;
  oscillator.connect(ampKnob).connect(panKnob).connect(system.destination);

  const _play = (frequency: number, durationS: number, delayS: number, direction: number) => {
    const startTimeS = system.currentTime + delayS;

    oscillator.frequency.value = frequency;

    let elapsedTimeS = startTimeS;
    ampKnob.gain.setValueAtTime(0, elapsedTimeS);
    panKnob.pan.setValueAtTime(direction, elapsedTimeS);
    for (const [timeBreakpointS, velocityBreakpoint] of envelope) {
      elapsedTimeS += timeBreakpointS;
      ampKnob.gain.linearRampToValueAtTime(
        velocityBreakpoint,
        elapsedTimeS,
      );
    }

    oscillator.start(startTimeS);
    oscillator.stop(startTimeS + durationS);
  };

  return (frequencies = [], durationS: number, delayS = 0, direction = 0) =>
    frequencies.forEach((frequency) => _play(frequency, durationS, delayS, direction));
};
