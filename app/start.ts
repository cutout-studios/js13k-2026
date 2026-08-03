import { createRenderTarget, XOCamera } from "~3D";
import { startClock } from "~clock";
import { XOController } from "~controller";

import { CAMERA_CONTROLLER_MAP, CAMERA_STARTING_POINT } from "./constants.ts";
import { paintCube, theCubes } from "./theCubes.ts";
import { canvas } from "./html.tsx";
import { XOMusicBox, createAudioSource } from "~audio";

const camera = new XOCamera(), controller = new XOController();

camera.adjust(CAMERA_STARTING_POINT);

startClock((tickLength, totalClockTime) => {
  for (const inputKeyCode of controller.activeInputs) {
    camera.adjust(...(CAMERA_CONTROLLER_MAP[inputKeyCode]?.(tickLength) ?? []));
  }

  theCubes.forEach((cube, index) => {
    cube.adjust(undefined, [[tickLength, tickLength, tickLength], tickLength]);
    cube.material = paintCube(index + Math.floor(totalClockTime));
  });

  camera.render(theCubes, createRenderTarget(canvas));
});

const MUSICBOX_TEST_TEMPO = 200;
const MUSICBOX_TEST_SCORE = `
  melody: A5 * C#5 * E5 * C#5 * | A5  * D5 * -     -  E5 B5
  chords: AM * *   * *  * *   * | D3M * *  * E3M7  *  *  *  
  bass:   A2 * *   * *  * *   * | D1  * *  * E1    *  *  * 
`;

const musicbox = new XOMusicBox(
  {
    chords: createAudioSource("triangle"),
    bass: createAudioSource("sine"),
    melody: createAudioSource("sawtooth"),
  },
  MUSICBOX_TEST_SCORE,
  MUSICBOX_TEST_TEMPO,
);

addEventListener("keydown", () => {
  musicbox.start();
}, { once: true });