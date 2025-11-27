import {
  SEND_NOTIFICATION_TEXT,
  SET_NOTIFICATION_WS,
  HANDLE_RECEIVED_NOTIFICATION,
  SET_NOTIFICATION_COUNT,
} from "../constants/notificationWebsocketConstants";

export const InitialState = {
  notificationWs: null,
  unreadNotificationCount: 0,
};

export default function notificationWebsocketReducer(
  state = InitialState,
  action = {}
) {
  switch (action.type) {
    case SET_NOTIFICATION_WS:
      return {
        ...state,
        notificationWs: action.payload,
      };
    case SEND_NOTIFICATION_TEXT:
      state.notificationWs.send(action.payload);
      return {
        ...state,
        unreadNotificationCount:
          action.payload === "ALL" ? 0 : state.unreadNotificationCount - 1,
      };
    case HANDLE_RECEIVED_NOTIFICATION:
      return {
        ...state,
        unreadNotificationCount: state.unreadNotificationCount + action.payload,
      };
    case SET_NOTIFICATION_COUNT:
      return {
        ...state,
        unreadNotificationCount: action.payload,
      };
    default:
      return state;
  }
}
