import MessagesMainGrid from "./MessagesMainGrid";
import { Box, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import RecipientsContainer from "../../containers/Messages/MessageRecipientsContainer";
import ChatContainer from "../../containers/Messages/ChatContainer";
import {
  loadMessages,
  markAllReadMessages,
} from "../../api/services/messagesService";
import { connect } from "react-redux";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { getFormattedDateValue } from "../../util/appUtil";
import withLoading from "../../hoc/withLoading";
import { bindActionCreators } from "@reduxjs/toolkit";
import { updateUnreadMessageCounterAction } from "../../redux/actions/messagesActions";
import { keyframes, styled } from "@mui/material/styles";
import {
  ConversationMessage,
  MessageFilterType,
  RecipientType,
  RootMessageType,
} from "../../types/messages.type";
import { CommunicatorStatusType } from "../../types/communicator.common.type";

interface MessagesPageProps {
  messageStatus: CommunicatorStatusType;
  newMessageCounter: number;
  setUnreadMessageCount: (num: number) => void;
  unreadMessageCount: number;
  newMessage: RootMessageType;
}

const StyledRoot = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.mainLayout,
}));

const StyledHeaderText = styled(Typography)(({ theme }: { theme: any }) => ({
  ...theme.pageTitle,
}));

const StyledPapaer = styled(Paper)({
  borderRadius: 4,
  width: "100%",
  height: "100%",
  boxShadow: "none",
});

const StyledGridContainer = styled(Grid)({
  boxSizing: "border-box",
  marginTop: 0,
  paddingTop: 0,
  overflow: "hidden",
  borderRadius: 4,
  height: "100%",
});

const StyledGridItem = styled(Grid)({
  paddingTop: "0px !important",
  height: "100%",
  overflow: "hidden",
  flex: 0,
  transition: "400ms",
});

const conversationAnimation = keyframes({
  "0%": {
    opacity: 0,
  },
  "100%": {
    opacity: 1,
  },
});
const StyledConversation = styled(Box)({
  opacity: 1,
  animation: `'${conversationAnimation}' 2.5s ease-in-out`,
});

