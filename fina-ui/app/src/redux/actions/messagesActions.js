import * as types from "../constants/messagesConstants";

export const changeMessageStatus = (messageStatus) => ({
  type: types.COMMUNICATOR_MESSAGE_STATUS_CHANGE,
  payload: messageStatus,
});

export const updateUnreadMessageCounterAction = (count) => ({
  type: types.COMMUNICATOR_UNREAD_MESSAGE_CHANGE,
  payload: count,
});
