import { dom } from "~jsx";

export const canvas = dom(
  <canvas></canvas>,
)[0]; // TODO: only return one node in this case?

export const html = dom(
  <>
    <style>
      {/* css */ `
      html, body, main, main * { 
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
