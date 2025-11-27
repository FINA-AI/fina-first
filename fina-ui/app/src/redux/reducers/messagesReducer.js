import {
  COMMUNICATOR_MESSAGE_STATUS_CHANGE,
  COMMUNICATOR_UNREAD_MESSAGE_CHANGE,
} from "../constants/messagesConstants";

const initialState = {
  messageStatus: {},
  unreadMessageCount: 0,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case COMMUNICATOR_MESSAGE_STATUS_CHANGE:
      return {
        ...state,
        messageStatus: action.payload,
      };
    case COMMUNICATOR_UNREAD_MESSAGE_CHANGE:
      return {
        ...state,
        unreadMessageCount: action.payload,
      };
    default:
      return state;
  }
}
