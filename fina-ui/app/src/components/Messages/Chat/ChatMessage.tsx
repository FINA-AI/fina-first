import format from "date-fns/format";
import { Box, Checkbox, Popover } from "@mui/material";
import Tooltip from "../../common/Tooltip/Tooltip";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import React, { useEffect, useRef, useState } from "react";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { useTranslation } from "react-i18next";
import { MessageStatus } from "../messageStatus";
import useConfig from "../../../hoc/config/useConfig";
import { getFormattedDateValue, markTypes } from "../../../util/appUtil";
import { PERMISSIONS } from "../../../api/permissions";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import { keyframes, styled, useTheme } from "@mui/material/styles";
import LabelImportantOutlinedIcon from "@mui/icons-material/LabelImportantOutlined";
import { BookmarkedMessagesType } from "./Chat";
import {
  ConversationMarkType,
  ConversationMessage,
} from "../../../types/messages.type";
import { UIEventType } from "../../../types/common.type";

interface ChatMessageProps {
  message: ConversationMessage;
  onAcceptClick: (message: ConversationMessage) => void;
  onRejectClick: (message: ConversationMessage) => void;
  conversation: ConversationMessage[];
  setCurrBookmarkedMessage: (message: number) => void;
  bookmarkedMessages: React.MutableRefObject<BookmarkedMessagesType[]>;
  onBookmarkClick: (
    messageId: number,
    mark: ConversationMarkType | null
  ) => void;
}

const chatAnimation = keyframes({
  "0%": {
    opacity: 0,
  },
  "100%": {
    opacity: 1,
  },
});

const StyledMessage = styled("div")<{
  isIncomingMessage: boolean;
  textColor: string;
  background: string;
}>(({ theme, isIncomingMessage, textColor, background }) => ({
  letterSpacing: "0px",
  opacity: 1,
  background: "0% 0% no-repeat padding-box",
  maxWidth: "60%",
  margin: "4px 0",

  ...(isIncomingMessage
    ? {
        backgroundColor: background,
        padding: "12px",
        borderRadius: "10px",
        color: textColor,
        fontWeight: 400,
        fontSize: "12px",
        lineHeight: "150%",
        textTransform: "capitalize",
        lineBreak: "anywhere",
        borderBottomLeftRadius: "0px",
        "& h1, & h2, & h3": {
          fontWeight: 400,
          color: textColor,
        },
        "& h1": { fontSize: "22px !important" },
        "& h2": { fontSize: "18px !important" },
        "& h3": { fontSize: "14px !important" },
      }
    : {
        backgroundColor: theme.palette.primary.main,
        padding: "12px",
        alignSelf: "right",
        borderRadius: "10px",
        color: theme.palette.mode === "dark" ? "#1F2532" : "#F5F7FA",
        fontWeight: 400,
        fontSize: "12px",
        lineHeight: "150%",
        textTransform: "capitalize",
        lineBreak: "anywhere",
        borderBottomRightRadius: "0px",
        "& > ol, ul": {
          listStyleType: "revert",
          paddingLeft: "12px",
        },
        "& > p": {
          margin: "0px",
        },
        "& p span": {
          background: "inherit !important",
        },
        "& h1, & h2, & h3": {
          fontWeight: 400,
          color: textColor,
        },
        "& h1": { fontSize: "22px !important" },
        "& h2": { fontSize: "18px !important" },
        "& h3": { fontSize: "14px !important" },
      }),
}));

const StyledIncomingMsgContainer = styled("div")<{
  textColor: string;
  isIncomingMessage: boolean;
}>(({ textColor }) => ({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  marginLeft: "8px",
  "& h1, & h2, & h3": {
    fontWeight: 400,
    color: textColor,
  },
  "& h1": { fontSize: "22px !important" },
  "& h2": { fontSize: "18px !important" },
  "& h3": { fontSize: "14px !important" },
}));

const StyledOutgoingMsgContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
  marginRight: "8px",
  alignItems: "center",
  position: "relative",
  "&:hover": {
    cursor: "flex",
  },
  animation: `'${chatAnimation}' 0.5s ease-in-out`,
});

