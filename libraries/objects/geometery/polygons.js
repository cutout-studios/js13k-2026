export const VERTICIES_PER_TRIANGLE = 3;

export const vertex = (x, y, z) => [x, y, z, 1];
export const triangle = (p1, p2, p3) => [p1, p2, p3].flat();
// deno-fmt-ignore
export const quadrangle = (p1, p2, p3, p4) => 
  [triangle(p1, p2, p3), triangle(p2, p3, p4)];
