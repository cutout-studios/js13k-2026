import { startClock } from "~clock";
import { Controller } from "~controller";
import { createCubeGeometry, createObject, setObjectTransform } from "~objects";
import { createRotation } from "~transforms";
import { Viewport } from "~viewport";
import { createAudioSource, MusicBox } from "~audio";

import { canvas } from "./html.tsx";
import {
  MUSICBOX_TEST_SCORE,
  MUSICBOX_TEST_TEMPO,
  VIEWPORT_CONTROLLER_MAP,
  VIEWPORT_STARTING_POINT,
} from "./constants.ts";

const controller = new Controller();
const viewport = new Viewport(canvas);
const musicbox = new MusicBox(
  {
    chords: createAudioSource("triangle"),
    bass: createAudioSource("sine"),
    melody: createAudioSource("sawtooth"),
  },
  MUSICBOX_TEST_SCORE,
  MUSICBOX_TEST_TEMPO,
);

// The Cube™
const cube = createObject({
  geometry: createCubeGeometry(),
});

// Adjust back to the starting point so we can view
// The Cube™.
viewport.adjust(VIEWPORT_STARTING_POINT);

startClock((tickLength, totalClockTime) => {
  for (const inputKeyCode of controller.activeInputs) {
    const amountToAdjustBy = VIEWPORT_CONTROLLER_MAP[inputKeyCode];

    if (amountToAdjustBy === undefined) continue;

    viewport.adjust(amountToAdjustBy(tickLength));
  }

  setObjectTransform(
    cube,
    createRotation([
      Math.sin(totalClockTime),
      Math.cos(totalClockTime),
      0,
    ], Math.PI / 2),
  );

  viewport.render([cube]);
});

// Best practice to start audio only once
// first user input has been received.
addEventListener("keydown", () => {
  musicbox.start();
}, { once: true });
