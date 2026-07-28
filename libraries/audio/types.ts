export type Frequency = number; // Hz.
export type Timing = number; // Seconds!
export type Pan = number; // -1 to 1.
export type ScaleDegree = number;
export type Magnitude = number;

export type Source = (
  frequencies: Frequency[],
  duration: Timing,
  delay: Timing,
  pan: Pan,
) => void;

export type ScoreText = string;
export type Tempo = number;

export type Envelope = [timing: Timing, magnitude: Magnitude][];