const MessagesPage: React.FC<MessagesPageProps> = ({
  messageStatus,
  newMessageCounter,
  setUnreadMessageCount,
  unreadMessageCount,
  newMessage,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const [loadingMask, setLoadingMask] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [messages, setMessages] = useState<RootMessageType[]>([]);
  const [messagesLength, setMessagesLength] = useState(0);
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [loading, setLoading] = useState(true);
  const [currentMessageData, setCurrentMessageData] = useState<RootMessageType>(
    {} as RootMessageType
  );
  const filterDataRef = useRef<MessageFilterType>({} as MessageFilterType);
  const gridContainerRef = useRef<any>(null);
  const [recipients, setRecipients] = useState<RecipientType[]>([]);
  const [filteredRecipient, setFilteredRecipient] = useState<
    RecipientType[] | null
  >(null);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [selectedMessage, setSelectedMessage] =
    useState<RootMessageType | null>(null);
  const [selectedUserConversation, setSelectedUserConversation] =
    useState<RecipientType | null>(null);

  useEffect(() => {
    loadMessagesFunction(filterDataRef.current);
  }, [pagingPage, pagingLimit, filterValue, messageStatus, newMessageCounter]);

  const onFilterChange = (filterObj: MessageFilterType) => {
    if (filterObj["dateAfter"]) {
      filterObj["dateAfter"] = getFormattedDateValue(
        filterObj["dateAfter"],
        "dd/MM/yyyy"
      );
    }

    if (filterObj["dateBefore"]) {
      filterObj["dateBefore"] = getFormattedDateValue(
        filterObj["dateBefore"],
        "dd/MM/yyyy"
      );
    }

    filterDataRef.current = { ...filterObj };
    if (pagingPage === 1) {
      loadMessagesFunction(filterObj);
    }
    setPagingPage(1);
  };

  const loadMessagesFunction = (filterObj: MessageFilterType) => {
    let filterData = { ...filterDataRef.current };

    setLoading(true);

    const filterParams = {
      ...filterObj,
    };

    if (filterValue && filterValue.trim().length > 0) {
      filterParams.contains = filterValue;
    }

    loadMessages(pagingPage, pagingLimit, filterParams ?? filterData)
      .then((resp) => {
        let data = resp.data;
        if (data) {
          setMessagesLength(data.totalResults);
          setMessages([...data.list]);
        }

        if (gridContainerRef.current) {
          gridContainerRef.current.scrollTo(0, 0);
        }
        setLoading(false);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const closeMessageConversationCard = () => {
    setSelectedUserConversation(null);
  };

  const closeMessageUserCard = () => {
    setSelectedUserConversation(null);
    setSelectedMessage(null);
  };

  const getMessageCardFlex = () => {
    return selectedUserConversation ? 4 : 6;
  };

  const getMessageUserCardFlex = () => {
    return selectedUserConversation ? 4 : 6;
  };

  const getMessageConversationCardFlex = () => {
    return selectedUserConversation ? 4 : 0;
  };

  const markSelectedRootMessageAsRead = () => {
    const findSelectedMessage = messages.find(
      (message) => message.id === selectedMessage?.id
    );

    if (findSelectedMessage) {
      findSelectedMessage.new = false;
      findSelectedMessage.newMessages = 0;
    }
    unreadMessageCount > 0 && setUnreadMessageCount(unreadMessageCount - 1);
    setMessages([...messages]);
  };

  const onMarkAllReadMessages = () => {
    markAllReadMessages()
      .then(() => {
        setUnreadMessageCount(0);
        loadMessagesFunction(filterDataRef.current);
        if (selectedMessage) {
          setSelectedMessage({ ...selectedMessage });
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };
  const updateRecipientCardStatus = (status: string, itemIndex: number) => {
    const recipientsData: RecipientType[] = filteredRecipient ?? recipients;
    if (itemIndex !== -1) {
      const updatedItem = { ...recipientsData[itemIndex], status: status };

      const updatedData = [...recipientsData];
      updatedData[itemIndex] = updatedItem;
      filteredRecipient
        ? setFilteredRecipient(updatedData)
        : setRecipients(updatedData);
    }
  };

  return (
    <StyledRoot>
      <StyledHeaderText> {t("messages")}</StyledHeaderText>
      <StyledGridContainer
        container
        spacing={1}
        height={"100%"}
        direction={"row"}
        xs={12}
        item
      >
        <StyledGridItem item style={{ flex: getMessageCardFlex() }}>
          <StyledPapaer>
            <MessagesMainGrid
              activeMessage={selectedMessage}
              setActiveMessage={(selectedMessage: RootMessageType | null) => {
                setSelectedMessage(selectedMessage);
                //TODO
                setSelectedUserConversation(null);
              }}
              setLoadingMask={setLoadingMask}
              messages={messages}
              messagesLength={messagesLength}
              pagingPage={pagingPage}
              setPagingPage={(page: number) => {
                setPagingPage(page);
                setSelectedUserConversation(null);
              }}
              pagingLimit={pagingLimit}
              setPagingLimit={setPagingLimit}
              setFilterValue={setFilterValue}
              loadMessagesFunction={loadMessagesFunction}
              loading={loading}
              onFilterChange={onFilterChange}
              onMarkAllReadMessages={onMarkAllReadMessages}
              gridContainerRef={gridContainerRef}
              closeMessageUserCard={closeMessageUserCard}
            />
          </StyledPapaer>
        </StyledGridItem>

        <StyledGridItem item style={{ flex: getMessageUserCardFlex() }}>
          <StyledPapaer>
            <RecipientsContainer
              setSelectedUserConversation={setSelectedUserConversation}
              selectedMessage={selectedMessage}
              closeMessageUserCard={closeMessageUserCard}
              loadingMask={loadingMask}
              setLoadingMask={setLoadingMask}
              messages={messages}
              setMessages={setMessages}
              currentMessageData={currentMessageData}
              markSelectedRootMessageAsRead={markSelectedRootMessageAsRead}
              filterObject={filterDataRef.current}
              recipients={recipients}
              setRecipients={setRecipients}
              filteredRecipient={filteredRecipient}
              conversation={conversation}
              setConversation={setConversation}
              setFilteredRecipient={setFilteredRecipient}
              updateRecipientStatus={updateRecipientCardStatus}
            />
          </StyledPapaer>
        </StyledGridItem>
        <StyledGridItem item style={{ flex: getMessageConversationCardFlex() }}>
          <StyledPapaer>
            {selectedUserConversation !== null && selectedMessage && (
              <StyledConversation width={"100%"} height={"100%"}>
                <ChatContainer
                  closeMessageConversationCard={closeMessageConversationCard}
                  selectedMessageId={selectedMessage.id}
                  selectedMessage={selectedMessage}
                  selectedUserConversation={selectedUserConversation}
                  setSelectedUserConversation={setSelectedUserConversation}
                  setCurrentMessageData={setCurrentMessageData}
                  recipients={filteredRecipient || recipients}
                  updateRecipientStatus={updateRecipientCardStatus}
                  conversation={conversation}
                  setConversation={setConversation}
                  newReceivedMessage={newMessage}
                />
              </StyledConversation>
            )}
          </StyledPapaer>
        </StyledGridItem>
      </StyledGridContainer>
    </StyledRoot>
  );
};

const mapStateToProps = (state: any) => ({
  messageStatus: state.get("messages").messageStatus,
  newMessageCounter: state.getIn(["communicatorWebsocket", "communicator"])[
    "newMessageCounter"
  ],
  newMessage: state.getIn(["communicatorWebsocket", "communicator"])[
    "newMessage"
  ],
  unreadMessageCount: state.getIn(["messages", "unreadMessageCount"]),
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
)(withLoading(MessagesPage));
