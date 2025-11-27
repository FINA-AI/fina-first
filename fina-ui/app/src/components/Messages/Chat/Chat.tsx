import { Box, Button, IconButton, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import ChatEditor from "./ChatEditor";
import ChatConversation from "./ChatConversation";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CommunicatorStatusBox from "../../Notifications/NotificationUserGrid/CommunicatorStatusBox";
import SearchHopField from "../../common/Field/SearchHopField";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";
import {
  ConversationMarkType,
  ConversationMessage,
  RecipientType,
} from "../../../types/messages.type";
import { ChatDataType } from "../../../containers/Messages/ChatContainer";
import {
  CommAttachmentType,
  CommunicatorStatusType,
} from "../../../types/communicator.common.type";

interface ChatProps {
  closeMessageConversationCard: () => void;
  chatData: ChatDataType;
  chatStatus?: CommunicatorStatusType;
  conversation: ConversationMessage[];
  setConversation: React.Dispatch<React.SetStateAction<ConversationMessage[]>>;
  onAddMessageClick: (message: string, attachments: File[]) => void;
  onAcceptClick: (message: ConversationMessage) => void;
  onRejectClick: (message: ConversationMessage) => void;
  scrollTrackFunc: () => void;
  scrollRef: any;
  selectedUserConversation: RecipientType | null;
  onBookmarkClick: (
    messageId: number,
    mark: ConversationMarkType | null
  ) => void;
  selectedMessageId: number;
  isSendBtnDisabled: boolean;
  setIsSendBtnDisabled: (value: boolean) => void;
  attachments: CommAttachmentType[];
  setAttachments: (attachments: CommAttachmentType[]) => void;
  openBox: boolean;
  setOpenBox: (open: boolean) => void;
}

const getBookmarkToolbarIconStyles = (theme: any) => ({
  color: theme.palette.mode === "light" ? "#FFFFFF" : "#1F2532",
  fontSize: "18px",
});

const StyledRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  background: (theme as any).palette.paperBackground,
}));

const StyledToolbar = styled(Box)(({ theme }) => ({
  padding: "14px 16px",
  borderBottom: (theme as any).palette.borderColor,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  maxHeight: "58px",
  "& .MuiFormControl-root": {
    height: "30px",
  },
  "& .MuiButton-root": {
    height: "30px",
  },
}));

const StyledChatInfo = styled(Box)(({ theme }) => ({
  borderBottom: (theme as any).palette.borderColor,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
}));

const StyledName = styled("span")(({ theme }) => ({
  color: (theme as any).palette.textColor,
  fontWeight: 500,
  fontSize: "13px",
  lineHeight: "20px",
  textTransform: "capitalize",
  width: "100%",
  marginBottom: "4px",
}));

const StyledSurname = styled("span")(({ theme }) => ({
  color: (theme as any).palette.secondaryTextColor,
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "16px",
  textTransform: "capitalize",
  width: "100%",
}));

const StyledChatEditor = styled(Box)(() => ({
  borderTopLeftRadius: "3px",
  borderTopRightRadius: "3px",
  display: "flex",
  width: "100%",
  flexDirection: "column",
}));

const StyledBookmarks = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.mode === "light" ? "#FF8D00" : "#FDB022",
  borderRadius: 20,
  padding: "4px 12px",
  gap: 4,
}));

const StyledMarkedMsg = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#FFFFFF" : "#1F2532",
  fontSize: 12,
  fontWeight: 400,
}));

const StyledBookmarkCount = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#F9F9F9" : "#1F2532",
  fontSize: 12,
  fontWeight: 400,
}));

const StyledArrowDropUpIcon = styled(ArrowDropUpIcon)(({ theme }) => ({
  cursor: "pointer",
  ...getBookmarkToolbarIconStyles(theme),
}));

const StyledArrowDropDownIcon = styled(ArrowDropDownIcon)(({ theme }) => ({
  cursor: "pointer",
  ...getBookmarkToolbarIconStyles(theme),
}));

const StyledCancel = styled(Button)(({ theme }) => ({
  backgroundColor: (theme as any).palette.paperBackground,
  border: (theme as any).palette.borderColor,
  marginLeft: "8px",
}));

const StyledButtonText = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  color: (theme as any).palette.secondaryTextColor,
}));

export interface BookmarkedMessagesType {
  id: number;
  scrollto: any;
}

