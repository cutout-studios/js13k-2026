import { renderLoop } from "~graphics";
import { createAudioSource, musicLoop } from "~audio";
import { createObject, createRotation } from "~objects";

import { updateCamera } from "./camera.ts";
import { canvas, html } from "./html.jsx";

for (const element of html) {
  document.body.appendChild(element);
}

const cube = createObject();

let totalTime = 0;
renderLoop(canvas, (deltaTime) => {
  totalTime += deltaTime;

  cube.transform = createRotation(
    [Math.sin(totalTime), Math.cos(totalTime), 0],
    Math.PI / 2,
  );

  return {
    objects: [cube],
    camera: updateCamera(deltaTime),
  };
});

musicLoop(
  {
    chords: createAudioSource("triangle"),
    bass: createAudioSource("sine"),
    melody: createAudioSource("sawtooth"),
  },
  () => [
    `
    melody: A5 * C#5 * E5 * C#5 * | A5  * D5 * *     *  E5 B5
    chords: AM * *   * *  * *   * | D3M * *  * E3M7  *  *  *  
    bass:   A2 * *   * *  * *   * | D1  * *  * E1    *  *  * 
  `,
    200,
  ],
);
