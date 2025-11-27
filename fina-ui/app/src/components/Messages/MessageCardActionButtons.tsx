import { Box } from "@mui/system";
import { MessageReadStatus } from "./messageStatus";
import React, { useState } from "react";
import UnreadMessageIndicator from "./UnreadMessageIndicator";
import CommunicatorStatusBox from "../Notifications/NotificationUserGrid/CommunicatorStatusBox";
import { IconButton, Popover } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useConfig from "../../hoc/config/useConfig";
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "../../api/permissions";
import { loadMessageAttachments } from "../../api/services/messagesService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Tooltip from "../common/Tooltip/Tooltip";
import { UIEventType } from "../../types/common.type";
import { RootMessageType } from "../../types/messages.type";
import { CommReviewModalType } from "../../types/communicator.common.type";
import PublishIcon from "@mui/icons-material/Publish";

export interface MessageCardActionButtonsProps {
  message: RootMessageType;
  onMessageEdit: (messageData: RootMessageType) => void;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setReviewModal: React.Dispatch<React.SetStateAction<CommReviewModalType>>;
  onMessageSend(messageId: number): void;
}

const StyledMoreItem = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  width: "100%",
});

const StyledTooltip = styled(Box)({
  padding: "8px",
  width: "110px",
});

const StyledTooltipItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDisabled",
})<{ isDisabled: boolean }>(({ isDisabled }) => ({
  height: "26px",
  padding: "4px",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "16px",
  color: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  textTransform: "capitalize",
  textJustify: "auto",
  cursor: isDisabled ? "unset" : "pointer",
  opacity: isDisabled ? 0.2 : 1,
  pointerEvents: isDisabled ? "none" : "auto",
  "&:hover": {
    background: isDisabled ? "inherit" : "rgba(255, 255, 255, 0.1)",
  },
}));

const StyledPublishIconBox = styled(Box)(({ theme }) => ({
  height: 12,
  width: 25,
  backgroundColor: theme.palette.mode === "light" ? "#E9F5E9" : "#3C4D68",
  marginRight: 10,
  borderRadius: "2px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2px 0px 2px 0px",
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginLeft: "8px",
  padding: 0,
  border: "none",
  "& .MuiSvgIcon-root": {
    ...(theme as any).smallIcon,
  },
}));

const StyledPopover = styled(Popover)({
  left: "17px",
  "& .MuiPopover-paper": {
    backgroundColor: "#2A3341 !important",
  },
});

const MessageCardActionButtons: React.FC<MessageCardActionButtonsProps> = ({
  message,
  onMessageEdit,
  setIsDeleteModalOpen,
  setReviewModal,
  onMessageSend,
}) => {
  const { hasPermission } = useConfig();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const open = Boolean(anchorEl);
  const { openErrorWindow } = useErrorWindow();

  const getMessageSendButton = () => {
    const canAccept =
      hasPermission(PERMISSIONS.COMMUNICATOR_MESSAGES_ACCEPT) ||
      (!message.hasAttachments &&
        hasPermission(
          PERMISSIONS.COMMUNICATOR_MESSAGES_ACCEPT_WITHOUT_ATTACHMENT
        ));

    if (
      (message.status === "CREATED" || message.status === "PENDING") &&
      message?.recipientCount > 0 &&
      canAccept
    ) {
      return (
        <StyledPublishIconBox>
          <PublishIcon
            onClick={() => onMessageSend(message.id)}
            fontSize={"small"}
            sx={{ color: "#289E20 !important" }}
            data-testid={"publish-icon-button"}
          />
        </StyledPublishIconBox>
      );
    }
  };

  const getAttachments = () => {
    if (message.hasAttachments) {
      loadMessageAttachments(message.id)
        .then((res) => {
          setReviewModal({
            open: true,
            message: message,
            files: res.data,
          });
        })
        .catch((err) => openErrorWindow(err, t("error"), true));
    } else {
      setReviewModal({
        open: true,
        message: message,
      });
    }
  };
  const popoverCloseHandler = (event: UIEventType) => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  const popoverOpenHandler = (event: UIEventType) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const reviewOpenHandler = (event: UIEventType) => {
    event.stopPropagation();
    getAttachments();
  };

  return (
    <StyledMoreItem>
      <Tooltip title={t("review")}>
        <VisibilityIcon
          sx={{ marginRight: "5px" }}
          onClick={reviewOpenHandler}
          data-testid={"review-icon"}
        />
      </Tooltip>

      {getMessageSendButton()}

      {message.title &&
        Boolean(message.newMessages) &&
        message.newMessages > 0 && (
          <Box marginRight={"5px"}>
            <UnreadMessageIndicator />
          </Box>
        )}

      <CommunicatorStatusBox status={message.status} />

      <StyledIconButton
        onClick={popoverOpenHandler}
        data-testid={"menu-icon-button"}
      >
        <MenuIcon />
      </StyledIconButton>
      <StyledPopover
        open={open}
        anchorEl={anchorEl}
        onClose={popoverCloseHandler}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <StyledTooltip data-testid={"menu-content"}>
          <StyledTooltipItem
            isDisabled={
              !hasPermission(PERMISSIONS.FINA_COMMUNICATOR_MESSAGES_AMEND) ||
              message.status === MessageReadStatus.INBOX
            }
            onClick={(event) => {
              onMessageEdit(message);
              popoverCloseHandler(event);
            }}
            data-testid={"edit-button"}
          >
            {t("edit")}
          </StyledTooltipItem>
          <StyledTooltipItem
            isDisabled={
              !hasPermission(PERMISSIONS.FINA_COMMUNICATOR_MESSAGES_DELETE)
            }
            onClick={(event) => {
              setIsDeleteModalOpen(true);
              popoverCloseHandler(event);
            }}
            data-testid={"delete-button"}
          >
            {t("delete")}
          </StyledTooltipItem>
        </StyledTooltip>
      </StyledPopover>
    </StyledMoreItem>
  );
};

export default MessageCardActionButtons;
