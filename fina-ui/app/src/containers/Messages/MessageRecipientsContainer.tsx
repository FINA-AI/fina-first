import React, { useEffect, useState } from "react";
import {
  loadRecipientsData,
  loadUserMessages,
  markAllReadThreads,
  updateMessageStatus,
} from "../../api/services/messagesService";
import { connect } from "react-redux";
import { updateUnreadMessageCounterAction } from "../../redux/actions/messagesActions";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import MessageRecipientsGrid from "../../components/Messages/Recipients/MessageRecipientsGrid";
import {
  ConversationMessage,
  MessageFilterType,
  MessageReadStatus,
  RecipientFilterType,
  RecipientType,
  RootMessageType,
} from "../../types/messages.type";
import { CommunicatorStatusType } from "../../types/communicator.common.type";

export interface MessageRecipientsContainerProps {
  setSelectedUserConversation: (recipient: RecipientType) => void;
  selectedMessage: RootMessageType | null;
  closeMessageUserCard: () => void;
  messageStatus: CommunicatorStatusType;
  loadingMask: boolean;
  setLoadingMask: (loading: boolean) => void;
  messages: RootMessageType[];
  setMessages: (messages: RootMessageType[]) => void;
  unreadMessageCount: number;
  setUnreadMessageCount: (value: number) => void;
  currentMessageData: RootMessageType;
  markSelectedRootMessageAsRead: () => void;
  filterObject: MessageFilterType;
  messageReadStatus: MessageReadStatus;
  recipients: RecipientType[];
  filteredRecipient: RecipientType[] | null;
  setFilteredRecipient: (recipients: RecipientType[] | null) => void;
  setRecipients: React.Dispatch<React.SetStateAction<RecipientType[]>>;
  updateRecipientStatus: (status: string, index: number) => void;
  conversation: ConversationMessage[];
  setConversation: React.Dispatch<React.SetStateAction<ConversationMessage[]>>;
}

