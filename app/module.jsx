import { dom, scene } from "~projections";
import { render } from "~webgpu";

import { frameLoop } from "./frameLoop.js";

const canvas = dom(
  <canvas></canvas>,
);

const html = dom(
  <>
    <h1>Hello, World!</h1>
    {canvas}
  </>,
);

for (const element of html) {
  document.body.appendChild(element);
}

frameLoop(() => render(canvas, scene(/* TODO */)));
