export const startGameLoop = (
  onLoop: (deltaMS: number, clockMS: number) => void,
) => {
  const start = performance.now();
  let last = start;

  let loopID: number;
  const tick = (now: number) => {
    onLoop(now - last, now - start);
    last = now;
    loopID = requestAnimationFrame(tick);
  };

  loopID = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(loopID);
};
