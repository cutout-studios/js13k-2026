import { dom } from "~projections/dom.ts";

const html = dom(
  <h1>Hello, World!</h1>
);

for(const element of html) {
  document.body.appendChild(element);
}
