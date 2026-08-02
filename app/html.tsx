import { documentFragment as node } from "~web";

const canvasNode = node(<canvas></canvas>);

export const canvas = canvasNode.querySelector("canvas")!;

document.body.appendChild(node(
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
      {canvasNode}
      <nav>
        {/* TBD: gui here */}
      </nav>
    </main>
  </>,
));
