import Chat from "../../components/Messages/Chat/Chat";
import React, { useEffect, useRef, useState } from "react";
import {
  acceptConversationMessage,
  acceptRootMessage,
  addNewMessage,
  bookmarkMessage,
  loadConversation,
  rejectConversationMessage,
  rejectRootMessage,
} from "../../api/services/messagesService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeMessageStatus } from "../../redux/actions/messagesActions";
import { MessageStatus } from "../../components/Messages/messageStatus";
import {
  ConversationMarkType,
  ConversationMessage,
  RecipientType,
  RootMessageType,
} from "../../types/messages.type";
import { CommAttachmentType } from "../../types/communicator.common.type";
import { Config } from "../../types/config.type";

export interface ChatContainerProps {
  closeMessageConversationCard: () => void;
  selectedMessageId: number;
  selectedUserConversation: RecipientType | null;
  config: Config;
  setSelectedUserConversation: React.Dispatch<
    React.SetStateAction<RecipientType | null>
  >;
  setMessagesStatus: (message: ConversationMessage) => void;
  setCurrentMessageData: React.Dispatch<React.SetStateAction<RootMessageType>>;
  selectedMessage: RootMessageType;
  recipients: RecipientType[];
  updateRecipientStatus: (status: string, itemIndex: number) => void;
  conversation: ConversationMessage[];
  setConversation: React.Dispatch<React.SetStateAction<ConversationMessage[]>>;
  newReceivedMessage: RootMessageType;
}

export type ChatDataType = {
  login?: string;
  name?: string;
};

const pagingConf = { start: 0, limit: 100 };

