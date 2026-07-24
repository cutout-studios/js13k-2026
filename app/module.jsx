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
  { test: createAudioSource("square") },
  () => ["test: a b c d e f g", 60],
);
