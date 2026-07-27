export type Frequency = number;
export type Timing = number;
export type Pan = number;
export type ScaleDegree = number;
export type Magnitude = number;

export type Source = (
  frequencies: Frequency[],
  durationMS: Timing,
  delayMS: Timing,
  pan: Pan,
) => void;

export type ScoreText = string;
export type Tempo = number;

export type Envelope = [timing: Timing, magnitude: Magnitude][];