const MessageRecipientsContainer: React.FC<MessageRecipientsContainerProps> = ({
  setSelectedUserConversation,
  selectedMessage,
  closeMessageUserCard,
  messageStatus,
  loadingMask,
  setLoadingMask,
  messages,
  setMessages,
  setUnreadMessageCount,
  unreadMessageCount,
  currentMessageData,
  markSelectedRootMessageAsRead,
  filterObject,
  messageReadStatus,
  recipients,
  setRecipients,
  filteredRecipient,
  setFilteredRecipient,
  updateRecipientStatus,
  conversation,
  setConversation,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [messagesLength, setMessagesLength] = useState(0);
  const [page, setPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [recipientData, setRecipientData] = useState([]);
  const [selectedItem, setSelectedItem] = useState<RecipientType | null>(null);
  const [filterObj, setFilterObj] = useState({});

  useEffect(() => {
    const readMessageUserId = messageReadStatus.readMessageUserId;
    const readRootMessageId = messageReadStatus.readMessageId;
    if (
      selectedItem &&
      selectedItem?.id === readMessageUserId &&
      selectedItem?.messageId === readRootMessageId
    ) {
      onMessageRead(readMessageUserId, readRootMessageId);
      updateChatMessageReadDate();
    }
  }, [messageReadStatus]);

  useEffect(() => {
    if (page > 1) {
      setPage(1);
    } else {
      initMessages(filterObj);
    }
  }, [selectedMessage]);

  useEffect(() => {
    initMessages(filterObj);
  }, [page, pagingLimit, messageStatus]);

  useEffect(() => {
    if (selectedMessage) {
      getRecipientData();
      setFilteredRecipient(null);
    } else {
      setFilterObj({});
    }
  }, [selectedMessage?.id]);

  useEffect(() => {
    if (currentMessageData !== null) {
      setRecipients((prevRecipients) =>
        prevRecipients.map((recipient) => {
          if (recipient.id === currentMessageData?.replyToUserId) {
            return {
              ...recipient,
              lastConversationMessage: currentMessageData.content,
            };
          }
          return recipient;
        })
      );
    }
  }, [currentMessageData]);

  const onPagingLimitChange = (limit: number) => {
    setPage(1);
    setPagingLimit(limit);
  };

  const onRecipientMessageSelect = (recipient: RecipientType) => {
    if (recipient.new && selectedMessage) {
      selectedMessage.newMessages = selectedMessage.newMessages - 1;
      setMessages(
        messages.map((msg) => {
          if (msg.id === selectedMessage.id) {
            return selectedMessage;
          }
          return msg;
        })
      );

      updateMessageStatus(recipient);

      recipient.new = false;
      if (selectedMessage?.newMessages === 0) {
        if (unreadMessageCount > 0) {
          setUnreadMessageCount(unreadMessageCount - 1);
        }
      }
    }
  };

  const onMessageRead = (
    readMessageUserId: number,
    readRootMessageId: number
  ) => {
    const data = filteredRecipient ?? recipients;

    const itemIndex = data.findIndex(
      (item) =>
        item.id === readMessageUserId && item.messageId === readRootMessageId
    );

    updateRecipientStatus("READ", itemIndex);
  };

  const updateChatMessageReadDate = () => {
    if (conversation && conversation.length > 0) {
      const lastConversation = conversation[conversation.length - 1];
      if (lastConversation) {
        lastConversation.readDate = Date.now();
        setConversation([...conversation]);
      }
    }
  };

  const initMessages = async (recipientFilter: RecipientFilterType) => {
    if (selectedMessage && selectedMessage.id) {
      setLoadingMask(true);

      let filter = {};

      if (Object.entries(recipientFilter).length === 0) {
        const { authors: _authors, ...restFilterObject } = filterObject;
        filter = { ...restFilterObject };
      } else {
        filter = { ...recipientFilter };
      }

      setFilterObj(filter);

      const res = await loadUserMessages(
        selectedMessage.id,
        page,
        pagingLimit,
        filter
      );
      const data = res.data;
      if (data) {
        if (recipientFilter) {
          setFilteredRecipient(data.list);
        } else {
          setRecipients(data.list);
        }
        setMessagesLength(data["totalResults"]);
        setLoadingMask(false);
      }
    } else {
      setRecipients([]);
      setMessagesLength(0);
    }
  };

  const onClearRecipients = () => {
    setMessagesLength(0);
    setRecipients([]);
    setRecipientData([]);
    setFilterObj({});
    setPage(1);
  };

  const onMarkAllReadThreads = () => {
    setLoadingMask(true);
    markAllReadThreads(selectedMessage?.id)
      .then(() => {
        initMessages(filterObj);
        markSelectedRootMessageAsRead();
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoadingMask(false);
      });
  };

  const getRecipientData = async () => {
    try {
      const res = await loadRecipientsData(selectedMessage?.id);
      setRecipientData(res.data);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  return (
    <MessageRecipientsGrid
      data={filteredRecipient || recipients}
      page={page}
      pagingLimit={pagingLimit}
      onPagingLimitChange={onPagingLimitChange}
      setPage={setPage}
      dataLength={messagesLength}
      closeCardFunction={closeMessageUserCard}
      setSelectedRecipient={setSelectedUserConversation}
      onClearRecipients={onClearRecipients}
      loading={loadingMask}
      onRecipientMessageSelect={onRecipientMessageSelect}
      onMarkAllReadThreads={onMarkAllReadThreads}
      selectedRootMessage={selectedMessage}
      recipients={recipientData}
      initData={initMessages}
      setRecipientData={setRecipientData}
      setFilteredRecipient={setFilteredRecipient}
      selectedItem={selectedItem}
      setSelectedItem={setSelectedItem}
    />
  );
};

const mapStateToProps = (state: any) => ({
  messageStatus: state.get("messages").messageStatus,
  unreadMessageCount: state.getIn(["messages", "unreadMessageCount"]),
  messageReadStatus: state.getIn(["communicatorWebsocket", "communicator"])[
    "messageReadStatus"
  ],
});

const mapDispatchToProps = (dispatch: any) => ({
  setUnreadMessageCount: bindActionCreators(
    updateUnreadMessageCounterAction,
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageRecipientsContainer);
