import { render } from "~webgpu";
import { createObject, createRotationTransform } from "~objects";

import { frameLoop } from "./frameLoop.js";
import { canvas, html } from "./html.jsx";

for (const element of html) {
  document.body.appendChild(element);
}

frameLoop(() => {
  const [objects, now] = [[], Date.now()];

  objects.push(
    createObject({
      transform: createRotationTransform(
        [Math.sin(now), Math.cos(now), 0],
        Math.PI / 2,
      ),
    }),
  );

  render(canvas, objects);
});