type SearchedInfoType = {
  hopIndex: number | null;
  searchedMessages: null | number[];
};

const Chat: React.FC<ChatProps> = ({
  closeMessageConversationCard,
  chatData,
  chatStatus,
  conversation,
  setConversation,
  onAddMessageClick,
  onAcceptClick,
  onRejectClick,
  scrollTrackFunc,
  scrollRef,
  onBookmarkClick,
  selectedUserConversation,
  selectedMessageId,
  isSendBtnDisabled,
  setIsSendBtnDisabled,
  attachments,
  setAttachments,
  openBox,
  setOpenBox,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const [searchOpen, setSearchOpen] = useState(false);
  const bookmarkedMessages = useRef<BookmarkedMessagesType[]>([]);
  const [currBookmarkedMessage, setCurrBookmarkedMessage] = useState<number>();
  const [searchedInfo, setSearchedInfo] = useState<SearchedInfoType>({
    hopIndex: null,
    searchedMessages: null,
  });

  const hasBookmarkedReviewPermission = hasPermission(
    PERMISSIONS.FINA_COMMUNICATOR_BOOKMARK_REVIEW
  );

  useEffect(() => {
    if (searchOpen) {
      setSearchOpen(false);
    }

    if (hasBookmarkedReviewPermission) {
      conversation
        .filter((item) => item.bookmarked)
        .map((bookmark) => () => {
          bookmarkedMessages.current.push({
            id: bookmark.id,
            scrollto: null,
          });
        });
    }

    return () => {
      bookmarkedMessages.current = [];
    };
  }, [selectedUserConversation, selectedMessageId]);

  const onBookmarkScrollDown = () => {
    if (!hasBookmarkedReviewPermission) {
      return;
    }

    let index = bookmarkedMessages.current.findIndex(
      (item) => item.id === currBookmarkedMessage
    );

    if (index === -1) {
      index = 0;
    }

    if (index !== bookmarkedMessages.current.length - 1) {
      setCurrBookmarkedMessage(bookmarkedMessages.current[index + 1]?.id);
      bookmarkedMessages.current[index + 1].scrollto.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  const onBookmarkScrollUp = () => {
    if (!hasBookmarkedReviewPermission) {
      return;
    }

    let index = bookmarkedMessages.current.findIndex(
      (item) => item.id === currBookmarkedMessage
    );

    if (index === -1) {
      index = bookmarkedMessages.current.length - 1;
    }

    if (index !== 0) {
      setCurrBookmarkedMessage(bookmarkedMessages.current[index - 1]?.id);
      bookmarkedMessages.current[index - 1].scrollto.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  const onSearchChange = (value: string) => {
    conversation.forEach((c) => {
      if ("temporaryContent" in c) {
        delete c.temporaryContent;
      }
      if (c?.attachments && c?.attachments.length > 0) {
        c.attachments.forEach((attachment) => {
          if ("searchTerm" in attachment) {
            delete attachment.searchTerm;
          }
        });
      }
    });

    if (value) {
      setSearchedInfo({
        hopIndex: null,
        searchedMessages: null,
      });

      value = value.toLowerCase();
      const filteredIndexes: number[] = [];
      conversation.forEach((c, index) => {
        if (c?.plainContent && c?.plainContent.includes(value)) {
          filteredIndexes.push(index);
        }
        if (c?.attachments && c?.attachments.length > 0) {
          c.attachments.forEach((attach) => {
            if (attach?.plainName && attach?.plainName.includes(value)) {
              filteredIndexes.push(index);
            }
          });
        }
      });

      if (filteredIndexes.length > 0) {
        setSearchedInfo({
          hopIndex: filteredIndexes[0],
          searchedMessages: [...filteredIndexes],
        });

        filteredIndexes.forEach((index) => {
          const htmlContent = conversation[index].content;
          const replacementTag = `<mark>${value}</mark>`;

          const replaceWordInHtml = (
            html: string,
            word: string,
            replacement: string
          ) => {
            const regex = new RegExp(`(${word})`, "gi");
            const replacer = (
              match: any,
              p1: any,
              offset: any,
              string: string
            ) => {
              if (
                string.lastIndexOf(">", offset) >
                string.lastIndexOf("<", offset)
              ) {
                return replacement;
              }
              return match;
            };

            return html.replace(regex, replacer);
          };

          const modifiedHtmlContent = replaceWordInHtml(
            htmlContent,
            value,
            replacementTag
          );

          conversation[index].temporaryContent = modifiedHtmlContent;

          const message = conversation[index];

          if (
            message &&
            message?.attachments &&
            message.attachments.length > 0
          ) {
            message.attachments.forEach((attachment) => {
              attachment.searchTerm = value.toLowerCase();
            });
          }
        });
      }
    }
    setConversation([...conversation]);
  };

  const onClear = () => {
    conversation.forEach((c) => {
      if ("temporaryContent" in c) {
        delete c.temporaryContent;
      }
    });
    setSearchedInfo({
      hopIndex: null,
      searchedMessages: null,
    });
  };

  const onNextHopClick = (activeMessageIndex: number) => {
    if (activeMessageIndex > 0 && searchedInfo?.searchedMessages) {
      setSearchedInfo({
        ...searchedInfo,
        hopIndex: searchedInfo?.searchedMessages[activeMessageIndex - 1],
      });
    }
  };

  return (
    <StyledRoot data-testid={"message-conversation-thread"}>
      <StyledToolbar data-testid={"toolbar"}>
        {searchOpen ? (
          <>
            <SearchHopField
              onSearchChange={onSearchChange}
              onClear={onClear}
              searchedTotalResult={
                searchedInfo.searchedMessages
                  ? searchedInfo.searchedMessages.length
                  : 0
              }
              onNextHopClick={(index) => onNextHopClick(index)}
            />
            <StyledCancel
              onClick={() => {
                setSearchOpen(false);
                if (searchedInfo.hopIndex !== null) {
                  onClear();
                }
              }}
              data-testid={"cancel-button"}
            >
              <StyledButtonText>{t("cancel")}</StyledButtonText>
            </StyledCancel>
          </>
        ) : (
          <>
            <IconButton style={{ border: "none", padding: "0px" }}>
              <SearchIcon
                onClick={() => {
                  setSearchOpen(true);
                }}
                data-testid={"search-icon"}
              />
            </IconButton>
            <StyledBookmarks>
              <StyledMarkedMsg>{t("markedMessages")}</StyledMarkedMsg>
              <StyledBookmarkCount>
                {hasBookmarkedReviewPermission
                  ? `(${conversation.filter((item) => item.markType).length})`
                  : "(0)"}
              </StyledBookmarkCount>
              <StyledArrowDropUpIcon
                onClick={() => {
                  onBookmarkScrollUp();
                }}
                data-testid={"scroll-up-icon"}
              />
              <StyledArrowDropDownIcon
                onClick={() => {
                  onBookmarkScrollDown();
                }}
                data-testid={"scroll-down-icon"}
              />
            </StyledBookmarks>
            <IconButton style={{ padding: "3px", border: "none" }}>
              <ClearIcon
                onClick={() => closeMessageConversationCard()}
                data-testid={"clear-icon"}
              />
            </IconButton>
          </>
        )}
      </StyledToolbar>
      <StyledChatInfo>
        <Box display={"flex"} flexDirection={"column"}>
          <StyledName data-testid={"user-login"}>{chatData.login}</StyledName>
          <StyledSurname data-testid={"user-name"}>
            {chatData.name}
          </StyledSurname>
        </Box>
        <Box>
          <CommunicatorStatusBox status={chatStatus || ""} />
        </Box>
      </StyledChatInfo>
      <Box
        display={"flex"}
        width={"100%"}
        height={"100%"}
        flexDirection={"column"}
        overflow={"auto"}
      >
        <ChatConversation
          conversation={conversation}
          setConversation={setConversation}
          onAcceptClick={onAcceptClick}
          onRejectClick={onRejectClick}
          scrollTrackFunc={scrollTrackFunc}
          scrollRef={scrollRef}
          setCurrBookmarkedMessage={setCurrBookmarkedMessage}
          bookmarkedMessages={bookmarkedMessages}
          onBookmarkClick={onBookmarkClick}
          scrollToIndex={searchedInfo.hopIndex}
        />
      </Box>
      <StyledChatEditor>
        <ChatEditor
          onSendMessage={onAddMessageClick}
          isSendBtnDisabled={isSendBtnDisabled}
          setIsSendBtnDisabled={setIsSendBtnDisabled}
          setAttachments={setAttachments}
          attachments={attachments}
          openBox={openBox}
          setOpenBox={setOpenBox}
        />
      </StyledChatEditor>
    </StyledRoot>
  );
};

export default Chat;