const StyledMessageTime = styled("div")<{ isIncomingMessage: boolean }>(
  ({ theme, isIncomingMessage }) => ({
    fontSize: "10px",
    display: "flex",

    ...(isIncomingMessage
      ? {
          justifyContent: "flex-start",
          marginLeft: "8px",
          color: theme.palette.mode === "light" ? "#1F2532" : "#5D789A",
        }
      : {
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "8px",
          color: theme.palette.mode === "light" ? "#1F2532" : "#5D789A",
        }),
  })
);

const StyledBookmarked = styled(StarIcon)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#F8C634" : "#DC6803",
  fontSize: 18,
}));

const StyledNotBookmarked = styled(StarOutlineIcon)({
  color: "rgba(104, 122, 158, 0.8)",
  fontSize: 18,
});

const StyledImportantIcon = styled(LabelImportantOutlinedIcon)({
  color: "#DC6803",
  fontSize: 18,
});

const StyledNotImportantIcon = styled(LabelImportantOutlinedIcon)({
  color: "rgba(104, 122, 158, 0.8)",
  fontSize: 18,
});

const StyledAcceptRejectButtons = styled(Box)({
  marginBottom: 5,
});

const StyledAccept = styled(DoneIcon)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#289E20" : "#079455",
  borderRadius: 27,
  color: "#FFFFFF",
  height: 20,
  width: 20,
  fontSize: 12,
  marginRight: 5,
  cursor: "pointer",
}));

const StyledReject = styled(ClearIcon)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#FF4128" : "#B42318",
  color: "#FFFFFF",
  borderRadius: 27,
  height: 20,
  width: 20,
  fontSize: 12,
  cursor: "pointer",
}));

const StyledMessageAdditionalInfo = styled("div")<{ status: string }>(
  ({ status }) => ({
    marginTop: "10px",
    fontSize: 10,
    width: "100%",
    display: "flex",
    justifyContent: status !== "INBOX" ? "flex-end" : "flex-start",
    gap: 8,
  })
);

