export const api = new AudioContext();

const unblock = () => api.resume();
addEventListener("keydown", unblock, { once: true });
addEventListener("pointerdown", unblock, { once: true });
