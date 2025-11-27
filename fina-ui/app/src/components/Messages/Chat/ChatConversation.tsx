import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import format from "date-fns/format";
import { Divider } from "@mui/material";
import isSameDay from "date-fns/isSameDay";
import useConfig from "../../../hoc/config/useConfig";
import { CALENDAR_WEEK_DAYS } from "../../../containers/Calendar/CalendarContainer";
import ChatMessage from "./ChatMessage";
import MessageAttachment from "./MessageAttachment";
import { styled } from "@mui/material/styles";
import {
  ConversationMarkType,
  ConversationMessage,
} from "../../../types/messages.type";
import { BookmarkedMessagesType } from "./Chat";

interface ChatConversationProps {
  isScrollBottom?: boolean;
  conversation: ConversationMessage[];
  onAcceptClick: (message: ConversationMessage) => void;
  onRejectClick: (message: ConversationMessage) => void;
  scrollTrackFunc: () => void;
  setConversation: (messages: ConversationMessage[]) => void;
  scrollRef: React.Ref<any>;
  setCurrBookmarkedMessage: (value: number) => void;
  bookmarkedMessages: React.MutableRefObject<BookmarkedMessagesType[]>;
  onBookmarkClick: (
    messageId: number,
    mark: ConversationMarkType | null
  ) => void;
  scrollToIndex: number | null;
}

const StyledChatContainer = styled("div")(() => ({
  overflowY: "auto",
  overflowX: "hidden",
  height: "100%",
}));

const StyledDateText = styled("div")(() => ({
  fontSize: "12px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  margin: "10px 0 10px 0",
}));

const StyledWeekDate = styled("span")(({ theme }) => ({
  color: (theme as any).palette.textColor,
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "150%",
  paddingRight: "10px",
}));

const StyledFullDate = styled("span")(({ theme }) => ({
  color: (theme as any).palette.secondaryTextColor,
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "150%",
}));

const StyledDateDivider = styled(Divider)(({ theme }) => ({
  background: "none",
  "&:after": {
    borderColor: theme.palette.mode === "light" ? "#F9F9F9" : "#3C4D68",
  },
  "&:before": {
    borderColor: theme.palette.mode === "light" ? "#F9F9F9" : "#3C4D68",
  },
}));

const ChatConversation: React.FC<ChatConversationProps> = ({
  conversation,
  setConversation,
  onAcceptClick,
  onRejectClick,
  scrollTrackFunc,
  scrollRef,
  setCurrBookmarkedMessage,
  bookmarkedMessages,
  onBookmarkClick,
  scrollToIndex,
}) => {
  const { getDateFormat } = useConfig();

  const dateFormat = getDateFormat(true);
  const { t } = useTranslation();
  const chatEndRef = useRef(null);
  const messageRefs = useRef<any>({});

  useEffect(() => {
    if (scrollToIndex !== null) {
      setTimeout(() => {
        scrollToMessage(scrollToIndex);
      }, 0);
    }
  }, [scrollToIndex]);

  const scrollToMessage = (id: number) => {
    if (messageRefs.current[id]) {
      messageRefs.current[id].scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  const getDateDivider = (date: Date | number) => {
    return (
      <StyledDateDivider>
        <StyledDateText>
          <StyledWeekDate>
            {t(CALENDAR_WEEK_DAYS[new Date(date).getDay() - 1])}
          </StyledWeekDate>
          <StyledFullDate>
            {format(new Date(date), dateFormat, new Date() as any)}
          </StyledFullDate>
        </StyledDateText>
      </StyledDateDivider>
    );
  };

  return (
    <StyledChatContainer ref={scrollRef} onScroll={scrollTrackFunc}>
      {conversation.map((item, i, items) => {
        item.plainContent = item.content
          ?.replace(/<\/?[^>]+(>|$)/g, "")
          .toLowerCase();
        return (
          <div key={"key-" + i} ref={(el) => (messageRefs.current[i] = el)}>
            <div>
              {i === 0 ||
              !isSameDay(
                new Date(items[i - 1]["sendDate"]),
                new Date(item["sendDate"])
              )
                ? getDateDivider(item["sendDate"])
                : ""}
            </div>
            {item["content"] && (
              <ChatMessage
                message={item}
                onRejectClick={onRejectClick}
                onAcceptClick={onAcceptClick}
                conversation={conversation}
                setCurrBookmarkedMessage={setCurrBookmarkedMessage}
                bookmarkedMessages={bookmarkedMessages}
                onBookmarkClick={onBookmarkClick}
              />
            )}
            {item["attachments"] &&
              item["attachments"].map((attachment, index) => {
                attachment.plainName = attachment.name?.toLowerCase();
                return (
                  <MessageAttachment
                    key={index}
                    attachment={attachment}
                    msg={item}
                    conversation={conversation}
                    setConversation={setConversation}
                  />
                );
              })}
          </div>
        );
      })}
      <div ref={chatEndRef} />
    </StyledChatContainer>
  );
};

export default ChatConversation;
