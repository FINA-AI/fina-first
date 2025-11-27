import { Box, TypographyProps } from "@mui/system";
import { Typography } from "@mui/material";
import React from "react";
import { MessageReadStatus } from "../../Messages/messageStatus";
import { styled } from "@mui/material/styles";
import { RootMessageType } from "../../../types/messages.type";
import { RootNotificationType } from "../../../types/notifications.type";

interface CommunicatorMainCardGeneralInfoProps {
  data: RootMessageType | RootNotificationType;
}

interface StyledTitleProps extends TypographyProps {
  _hasPendingMessage: boolean;
  _newMessages: boolean;
  component: string;
}

const StyledUserBox = styled(Box)({
  display: "flex",
  height: 20,
});

const StyledTitle = styled(Typography, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<StyledTitleProps>(({ theme, _hasPendingMessage, _newMessages }) => ({
  fontSize: _newMessages ? "10px" : "13px",
  fontWeight: _newMessages ? 400 : 500,
  color: _newMessages
    ? theme.palette.mode === "light"
      ? "#AEB8CB"
      : "inherit"
    : theme.palette.mode === "light"
    ? _hasPendingMessage
      ? "#ff7301"
      : "#5f6770"
    : _hasPendingMessage
    ? "#DC6803"
    : "#F5F7FA",
  lineHeight: _newMessages ? "13px" : "20px",
  display: "flex",
  alignItems: "center",
  marginBottom: "4px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  lineBreak: "anywhere",
  textOverflow: "ellipsis",
  paddingLeft: _newMessages ? "10px" : "",
}));

const StyledMessageContent = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "hasPendingMessage",
})<{ hasPendingMessage: boolean }>(({ theme, hasPendingMessage }) => ({
  fontSize: "12px",
  fontWeight: 400,
  lineHeight: "20px",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  maxHeight: "28px",
  color: hasPendingMessage
    ? theme.palette.mode === "light"
      ? "#ff7301"
      : "#DC6803"
    : (theme as any).palette.secondaryTextColor,
  "& p": {
    margin: "0px",
    "& span": {
      background: "inherit !important",
    },
  },
  "& a": {
    ...(theme as any).links,
  },
  marginBottom: "4px",
}));

const CommunicatorMainCardGeneralInfo: React.FC<
  CommunicatorMainCardGeneralInfoProps
> = ({ data }) => {
  const hasPendingMessage =
    ("hasPendingMessage" in data && data.hasPendingMessage) ||
    data.status === MessageReadStatus.PENDING ||
    data.status === MessageReadStatus.CREATED;

  return (
    <>
      <StyledUserBox>
        <StyledTitle
          _hasPendingMessage={hasPendingMessage}
          _newMessages={Boolean("newMessages" in data && data.newMessages)}
          component={"span"}
          data-testid={"title"}
        >
          {data.title}
        </StyledTitle>
      </StyledUserBox>
      <StyledMessageContent
        hasPendingMessage={hasPendingMessage}
        dangerouslySetInnerHTML={{ __html: data.content }}
        data-testid={"content"}
      />
    </>
  );
};

export default CommunicatorMainCardGeneralInfo;
