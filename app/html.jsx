import { dom } from "~projections";

export const canvas = dom(
  <canvas></canvas>,
);

export const html = dom(
  <>
    <style>
      {/* css */ `
      * { 
        all: initial;
        box-sizing: border-box;
        font-family: system-ui;
      }
      main, canvas {
        display: block;
        width: 100vw;
        height: 100svh;
      }
    `}
    </style>
    <main>
      {canvas}
    </main>
  </>,
);
