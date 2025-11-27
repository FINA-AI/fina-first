import * as types from "../constants/notificationWebsocketConstants";
import webSocket from "../../api/websocket/webSocket";
import { store } from "../../App";

const NOTIFICATION_WEB_SOCKET_ENDPOINT = "ws/notification";

export const setNotificationWs = (ws) => ({
  type: types.SET_NOTIFICATION_WS,
  payload: ws,
});

export const sendText = (text) => ({
  type: types.SEND_NOTIFICATION_TEXT,
  payload: text,
});

export const handleReceivedMessage = (message) => ({
  type: types.HANDLE_RECEIVED_NOTIFICATION,
  payload: message,
});

export const setUnreadNotificationCount = (count) => ({
  type: types.SET_NOTIFICATION_COUNT,
  payload: count,
});

export const initNotificationWebSocketAction = () => {
  webSocket(
    NOTIFICATION_WEB_SOCKET_ENDPOINT,
    () => {
      store.dispatch(handleReceivedMessage(1));
    },
    (ws) => {
      store.dispatch(setNotificationWs(ws));
    }
  );
};
