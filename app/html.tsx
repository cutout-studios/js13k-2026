import { documentFragment as fragment } from "~gui";

const CANVAS_FRAGMENT = fragment(<canvas></canvas>);

export const canvas = CANVAS_FRAGMENT.querySelector("canvas")!;

document.body.appendChild(fragment(
  <>
    <style>
      {/* css */ `
      html, body, main, main * { 
        all: initial;
        box-sizing: border-box;
        font-family: system-ui;
        overflow: hidden;
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
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
      }
    `}
    </style>
    <main>
      {CANVAS_FRAGMENT}
      <nav>
        {/* TBD: gui here */}
      </nav>
    </main>
  </>,
));
