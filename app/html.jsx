import { dom } from "~jsx";

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
      main {
        position: relative;
      }
      main, canvas, nav {
        display: block;
        width: 100vw;
        height: 100svh;
      }
      nav {
        position: absolute;
        top: 0;
        left: 0;
      }
    `}
    </style>
    <main>
      {canvas}
      <nav>
        {/* TBD: gui here */}
      </nav>
    </main>
  </>,
);
