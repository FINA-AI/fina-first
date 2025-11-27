import * as types from "../constants/communicatorWebsocketConstants";
import {
  COMMUNICATOR_MESSAGE_RECEIVED,
  MESSAGE_READ_STATUS_CHANGED,
} from "../constants/communicatorWebsocketConstants";
import webSocket from "../../api/websocket/webSocket";
import {
  handleMessageRead,
  handleOnMessageCallback,
} from "../../api/websocket/wsCommunicatorMessageProcessor";

const MESSAGES_WEB_SOCKET_ENDPOINT = "ws/communicator/message";

export const newMessageReceived = (data) => ({
  type: types.COMMUNICATOR_MESSAGE_RECEIVED,
  payload: data,
});

export const messageHasBeenRead = (data) => ({
  type: types.MESSAGE_READ_STATUS_CHANGED,
  payload: { ...data },
});

export const initCommunicatorWebSocketAction = () => {
  webSocket(MESSAGES_WEB_SOCKET_ENDPOINT, (message) => {
    try {
      const parsedData = JSON.parse(message);
      const messageType = parsedData?.type;

      switch (messageType) {
        case MESSAGE_READ_STATUS_CHANGED:
          handleMessageRead(parsedData);
          break;
        case COMMUNICATOR_MESSAGE_RECEIVED:
          handleOnMessageCallback(parsedData);
          break;
        default:
          console.error("unhandled messaggetype ", messageType);
      }
    } catch (e) {
      console.error(e);
    }
  });
};
