import { startClock } from "~clock";
import { Controller } from "~controller";
import { setMaterial, setTransform } from "~objects";
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
import { getCubeAdjustment, getCubePaint, theCubes } from "./theCubes.ts";

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

viewport.adjust(VIEWPORT_STARTING_POINT);

startClock((tickLength, totalClockTime) => {
  for (const inputKeyCode of controller.activeInputs) {
    const amountToAdjustBy = VIEWPORT_CONTROLLER_MAP[inputKeyCode];
    if (amountToAdjustBy === undefined) continue;
    viewport.adjust(amountToAdjustBy(tickLength));
  }

  const spin = createRotation(
    [Math.sin(totalClockTime), Math.cos(totalClockTime), 0],
    Math.PI / 2,
  );

  theCubes.forEach((cube, index) => {
    setTransform(
      cube,
      getCubeAdjustment(index, spin),
    );
    setMaterial(cube, getCubePaint(index + Math.floor(totalClockTime)));
  });

  viewport.render(theCubes);
});

// Best practice to start audio only once
// first user input has been received.
addEventListener("keydown", () => {
  musicbox.start();
}, { once: true });
