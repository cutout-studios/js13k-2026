import { GameController, startGameLoop } from "~core";
import {
  createCubeGeometry,
  createRotationTransform,
  OBJECT_TRANSFORM_INDEX,
  Scene,
  SceneObject,
} from "~scenes";
import { Viewport } from "~viewport";
import { createAudioSource, MusicBox } from "../libraries/audio/module.ts";

import { canvas, html } from "./html.tsx";
import {
  COMMAND_KEYCODE_MAP,
  MUSICBOX_TEST_SCORE,
  MUSICBOX_TEST_TEMPO,
  VIEWPORT_ADJUSTMENT_MAP,
  VIEWPORT_STARTING_ADJUSTMENT,
} from "./constants.ts";
import { SECONDS_TO_MS } from "~common";

document.body.appendChild(html);

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

// Adjust back from origin.
viewport.adjust(VIEWPORT_STARTING_ADJUSTMENT);

// Generally not good practice to start audio until
// first user input has been received.
addEventListener("keydown", () => {
  musicbox.play();
}, { once: true });

startGameLoop((deltaMS, clockMS) => {
  // Delegate input.
  for (const inputKeyCode of controller.inputs) {
    const command = COMMAND_KEYCODE_MAP[inputKeyCode];

    if (command === undefined) continue;

    const viewportAdjustment = VIEWPORT_ADJUSTMENT_MAP[command];

    if (viewportAdjustment === undefined) continue;

    viewport.adjust(viewportAdjustment(deltaMS));
  }

  // Update cube rotation.
  cube[OBJECT_TRANSFORM_INDEX] = createRotationTransform([
    Math.sin(clockMS / SECONDS_TO_MS),
    Math.cos(clockMS / SECONDS_TO_MS),
    0,
  ], Math.PI / 2);

  viewport.snapshot(scene);
});
