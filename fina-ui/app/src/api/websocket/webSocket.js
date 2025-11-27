import { contextPath } from "../../util/appUtil";

const webSocket = (webSocketEndpoint, callback, wsConnectCallback) => {
  let appHost = window.location.host;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    appHost = "localhost:8380";
  }
  let appProtocol = window.location.protocol;

  appProtocol = appProtocol === "http:" ? "ws://" : "wss://";

  const webSocketUrl = `${appProtocol}${appHost}/${contextPath}/${webSocketEndpoint}`;
  const ws = new WebSocket(webSocketUrl);
  let worker;

  const pingEndpoint = () => {
    if (ws.readyState === WebSocket.OPEN) {
      console.debug(`Sending ping message to endpoint : ${webSocketEndpoint}`);
      ws.send("PING");
    } else {
      console.error("WebSocket Conn is closed " + ws);
    }
  };

  ws.onmessage = function (result) {
    if (result && result.data && result.data !== "PONG") {
      callback(result.data);
    }
  };
  ws.onopen = function () {
    // Send ping message every 3 minute default server idle timeout is 5 minutes
    worker = new Worker("wsWorker.js");
    worker.addEventListener("message", onWebWorkerMessage);
    if (wsConnectCallback) {
      wsConnectCallback(ws);
    }
    console.log("WS connected: " + webSocketEndpoint);
  };
  ws.onerror = function (error) {
    console.log("WebSocket Error:");
    console.log(error);
  };
  ws.onclose = function (event) {
    console.log("Remote host closed or refused WebSocket connection:");
    console.log(event);
    stopWebWorker();
  };

  const onWebWorkerMessage = (event) => {
    console.debug("PING - " + new Date(event.data));
    pingEndpoint();
  };

  const stopWebWorker = () => {
    if (worker) {
      worker.removeEventListener("error", onWebWorkerMessage);
      worker.terminate();
    }
  };
  return ws;
};

export default webSocket;
