import {
  COMMUNICATOR_MESSAGE_RECEIVED,
  MESSAGE_READ_STATUS_CHANGED,
} from "../constants/communicatorWebsocketConstants";

export const InitialState = {
  communicator: {
    newMessageCounter: 0,
    newMessage: {
      rootMessageId: 0,
      userLogin: "",
    },

    messageReadStatus: {
      readMessageId: 0,
      readMessageUserId: 0,
    },
  },
};

export default function communicatorWebsocketReducer(
  state = InitialState,
  action = {}
) {
  switch (action.type) {
    case COMMUNICATOR_MESSAGE_RECEIVED:
      return {
        ...state,
        communicator: {
          ...state.communicator,
          newMessageCounter: state.communicator.newMessageCounter + 1,
          newMessage: {
            ...state.communicator.newMessage,
            rootMessageId: action.payload.rootMessageId,
            userLogin: action.payload.author,
          },
        },
      };
    case MESSAGE_READ_STATUS_CHANGED:
      return {
        ...state,
        communicator: {
          ...state.communicator,
          messageReadStatus: {
            ...state.communicator.messageReadStatus,
            readMessageId: action.payload?.rootMessageId,
            readMessageUserId: action.payload?.userId,
          },
        },
      };
    default:
      return state;
  }
}
