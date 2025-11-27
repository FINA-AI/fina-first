import { newMessageReceived } from "../../redux/actions/communicatorWebsocketActions";
import { messageHasBeenRead } from "../../redux/actions/communicatorWebsocketActions";
import { store } from "../../App";

export const handleOnMessageCallback = (message) => {
  store.dispatch(newMessageReceived(message));
};

export const handleMessageRead = (message) => {
  store.dispatch(messageHasBeenRead(message));
};
