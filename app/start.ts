import { GameController, startGameLoop } from "~core";
import {
  createCubeGeometry,
  createRotationTransform,
  OBJECT_TRANSFORM_INDEX,
  Scene,
  SceneObject,
} from "~scenes";
import { Viewport } from "~viewport";
import { createAudioSource, MusicBox } from "~audio";

import { canvas } from "./html.tsx";
import {
  MUSICBOX_TEST_SCORE,
  MUSICBOX_TEST_TEMPO,
  VIEWPORT_CONTROLLER_MAP,
  VIEWPORT_STARTING_POINT,
} from "./constants.ts";

const viewport = new Viewport(canvas);
const cube: SceneObject = [createCubeGeometry()];
const scene: Scene = [cube];
const controller = new GameController();
const musicbox = new MusicBox(
  {
    chords: createAudioSource("triangle"),
    bass: createAudioSource("sine"),
    melody: createAudioSource("sawtooth"),
  },
  MUSICBOX_TEST_SCORE,
  MUSICBOX_TEST_TEMPO,
);

// Adjust back to the starting point so we can view
// the cube.
viewport.adjust(VIEWPORT_STARTING_POINT);

startGameLoop((elapsedTime, totalTime) => {
  // Handle controller input.
  for (const inputKeyCode of controller.inputs) {
    const amountToAdjustBy = VIEWPORT_CONTROLLER_MAP[inputKeyCode];

    if (amountToAdjustBy === undefined) continue;

    viewport.adjust(amountToAdjustBy(elapsedTime));
  }

  // Update the cube's rotation.
  cube[OBJECT_TRANSFORM_INDEX] = createRotationTransform([
    Math.sin(totalTime),
    Math.cos(totalTime),
    0,
  ], Math.PI / 2);

  // Snap the scene from the viewport.
  viewport.snapshot(scene);
});

// Best practice to start audio only once
// first user input has been received.
addEventListener("keydown", () => {
  musicbox.start();
}, { once: true });
