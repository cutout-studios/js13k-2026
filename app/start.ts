import { GameController, startGameLoop } from "~core";
import {
  createCubeGeometry,
  createRotationTransform,
  OBJECT_TRANSFORM_INDEX,
  scaleTransform,
  Scene,
  SceneObject,
} from "~scenes";
import { Viewport } from "~viewport";
import { createAudioSource, MusicBox } from "../libraries/audio/module.ts";

import { canvas, html } from "./html.tsx";
import {
  COMMAND_KEYMAP as COMMAND_KEYCODE_MAP,
  MUSICBOX_TEST_SCORE,
  MUSICBOX_TEST_TEMPO,
  VIEWPORT_COMMAND_ADJUSTMENT_MAP as VIEWPORT_ADJUSTMENT_MAP,
  VIEWPORT_STARTING_LOCATION,
} from "./constants.ts";

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

viewport.adjust(VIEWPORT_STARTING_LOCATION);
musicbox.play();

startGameLoop((deltaMS, clockMS) => {
  // Delegate input.
  for (const inputKeyCode of controller.inputs) {
    const command = COMMAND_KEYCODE_MAP[inputKeyCode];

    if (!command) continue;

    const viewportAdjustment = VIEWPORT_ADJUSTMENT_MAP[command];

    if (!viewportAdjustment) continue;

    viewport.adjust(scaleTransform(viewportAdjustment, deltaMS));
  }

  // Update cube rotation.
  cube[OBJECT_TRANSFORM_INDEX] = createRotationTransform([
    Math.sin(clockMS),
    Math.cos(clockMS),
    0,
  ], Math.PI / 2);

  viewport.snapshot(scene);
});
