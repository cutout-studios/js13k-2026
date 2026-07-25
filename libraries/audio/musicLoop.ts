import { MINUTES_TO_SECONDS, SECONDS_TO_MS } from "~common";

const [
  MINOR_THIRD,
  MAJOR_THIRD,
  PERFECT_FIFTH,
  AUGMENTED_FIFTH,
  DIMINISHED_FIFTH,
] = [3, 4, 7, 8, 9];
const SEMITONES_FROM_A: Record<string, number> = {
  A: 0,
  B: 2,
  C: 3,
  D: 5,
  E: 7,
  F: 8,
  G: 10,
};
const OCTAVE_SIZE = 12;
const MIDDLE_OCTAVE_NUMBER = 4;
const TRIAD_HARMONICS: Record<string, number[]> = {
  "°": [MINOR_THIRD, DIMINISHED_FIFTH],
  m: [MINOR_THIRD, PERFECT_FIFTH],
  M: [MAJOR_THIRD, PERFECT_FIFTH],
  "+": [MAJOR_THIRD, AUGMENTED_FIFTH],
};

const TUNING_HZ = 440;
const DURATION_INDEX = 1;

export const musicLoop = (
  sources: Record<
    string,
    (notes: number[], duration: number, offset: number) => void
  >,
  getNextLoop: () => [instructions: string, tempo: number],
) => {
  const [instructions, tempo] = getNextLoop();
  const [parts, loopDurationS] = _parseLoop(
    instructions,
    MINUTES_TO_SECONDS / tempo,
  );

  for (const sourceName in parts) {
    let offset = 0;
    for (const [notes, duration] of parts[sourceName]) {
      sources[sourceName]?.(notes, duration, offset);
      offset += duration;
    }
  }

  setTimeout(
    () => musicLoop(sources, getNextLoop),
    loopDurationS * SECONDS_TO_MS,
  );
};

type SourceCall = [notes: number[], duration: number];
export function _parseLoop(
  loop: string,
  beatLengthS: number,
): [Record<string, SourceCall[]>, number] {
  let length = 0;
  const parts: Record<string, [notes: number[], duration: number][]> = {};
  for (const track of loop.trim().split("\n")) {
    const { groups } = track.trim().match(/(?<source>\w+):(?<part>.*)/)!;

    const sourceCalls = _parsePart(
      groups!.part.trim().replaceAll(/\s+/g, " "),
      beatLengthS,
    );

    if (!length) {
      sourceCalls.forEach((event) => length += event[DURATION_INDEX]);
    }

    parts[groups!.source] = sourceCalls;
  }

  return [parts, length];
}

const _between = (c: string, min: string, max: string) => min <= c && c <= max;
function _parsePart(part: string, beatLengthS: number) {
  const sourceCalls: SourceCall[] = [];

  let root: number | undefined, harmonics: number[] | undefined, beatCount = 1;
  const _flushEvent = () => {
    if (root === undefined) return;
    sourceCalls.push([
      [
        _getFrequency(root),
        ...(harmonics ?? []).map((offset) => _getFrequency(root! + offset)),
      ],
      beatCount * beatLengthS,
    ]);
    [root, harmonics, beatCount] = [undefined, undefined, 1];
  };

  for (const character of part.replaceAll(/\s+/g, "")) {
    if (_between(character, "A", "G") || _between(character, "a", "g")) {
      _flushEvent();

      root = SEMITONES_FROM_A[character.toUpperCase()];
    }

    if (root !== undefined && _between(character, "1", "6")) {
      root += (Number(character) - MIDDLE_OCTAVE_NUMBER) * OCTAVE_SIZE;
    }

    if (character in TRIAD_HARMONICS) {
      harmonics = [...TRIAD_HARMONICS[character]];
    }
    if (character === "7") harmonics!.push(harmonics!.at(-1)! + MINOR_THIRD);
    if (character === "#") root!++;
    if (character === "♭") root!--;
    if (character === "*") beatCount++;
  }

  _flushEvent();

  return sourceCalls;
}

function _getFrequency(noteDegree = 0) {
  return TUNING_HZ * 2 ** (noteDegree / OCTAVE_SIZE);
}