const StyledMessageStatus = styled("span")<{
  status: string;
  isIncomingMessage: boolean;
}>(({ theme, status, isIncomingMessage }) => {
  let statusColor;
  if (isIncomingMessage && status !== MessageStatus.REJECTED) {
    statusColor = theme.palette.mode === "light" ? "#2C3644" : "#F5F7FA";
  } else if (status === MessageStatus.OUTBOX) {
    statusColor = theme.palette.mode === "light" ? "#D4E0FF" : "#2C3644";
  } else if (status === MessageStatus.CREATED) {
    statusColor = theme.palette.mode === "light" ? "#D4E0FF" : "#2C3644";
  } else if (status === MessageStatus.REJECTED) {
    statusColor = "#FF4128";
  } else {
    statusColor = "#D4E0FF";
  }

  switch (status) {
    case MessageStatus.PENDING:
      return {
        background: theme.palette.mode === "light" ? "#ffbd15" : "#DC6803",
        color: theme.palette.mode === "light" ? "#fff" : "#FEF0C7",
        borderRadius: "5px",
        padding: "2px",
        borderRight: "none",
        paddingRight: "5px",
        marginRight: "5px",
        borderColor: statusColor,
      };
    case MessageStatus.REJECTED:
      return {
        background:
          theme.palette.mode === "light" ? "rgb(255, 236, 233)" : "#B42318",
        color: theme.palette.mode === "light" ? "rgb(255, 65, 40)" : "#FEE4E2",
        borderRadius: "5px",
        padding: "2px",
        borderRight: "none",
        paddingRight: "5px",
        marginRight: "5px",
        borderColor: statusColor,
      };
    case MessageStatus.ACCEPTED:
      return {
        background:
          theme.palette.mode === "light" ? "rgb(233, 245, 233)" : "#079455",
        color: theme.palette.mode === "light" ? "rgb(40, 158, 32)" : "#ABEFC6",
        borderRadius: "5px",
        padding: "2px",
        borderRight: "none",
        paddingRight: "5px",
        marginRight: "5px",
        borderColor: statusColor,
      };
    default:
      return {
        color: statusColor,
        borderRight: (theme as any).palette.borderColor,
        paddingRight: "5px",
        marginRight: "5px",
      };
  }
});

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onAcceptClick,
  onRejectClick,
  setCurrBookmarkedMessage,
  bookmarkedMessages,
  onBookmarkClick,
}) => {
  const { getDateFormat, hasPermission } = useConfig();
  const readDateFormat = getDateFormat(false);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [markType, setMarkType] = useState<ConversationMarkType>(null);

  const isIncomingMessage =
    message.status === "INBOX" && message.status !== MessageStatus.CREATED;

  let textColor =
    isIncomingMessage && message.status !== MessageStatus.REJECTED
      ? theme.palette.mode === "light"
        ? "#2C3644"
        : "#F5F7FA"
      : message.status === MessageStatus.OUTBOX
      ? theme.palette.mode === "light"
        ? "#D4E0FF"
        : "#2C3644"
      : message.status === MessageStatus.CREATED
      ? "#D4E0FF"
      : message.status === MessageStatus.REJECTED
      ? "#2C3644"
      : "#2C3644";

  let background =
    isIncomingMessage && message.status !== MessageStatus.REJECTED
      ? theme.palette.mode === "light"
        ? "#F0F4FF"
        : "#344258"
      : message.status === MessageStatus.OUTBOX
      ? "#2962FF"
      : message.status === MessageStatus.CREATED
      ? "#7096FF"
      : message.status === MessageStatus.REJECTED
      ? "#FFECE9"
      : "#F0F4FF";

  const { t } = useTranslation();
  const messageRef = useRef<any>(null);

  useEffect(() => {
    if (message.markType) {
      if (!bookmarkedMessages.current.find((item) => item.id === message.id)) {
        bookmarkedMessages.current.push({
          id: message.id,
          scrollto: messageRef.current,
        });
      } else {
        const findMessage = bookmarkedMessages.current.find(
          (item) => item.id === message.id
        );
        if (findMessage) {
          let index = bookmarkedMessages.current.indexOf(findMessage);
          bookmarkedMessages.current[index] = {
            id: message.id,
            scrollto: messageRef.current,
          };
        }
      }

      setMarkType(message.markType);
    }
    messageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }, [message]);

  const getBookmark = (msg: ConversationMessage) => {
    const handleClick = (event: UIEventType) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "bookmark-popover" : undefined;

    const handleMarkClick = (type: ConversationMarkType) => {
      if (markType === type) {
        const index = bookmarkedMessages.current.findIndex(
          (item) => item.id === message.id
        );
        if (index !== -1) bookmarkedMessages.current.splice(index, 1);
      } else {
        bookmarkedMessages.current.push({
          id: message.id,
          scrollto: messageRef.current,
        });
        bookmarkedMessages.current.sort((a, b) => a.id - b.id);
      }
      setMarkType(markType === type ? null : type);
      onBookmarkClick(msg.id, markType === type ? null : type);
      setCurrBookmarkedMessage(msg.id);
      handleClose();
    };

    return (
      hasPermission(PERMISSIONS.COMMUNICATOR_MESSAGES_BOOKMARK_AMEND) &&
      hasPermission(PERMISSIONS.FINA_COMMUNICATOR_BOOKMARK_REVIEW) && (
        <Box height={"fit-content"} display={"flex"} alignItems={"center"}>
          {markType === markTypes.bookmark && (
            <Checkbox
              icon={<StyledNotBookmarked />}
              checked={markType === markTypes.bookmark}
              checkedIcon={<StyledBookmarked />}
              onClick={(event) => {
                handleClick(event);
              }}
            />
          )}

          {markType === markTypes.important && (
            <Checkbox
              icon={<StyledNotImportantIcon />}
              checked={markType === markTypes.important}
              checkedIcon={<StyledImportantIcon />}
              onClick={(event) => {
                handleClick(event);
              }}
            />
          )}

          {markType === null && (
            <Checkbox
              icon={<StyledNotBookmarked />}
              checked={false}
              checkedIcon={<StyledBookmarked />}
              onClick={(event) => {
                handleClick(event);
              }}
            />
          )}

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
          >
            <Box display="flex" alignItems="center" p={1} gap={1}>
              <Tooltip title={t("star")}>
                {markType === markTypes.bookmark && anchorEl ? (
                  <StyledBookmarked
                    sx={{ cursor: "pointer" }}
                    onClick={() =>
                      handleMarkClick(
                        markTypes.bookmark as ConversationMarkType
                      )
                    }
                  />
                ) : (
                  <StarOutlineIcon
                    sx={{
                      color: "rgba(104, 122, 158, 0.8)",
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.3)",
                      },
                    }}
                    onClick={() =>
                      handleMarkClick(
                        markTypes.bookmark as ConversationMarkType
                      )
                    }
                  />
                )}
              </Tooltip>
              <Tooltip title={t("important")}>
                <LabelImportantOutlinedIcon
                  sx={{
                    color:
                      markType === markTypes.important
                        ? "#DC6803"
                        : "rgba(104, 122, 158, 0.8)",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.3)",
                    },
                  }}
                  onClick={() =>
                    handleMarkClick(markTypes.important as ConversationMarkType)
                  }
                />
              </Tooltip>
            </Box>
          </Popover>
        </Box>
      )
    );
  };

  const MessageContainer = isIncomingMessage
    ? StyledIncomingMsgContainer
    : StyledOutgoingMsgContainer;

  let messageTime = format(
    new Date(message["sendDate"]),
    "HH:mm",
    new Date() as any
  );

  let messageContent = message["temporaryContent"] || message["content"];

  const AcceptRejectButtons = () => {
    const displayAcceptRejectButtons = () => {
      const hasAttachments =
        message.attachments && message.attachments.length > 0;
      const visibilityAccordingStatus =
        message.status === MessageStatus.CREATED ||
        message.status === MessageStatus.PENDING;

      if (!visibilityAccordingStatus) {
        return false;
      }

      if (hasAttachments) {
        return hasPermission(PERMISSIONS.COMMUNICATOR_MESSAGES_ACCEPT);
      }

      return (
        hasPermission(
          PERMISSIONS.COMMUNICATOR_MESSAGES_ACCEPT_WITHOUT_ATTACHMENT
        ) || hasPermission(PERMISSIONS.COMMUNICATOR_MESSAGES_ACCEPT)
      );
    };

    return displayAcceptRejectButtons() ? (
      <StyledAcceptRejectButtons>
        <Tooltip title={t("accept")}>
          <StyledAccept
            onClick={() => {
              onAcceptClick(message);
            }}
          />
        </Tooltip>
        <Tooltip title={t("reject")}>
          <StyledReject
            onClick={() => {
              onRejectClick(message);
            }}
          />
        </Tooltip>
      </StyledAcceptRejectButtons>
    ) : (
      <></>
    );
  };

  const Content = () => {
    return (
      <Box>
        <div
          style={{ textTransform: "none", lineBreak: "auto" }}
          dangerouslySetInnerHTML={{ __html: messageContent }}
        />
        <StyledMessageAdditionalInfo status={message.status}>
          <div>
            <StyledMessageStatus
              status={message.status}
              isIncomingMessage={isIncomingMessage}
            >
              {message.status}
            </StyledMessageStatus>
            {messageTime}
          </div>
        </StyledMessageAdditionalInfo>
      </Box>
    );
  };

  return (
    <>
      <MessageContainer
        ref={messageRef}
        textColor={textColor}
        isIncomingMessage={isIncomingMessage}
      >
        {/*TODO - html injection*/}
        {!isIncomingMessage && <> {getBookmark(message)} </>}
        <StyledMessage
          isIncomingMessage={isIncomingMessage}
          textColor={textColor}
          background={background}
        >
          <AcceptRejectButtons />
          <Content />
        </StyledMessage>
        {isIncomingMessage && <> {getBookmark(message)} </>}
      </MessageContainer>
      <StyledMessageTime isIncomingMessage={isIncomingMessage}>
        {message.userLogin + (message.readDate ? " | " : "")}
        {message?.readDate && (
          <Box display={"flex"} alignItems={"center"}>
            <div>
              &nbsp;
              {`${getFormattedDateValue(message.readDate, readDateFormat)}`}
            </div>
            <DoneAllRoundedIcon style={{ height: 12 }} />
          </Box>
        )}
      </StyledMessageTime>
    </>
  );
};

export default ChatMessage;
