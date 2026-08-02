import { MINUTES_TO_SECONDS, SECONDS_TO_MS } from "~common";

import {
  Frequency,
  ScaleDegree,
  ScoreText,
  Source,
  Tempo,
  Timing,
} from "./types.ts";

import { getFrequency } from "./getFrequency.ts";

import {
  DURATION_INDEX,
  MIDDLE_OCTAVE_NUMBER,
  MINOR_THIRD,
  OCTAVE_SIZE,
  SEMITONE_OFFSET,
  TRIAD_HARMONICS,
} from "./constants.ts";
import { api } from "./api.ts";

type SourceCall = [frequencies: Frequency[], duration: Timing];
type SourceInstructions = Record<string, SourceCall[]>;

const _copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const _between = <T>(target: T, min: T, max: T) =>
  min <= target && target <= max;

export class XOMusicBox {
  sources: Record<string, Source>;
  tempo: Tempo;

  #isPlaying: boolean = false;
  #currentScoreDuration: Timing | undefined;
  #currentInstructions: SourceInstructions | undefined;

  constructor(
    sources: Record<string, Source>,
    score: ScoreText,
    tempo: Tempo,
  ) {
    this.sources = sources;
    this.tempo = tempo;
    this.score = score;
  }

  set score(score: ScoreText) {
    [this.#currentInstructions, this.#currentScoreDuration] = this.#parseScore(
      score,
      MINUTES_TO_SECONDS / this.tempo,
    );
  }

  async start() {
    if (this.#isPlaying) return;
    this.#isPlaying = true;

    // Ensures the audio clock is actually running,
    // otherwise we get stuttering while waiting for it to load.
    await api.resume();

    const _loop = () => {
      for (const sourceName in this.#currentInstructions) {
        let offset = 0;
        for (const [notes, duration] of this.#currentInstructions[sourceName]) {
          this.sources[sourceName]?.(notes, duration, offset, 0);
          offset += duration;
        }
      }

      setTimeout(
        _loop,
        this.#currentScoreDuration! * SECONDS_TO_MS,
      );
    };

    _loop();
  }

  #parseScore(
    scoreText: ScoreText,
    beatLength: Timing,
  ): [Record<string, SourceCall[]>, Timing] {
    let length = 0;
    const instructions: SourceInstructions = {};
    for (const track of scoreText.trim().split("\n")) {
      const { groups } = track.trim().match(/(?<source>\w+):(?<part>.*)/)!;

      const sourceCalls = this.#parsePart(
        groups!.part.trim().replaceAll(/\s+/g, " "),
        beatLength,
      );

      if (!length) { // We assume all tracks are the same length.
        sourceCalls.forEach((event) => length += event[DURATION_INDEX]);
      }

      instructions[groups!.source] = sourceCalls;
    }

    return [instructions, length];
  }

  #parsePart(part: ScoreText, beatLength: Timing) {
    const sourceCalls: SourceCall[] = [];

    let root: ScaleDegree | undefined,
      harmonics: ScaleDegree[] = [],
      beatCount = 0;
    const _flushEvent = () => {
      if (beatCount === 0) return;
      sourceCalls.push([
        root !== undefined
          ? [
            getFrequency(root),
            ...harmonics.map((offset) => getFrequency(root! + offset)),
          ]
          : [/* rest */],
        beatCount * beatLength,
      ]);
      [root, harmonics, beatCount] = [undefined, [], 0];
    };

    for (const character of part.replaceAll(/\s+/g, "")) {
      if (_between(character, "A", "G") || _between(character, "a", "g")) {
        _flushEvent();

        root = SEMITONE_OFFSET[character.toUpperCase()];
        beatCount++;
      }

      if (root !== undefined && _between(character, "1", "6")) {
        root += (Number(character) - MIDDLE_OCTAVE_NUMBER) * OCTAVE_SIZE;
      }

      if (character in TRIAD_HARMONICS) {
        harmonics = _copy(TRIAD_HARMONICS[character]);
      }
      if (character === "7") harmonics!.push(harmonics!.at(-1)! + MINOR_THIRD);
      if (character === "#") root!++;
      if (character === "♭") root!--;
      if (character === "*") beatCount++;
      if (character === "-") {
        _flushEvent();
        beatCount++;
      }
    }

    _flushEvent();

    return sourceCalls;
  }
}
