import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { IconButton } from "@mui/material";
import { GetApp } from "@mui/icons-material";
import React, { ReactNode } from "react";
import { BASE_REST_URL } from "../../../util/appUtil";
import { MessageStatus } from "../messageStatus";
import { styled, useTheme } from "@mui/material/styles";
import { CommAttachmentType } from "../../../types/communicator.common.type";
import { ConversationMessage } from "../../../types/messages.type";

interface MessageAttachmentProps {
  attachment: CommAttachmentType;
  msg: ConversationMessage;
  conversation: ConversationMessage[];
  setConversation: (messages: ConversationMessage[]) => void;
}

interface MessageContainerProps {
  isIncomingMessage: boolean;
  children: ReactNode;
}

const StyledIncomingMsgContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  marginLeft: "11px",
  "& > ol, ul": {
    listStyleType: "revert",
  },
  "& > p": {
    marginBottom: "0px",
  },
});

const StyledOutgoingMsgContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
  marginRight: "11px",
  alignItems: "center",
  position: "relative",
});

const StyledAttachmentContainer = styled("div")<{ isIncomingMessage: boolean }>(
  ({ theme, isIncomingMessage }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "8px 0",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "8px",
    padding: "8px",

    ...(isIncomingMessage
      ? {
          borderBottomLeftRadius: "0px",
          color: `${(theme as any).palette.textColor} !important`,
        }
      : { borderBottomRightRadius: "0px" }),
  })
);

const StyledAttachmentIcon = styled(TextSnippetIcon)<{
  isIncomingMessage: boolean;
}>(({ theme, isIncomingMessage }) => ({
  "& .MuiSvgIcon-root": {
    width: "14px",
    height: "14px",
  },
  marginRight: "5px",
  color: isIncomingMessage
    ? theme.palette.mode === "light"
      ? "rgba(104, 122, 158, 0.8)"
      : "#F5F7FA"
    : theme.palette.mode === "light"
    ? "#FFFFFF"
    : "#1F2532",
}));

const StyledAttachmentText = styled("div")<{ isIncomingMessage: boolean }>(
  ({ theme, isIncomingMessage }) => ({
    maxWidth: "250px",
    textAlign: "left",
    fontSize: "11px",
    letterSpacing: "0px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    lineHeight: "16px",
    color: isIncomingMessage
      ? theme.palette.mode === "light"
        ? "#2C3644"
        : "#F5F7FA"
      : theme.palette.mode === "light"
      ? "#FFFFFF"
      : "#1F2532",
  })
);

const StyledAttachmentDownload = styled(GetApp)<{ isIncomingMessage: boolean }>(
  ({ theme, isIncomingMessage }) => ({
    fontSize: 14,
    margin: 5,
    color: isIncomingMessage
      ? theme.palette.mode === "light"
        ? "rgba(104, 122, 158, 0.8)"
        : "#F5F7FA"
      : theme.palette.mode === "light"
      ? "#FFFFFF"
      : "#1F2532",
  })
);

const MessageAttachment: React.FC<MessageAttachmentProps> = ({
  attachment,
  msg,
  conversation,
  setConversation,
}) => {
  const isIncomingMessage =
    msg.status === "INBOX" && msg.status !== MessageStatus.CREATED;
  const theme = useTheme();

  // eslint-disable-next-line react/prop-types
  const MessageContainer: React.FC<MessageContainerProps> = ({
    isIncomingMessage,
    children,
  }) => {
    return isIncomingMessage ? (
      <StyledIncomingMsgContainer>{children}</StyledIncomingMsgContainer>
    ) : (
      <StyledOutgoingMsgContainer>{children}</StyledOutgoingMsgContainer>
    );
  };

  const onAttachmentDownloadClick = (fileId: number) => {
    window.open(
      BASE_REST_URL + `/communicator/messages/conversation/download/${fileId}`,
      "_blank"
    );
  };

  const onAttachmentClick = (attachmentId: number, msgId: number) => {
    const message = conversation.find((item) => item.id === msgId);
    if (!message || !message.attachments) return;

    message.attachments.forEach((attachment) => {
      if (attachment.id === attachmentId) {
        attachment.showTime = !attachment.showTime;
      }
    });

    setConversation([...conversation]);
  };

  const highlightText = (text: string, query: string | undefined) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part: string, index: number) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index}>{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div key={"attachment-key-" + attachment.id}>
      <MessageContainer isIncomingMessage={isIncomingMessage}>
        <StyledAttachmentContainer
          isIncomingMessage={isIncomingMessage}
          onClick={() => {
            if (attachment?.id) onAttachmentClick(attachment.id, msg.id);
          }}
          style={{
            backgroundColor: isIncomingMessage
              ? theme.palette.mode === "light"
                ? "rgb(240, 244, 255)"
                : "#344258"
              : theme.palette.primary.main,
          }}
        >
          <StyledAttachmentIcon isIncomingMessage={isIncomingMessage} />
          <StyledAttachmentText isIncomingMessage={isIncomingMessage}>
            {highlightText(attachment.name, attachment.searchTerm)}
          </StyledAttachmentText>
          {isIncomingMessage ? (
            <IconButton
              size={"small"}
              style={{ border: "none" }}
              onClick={() => {
                if (attachment?.id) onAttachmentDownloadClick(attachment.id);
              }}
            >
              <StyledAttachmentDownload isIncomingMessage={isIncomingMessage} />
            </IconButton>
          ) : (
            <IconButton
              size={"small"}
              style={{ border: "none" }}
              onClick={() => {
                if (attachment?.id) onAttachmentDownloadClick(attachment.id);
              }}
            >
              <StyledAttachmentDownload isIncomingMessage={isIncomingMessage} />
            </IconButton>
          )}
        </StyledAttachmentContainer>
      </MessageContainer>
    </div>
  );
};

export default MessageAttachment;
