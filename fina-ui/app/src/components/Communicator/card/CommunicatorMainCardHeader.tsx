import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { ReactNode } from "react";
import { MessageReadStatus } from "../../Messages/messageStatus";
import { RootMessageType } from "../../../types/messages.type";
import { RootNotificationType } from "../../../types/notifications.type";

interface CommunicatorMainCardHeaderProps {
  data: RootMessageType | RootNotificationType;
  actionButtons: ReactNode;
}

const StyledUserBox = styled(Box)({
  display: "flex",
  height: 20,
});

const StyledText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "hasPendingMessage",
})<{ hasPendingMessage: boolean; component: string }>(
  ({ theme, hasPendingMessage }) => ({
    fontSize: 13,
    fontWeight: 600,
    lineHeight: "16px",
    color: hasPendingMessage
      ? theme.palette.mode === "light"
        ? "#ff7301"
        : "#DC6803"
      : (theme as any).palette.secondaryTextColor,
    overflow: "hidden",
    whiteSpace: "nowrap",
    lineBreak: "anywhere",
    textOverflow: "ellipsis",
  })
);

const CommunicatorMainCardHeader: React.FC<CommunicatorMainCardHeaderProps> = ({
  data,
  actionButtons,
}) => {
  const hasPendingMessage =
    ("hasPendingMessage" in data && data.hasPendingMessage) ||
    data.status === MessageReadStatus.PENDING ||
    data.status === MessageReadStatus.CREATED;

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      marginBottom={"4px"}
      data-testid={"header"}
    >
      <StyledUserBox alignItems={"center"}>
        <StyledText
          component={"span"}
          hasPendingMessage={hasPendingMessage}
          color={"#8695B1"}
          data-testid={"user"}
        >
          {data.user}
        </StyledText>
        {"userLogin" in data && (
          <StyledText
            fontSize={"10px !important"}
            fontWeight={"unset !important"}
            pl={"12px"}
            component={"span"}
            hasPendingMessage={hasPendingMessage}
            data-testid={"user-login"}
          >
            {data.userLogin}
          </StyledText>
        )}
      </StyledUserBox>
      {actionButtons}
    </Box>
  );
};

export default CommunicatorMainCardHeader;
