const SECONDS_TO_MS = 1000;
const MINUTES_TO_SECONDS = 60;

const [
  MINOR_THIRD,
  MAJOR_THIRD,
  PERFECT_FIFTH,
  AUGMENTED_FIFTH,
  DIMINISHED_FIFTH,
] = [3, 4, 7, 8, 9];
const OCTAVE_SIZE = 12;
const MIDDLE_OCTAVE_NUMBER = 4;
const TRIAD_HARMONICS = {
  "°": [MINOR_THIRD, DIMINISHED_FIFTH],
  m: [MINOR_THIRD, PERFECT_FIFTH],
  M: [MAJOR_THIRD, PERFECT_FIFTH],
  "+": [MAJOR_THIRD, AUGMENTED_FIFTH],
};

const TUNING_HZ = 440;
const DURATION_INDEX = 1;

export const musicLoop = (
  sources: Record<string, (notes: number[], duration: number) => void>,
  getNextLoop: () => [instructions: string, tempo: number],
) => {
  const [instructions, tempo] = getNextLoop();
  const [parts, loopDurationS] = _parseLoop(
    instructions,
    tempo / MINUTES_TO_SECONDS,
  );

  for (const sourceName in parts) {
    parts[sourceName].map((event) => sources[sourceName](...event));
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
  for (const track of loop.split("\n")) {
    const { groups } = track.match(/(?<source>\w+):(?<part>).*/)!;

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

function _parsePart(part: string, beatLengthS: number) {
  const sourceCalls: SourceCall[] = [];

  let root: number | undefined, harmonics: number[] | undefined, beatCount = 0;
  const _flushEvent = () => {
    sourceCalls.push([
      [
        _getFrequency(root),
        ...harmonics!.map((offset) => _getFrequency(root! + offset)),
      ],
      beatCount * beatLengthS,
    ]);
    [root, harmonics, beatCount] = [undefined, undefined, 0];
  };

  for (const character of part.trim().replaceAll(/\s+/g, "")) {
    if (_between(character, "A", "G") || _between(character, "a", "g")) {
      _flushEvent();

      root = _between(character, "A", "G")
        ? _codeFor(character) - _codeFor("A")
        : _codeFor(character) - _codeFor("a");
    }

    if (_between(character, "1", "6")) {
      root = (Number(character) - MIDDLE_OCTAVE_NUMBER) * OCTAVE_SIZE;
    }

    if (character in TRIAD_HARMONICS) {
      harmonics = TRIAD_HARMONICS[character as keyof typeof TRIAD_HARMONICS];
    }
    if (character === "7") harmonics!.push(harmonics!.at(-1)! + MINOR_THIRD);
    if (character === "#") root!++;
    if (character === "♭") root!--;
    if (character === "*") beatCount++;
  }

  return sourceCalls;
}

function _codeFor(char: string) {
  return char.charCodeAt(0);
}

function _between(char: string, minChar: string, maxChar: string) {
  return _codeFor(minChar) <= _codeFor(char) &&
    _codeFor(char) <= _codeFor(maxChar);
}

function _getFrequency(noteDegree = 0) {
  return TUNING_HZ * 2 ** (noteDegree / OCTAVE_SIZE);
}
