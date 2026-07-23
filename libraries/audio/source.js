import { system } from "./system.js";

export const create = (type, envelope = [0, 1]) => {
  const [oscillator, ampKnob, panKnob] = [
    system.createOscillator(),
    system.createGain(),
    system.createPanner(),
  ];

  oscillator.type = type;
  oscillator.connect(ampKnob).connect(panKnob).connect(system.destination);

  const _play = (frequency, durationS, direction) => {
    const startTimeS = system.currentTime;

    oscillator.frequency.value = frequency;
    panKnob.pan = direction;

    let elapsedTimeS = startTimeS;
    ampKnob.gain.setValueAtTime(0, elapsedTimeS);
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

  return (frequencies = [], durationS, direction = 0) =>
    frequencies.forEach((frequency) => _play(frequency, durationS, direction));
};
