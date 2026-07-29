import { startClock } from "~clock";
import { Controller } from "~controller";
import {
  createCubeGeometry,
  createObject,
  paint,
  setTransform,
} from "~objects";
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
import { repeat } from "~common";

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
const POLYGONS_PER_CUBE_FACE = 2;
const [RED, GREEN, BLUE] = [0xff0000, 0x00ff00, 0x0000ff];
const cube = createObject({
  geometry: createCubeGeometry(),
  material: paint(
    repeat(POLYGONS_PER_CUBE_FACE, RED),
    repeat(POLYGONS_PER_CUBE_FACE, GREEN),
    repeat(POLYGONS_PER_CUBE_FACE, BLUE),
  ),
});

// TODO: additional cubes, for sanity

// Adjust back to the starting point so we can view
// The Cube™.
viewport.adjust(VIEWPORT_STARTING_POINT);

startClock((tickLength, totalClockTime) => {
  for (const inputKeyCode of controller.activeInputs) {
    const amountToAdjustBy = VIEWPORT_CONTROLLER_MAP[inputKeyCode];

    if (amountToAdjustBy === undefined) continue;

    viewport.adjust(amountToAdjustBy(tickLength));
  }

  setTransform(
    cube,
    createRotation([
      Math.sin(totalClockTime),
      Math.cos(totalClockTime),
      0,
    ], Math.PI / 2),
  );

  // TODO: update material

  viewport.render([cube]);
});

// Best practice to start audio only once
// first user input has been received.
addEventListener("keydown", () => {
  musicbox.start();
}, { once: true });
