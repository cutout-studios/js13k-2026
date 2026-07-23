import { renderLoop } from "~graphics";
import { createAudioSource, musicLoop } from "~audio";
import { createObject, createRotation } from "~objects";

import { canvas, html } from "./html.jsx";

for (const element of html) {
  document.body.appendChild(element);
}

renderLoop(canvas, () => {
  const [objects, now] = [[], Date.now()];

  objects.push(
    createObject({
      transform: createRotation(
        [Math.sin(now), Math.cos(now), 0],
        Math.PI / 2,
      ),
    }),
  );

  return objects;
});

musicLoop(
  { test: createAudioSource("square") },
  () => ["test: a b c d e f g", 60],
);
