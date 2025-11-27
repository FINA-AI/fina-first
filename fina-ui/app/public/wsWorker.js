const PING_PONG_INTERVAL = 60 * 1000;

setInterval(() => {
  postMessage(Date.now());
}, PING_PONG_INTERVAL);
