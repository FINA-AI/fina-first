import axiosInstance from "../axios";

const PREFIX = "/communicator/messages";

export const loadMessages = (page, limit, filterParams = {}) => {
  return axiosInstance.get(`${PREFIX}`, {
    params: {
      page: page,
      limit: limit,
      ...filterParams,
    },
  });
};

export const deleteMessages = (data) => {
  return axiosInstance.delete(`${PREFIX}`, { data });
};

export const saveMessage = (data) => {
  return axiosInstance.post(`${PREFIX}`, data);
};

export const sendSavedMessage = (messageId) => {
  return axiosInstance.post(`${PREFIX}/${messageId}/send`);
};

export const loadUserMessages = (
  messageId,
  page,
  pagingLimit,
  filterParams
) => {
  return axiosInstance.get(`/communicator/messages/${messageId}`, {
    params: {
      page: page,
      limit: pagingLimit,
      ...filterParams,
    },
  });
};

export const loadConversation = (
  messageId,
  userId,
  bookmarked,
  page,
  limit
) => {
  return axiosInstance.get(`${PREFIX}/conversation/${messageId}/${userId}`, {
    params: {
      bookmarked: bookmarked,
      page: page,
      limit: limit,
    },
  });
};

export const addNewMessage = (messageId, userId, message) => {
  return axiosInstance.post(
    `${PREFIX}/conversation/${messageId}/${userId}`,
    message
  );
};

export const editMessage = (messageId, userId, message) => {
  return axiosInstance.put(
    `${PREFIX}/conversation/${messageId}/${userId}`,
    message
  );
};

export const acceptMessage = (messageUserID, message) => {
  return axiosInstance.post(
    `${PREFIX}/conversation/message/accept/${messageUserID}`,
    message
  );
};

export const rejectMessage = (messageUserID, message) => {
  return axiosInstance.post(
    `${PREFIX}/conversation/message/reject/${messageUserID}`,
    message
  );
};

export const acceptRootMessage = (data) => {
  return axiosInstance.post(`${PREFIX}/root/message/accept`, data);
};

export const rejectRootMessage = (data) => {
  return axiosInstance.post(`${PREFIX}/root/message/reject`, data);
};

export const acceptConversationMessage = (messageUserId, message) => {
  return axiosInstance.post(
    `${PREFIX}/conversation/message/accept/${messageUserId}`,
    message
  );
};

export const rejectConversationMessage = (messageUserId, message) => {
  return axiosInstance.post(
    `${PREFIX}/conversation/message/reject/${messageUserId}`,
    message
  );
};

export const bookmarkMessage = (messageId, bookmarked) => {
  return axiosInstance.post(
    `${PREFIX}/thread/markRead/${messageId}`,
    {},
    {
      params: {
        markType: bookmarked,
      },
    }
  );
};

export const countUnreadMessages = () => {
  return axiosInstance.get(`${PREFIX}/count/unread`);
};

export const updateMessageStatus = (obj) => {
  return axiosInstance.put(`${PREFIX}/status`, obj);
};

export const markAllReadMessages = () => {
  return axiosInstance.post(`${PREFIX}/markAllRead`);
};

export const markAllReadThreads = (messageId) => {
  return axiosInstance.put(`${PREFIX}/thread/markRead/${messageId}`);
};

export const loadRootMessageRecipientUserIds = (messageId) => {
  return axiosInstance.get(`${PREFIX}/${messageId}/recipientIds`);
};

export const loadMessageAttachments = (messageId) => {
  return axiosInstance.get(`${PREFIX}/attachments/${messageId}`);
};

export const loadRecipientsData = (id) => {
  return axiosInstance.get(`${PREFIX}/recipients/${id}`);
};
