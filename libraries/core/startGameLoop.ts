let loopID: number;
export const startGameLoop = (
  onLoop: (deltaMS: number, clockMS: number) => void,
) => {
  const start = performance.now();
  let last = performance.now();
  loopID = requestAnimationFrame(() => {
    const now = performance.now();
    onLoop(now - last, now - start);
    last = now;
  });

  return () => cancelAnimationFrame(loopID);
};