const ChatContainer: React.FC<ChatContainerProps> = ({
  closeMessageConversationCard,
  selectedMessageId,
  selectedUserConversation,
  setSelectedUserConversation,
  setMessagesStatus,
  setCurrentMessageData,
  selectedMessage,
  recipients,
  updateRecipientStatus,
  conversation,
  setConversation,
  newReceivedMessage,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const scrollRef = useRef<any>();
  const chatEndRef = useRef<any>(null);
  const isScrollBottom = true;
  const chatData = {
    login: selectedUserConversation?.login,
    name: selectedUserConversation?.name,
  };

  const [paging, setPaging] = useState(pagingConf);
  const [messageCount, setMessageCount] = useState(0);
  const [_isLoading, setIsLoading] = useState(false);
  const chatStatus = selectedUserConversation?.status;
  const [afterLoadFunction, setAfterLoadFunction] = useState<Function>();
  const [isSendBtnDisabled, setIsSendBtnDisabled] = useState(false);
  const [attachments, setAttachments] = useState<CommAttachmentType[]>([]);
  const [openBox, setOpenBox] = useState(false);

  useEffect(() => {
    const { rootMessageId, userLogin } = newReceivedMessage;
    if (
      rootMessageId > 0 &&
      rootMessageId === selectedMessageId &&
      userLogin === selectedUserConversation?.login
    ) {
      getConversation();
      return;
    }
    getConversation();
    setPaging(pagingConf);
  }, [selectedMessageId, selectedUserConversation, newReceivedMessage]);

  const scrollToBottomFunc = () => {
    chatEndRef.current?.scrollIntoView({
      block: "end",
      inline: "nearest",
    });
  };

  const scrollTrackFunc = () => {
    if (
      conversation.length > 0 &&
      scrollRef !== null &&
      scrollRef.current.scrollTop === 0
    ) {
      let scWidth = scrollRef.current.scrollWidth;
      let scHeight = scrollRef.current.scrollHeight;

      if (paging.start + paging.limit >= messageCount) {
        return;
      }

      setPaging({
        ...paging,
        start: paging.start + paging.limit,
      });

      setAfterLoadFunction(() => {
        scrollRef.current.scrollTo(
          scWidth,
          scrollRef.current.scrollHeight - scHeight
        );
      });
    }
  };

  const getConversation = () => {
    setIsLoading(true);
    loadConversation(selectedMessageId, selectedUserConversation?.id)
      .then((resp) => {
        if (resp.data.list.length > 0) {
          //update root message readDate from MessageUser
          const rootMessage = resp.data.list[0];
          rootMessage.readDate = selectedUserConversation?.readDate;
        }
        setConversation(resp.data.list);
        setMessageCount(resp.data.totalResults);

        const messageList: ConversationMessage[] = resp.data.list;
        let firstMessage = messageList.find((m) => m.id === selectedMessage.id);
        if (!isScrollBottom) {
          const concatenated = [...messageList, ...conversation];
          firstMessage
            ? setConversation(concatenated)
            : setConversation([selectedMessage as any, ...concatenated]);
        } else {
          firstMessage
            ? setConversation(messageList)
            : setConversation([selectedMessage as any, ...messageList]);
        }

        if (afterLoadFunction) {
          afterLoadFunction();
        }
        if (isScrollBottom) {
          scrollToBottomFunc();
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onAddMessageClick = (message: string, attachments: File[]) => {
    let requestObject = {
      content: message,
      replyToId: selectedUserConversation?.messageId,
      title: "",
    };

    const formData = new FormData();
    formData.append(
      "message",
      new Blob([JSON.stringify(requestObject)], {
        type: "application/json",
      })
    );
    if (attachments) {
      for (let i = 0; i < attachments.length; i++) {
        formData.append(`attachment_${i}`, attachments[i], attachments[i].name);
        formData.append(`fileName_${i}`, attachments[i].name);
      }
    }

    setIsLoading(true);
    addNewMessage(
      selectedUserConversation?.messageId,
      selectedUserConversation?.id,
      formData
    )
      .then((resp) => {
        setConversation([...conversation, resp.data]);
        scrollRef.current.scrollTo(
          scrollRef.current.scrollWidth,
          scrollRef.current.scrollHeight
        );
        setIsSendBtnDisabled(false);
        setCurrentMessageData(resp.data);
        setOpenBox(false);
        setAttachments([]);
        const itemIndex = recipients.findIndex(
          (item) =>
            item.id === selectedUserConversation?.id &&
            item.messageId === selectedUserConversation?.messageId
        );

        updateRecipientStatus("SENT", itemIndex);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setIsLoading(false);
        setIsSendBtnDisabled(true);
      });
  };

  const accept = (message: ConversationMessage) => {
    setConversation(
      conversation.map((m) =>
        m.id === message.id ? { ...m, status: "OUTBOX" } : m
      )
    );
    if (selectedUserConversation) {
      setSelectedUserConversation({
        ...selectedUserConversation,
        status: "SENT",
      });
    }
    setMessagesStatus(message);
    enqueueSnackbar(t("accepted"), {
      variant: "success",
    });
  };

  const reject = (message: ConversationMessage) => {
    setConversation(
      conversation.map((m) =>
        m.id === message.id ? { ...m, status: "REJECTED" } : m
      )
    );
    if (selectedUserConversation) {
      setSelectedUserConversation({
        ...selectedUserConversation,
        status: "REJECTED",
      });
    }
    setMessagesStatus(message);
    enqueueSnackbar(t("rejected"), {
      variant: "success",
    });
  };

  const onAcceptClick = (message: ConversationMessage) => {
    setIsLoading(true);
    if (message.status === MessageStatus.PENDING && message?.replyToId > 0) {
      acceptConversationMessage(selectedUserConversation?.id, message)
        .then(() => {
          accept(message);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      acceptRootMessage({ id: selectedMessageId })
        .then(() => {
          accept(message);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const onRejectClick = (message: ConversationMessage) => {
    setIsLoading(true);
    if (message.status === MessageStatus.PENDING && message?.replyToId > 0) {
      rejectConversationMessage(selectedUserConversation?.id, message)
        .then(() => {
          reject(message);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      rejectRootMessage({ id: selectedMessageId })
        .then(() => {
          reject(message);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const onBookmarkClick = (
    messageId: number,
    mark: ConversationMarkType | null
  ) => {
    setIsLoading(true);
    bookmarkMessage(messageId, mark)
      .then(() => {
        setConversation(
          conversation.map((m) =>
            m.id === messageId ? { ...m, markType: mark } : m
          )
        );
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Chat
      closeMessageConversationCard={closeMessageConversationCard}
      chatData={chatData}
      chatStatus={chatStatus}
      conversation={conversation}
      setConversation={setConversation}
      onAddMessageClick={onAddMessageClick}
      onAcceptClick={onAcceptClick}
      onRejectClick={onRejectClick}
      scrollTrackFunc={scrollTrackFunc}
      scrollRef={scrollRef}
      selectedUserConversation={selectedUserConversation}
      onBookmarkClick={onBookmarkClick}
      selectedMessageId={selectedMessageId}
      isSendBtnDisabled={isSendBtnDisabled}
      setIsSendBtnDisabled={setIsSendBtnDisabled}
      attachments={attachments}
      setAttachments={setAttachments}
      openBox={openBox}
      setOpenBox={setOpenBox}
    />
  );
};

const mapStateToProps = (state: any) => ({
  config: state.get("config").config,
});

const mapDispatchToProps = (dispatch: any) => ({
  setMessagesStatus: bindActionCreators(changeMessageStatus, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);
