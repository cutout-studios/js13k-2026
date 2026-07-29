import { SECONDS_TO_MS } from "~common";

export const startClock = (
  onLoop: (tickLength: number, totalClockTime: number) => void,
) => {
  const start = performance.now() / SECONDS_TO_MS;
  let last = start;

  let loopID: number;
  const tick = (now: number) => {
    now /= SECONDS_TO_MS;
    onLoop(now - last, now - start);
    last = now;
    loopID = requestAnimationFrame(tick);
  };

  loopID = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(loopID);
};
