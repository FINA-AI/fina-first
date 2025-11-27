import CommunicatorStatusBox from "./NotificationUserGrid/CommunicatorStatusBox";
import { IconButton, Popover } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/system";
import { MessageReadStatus } from "../Messages/messageStatus";
import { PERMISSIONS } from "../../api/permissions";
import React, { useState } from "react";
import useConfig from "../../hoc/config/useConfig";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { loadNotificationAttachments } from "../../api/services/notificationService";
import PublishIcon from "@mui/icons-material/Publish";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Tooltip from "../common/Tooltip/Tooltip";
import { RootNotificationType } from "../../types/notifications.type";
import { UIEventType } from "../../types/common.type";
import { CommReviewModalType } from "../../types/communicator.common.type";

interface NotificationCardActionButtonsProps {
  notification: RootNotificationType;
  onNotificationEdit: (notification: RootNotificationType) => void;
  setIsDeleteModalOpen: (val: boolean) => void;
  setReviewModal: React.Dispatch<React.SetStateAction<CommReviewModalType>>;
  publishHandler: (notification: RootNotificationType) => void;
}

const StyledMoreItem = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  width: "100%",
});

const StyledTooltipItem = styled(Box)({
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
  cursor: "pointer",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
  },
  "&.disabledTooltipItem": {
    opacity: 0.2,
    pointerEvents: "none",
    "&:hover": {
      background: "inherit !important",
      cursor: "unset",
    },
  },
});

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

const NotificationCardActionButtons: React.FC<
  NotificationCardActionButtonsProps
> = ({
  notification,
  onNotificationEdit,
  setIsDeleteModalOpen,
  setReviewModal,
  publishHandler,
}) => {
  const { hasPermission } = useConfig();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const open = Boolean(anchorEl);
  const { openErrorWindow } = useErrorWindow();

  const getAttachments = () => {
    if (notification.hasAttachments) {
      loadNotificationAttachments(notification.id)
        .then((res) => {
          setReviewModal({
            open: true,
            message: notification,
            files: res.data,
          });
        })
        .catch((err) => openErrorWindow(err, t("error"), true));
    } else {
      setReviewModal({
        open: true,
        message: notification,
      });
    }
  };
  const getNotificationPublishButton = () => {
    if (
      (notification.status === "CREATED" ||
        notification.status === "PENDING") &&
      notification?.recipientCount > 0 &&
      hasPermission(PERMISSIONS.FINA_NOTIFICATIONS_ACCEPT)
    ) {
      return (
        <StyledPublishIconBox>
          <PublishIcon
            onClick={() => publishHandler(notification)}
            fontSize={"small"}
            sx={{ color: "#289E20 !important" }}
          />
        </StyledPublishIconBox>
      );
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
    setAnchorEl(null);
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

      {getNotificationPublishButton()}
      <CommunicatorStatusBox status={notification.status} />

      <StyledIconButton
        onClick={popoverOpenHandler}
        data-testid={"menu-icon-button"}
      >
        <MenuIcon />
      </StyledIconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={popoverCloseHandler}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          left: "17px",
          "& .MuiPopover-paper": {
            backgroundColor: "#2A3341 !important",
          },
        }}
      >
        <Box
          sx={{ padding: "8px", width: "110px" }}
          data-testid={"menu-content"}
        >
          {notification.status !== MessageReadStatus.INBOX && (
            <StyledTooltipItem
              className={
                !hasPermission(
                  PERMISSIONS.FINA_COMMUNICATOR_NOTIFICATIONS_AMEND
                ) || notification.status === MessageReadStatus.INBOX
                  ? "disabledTooltipItem"
                  : ""
              }
              onClick={(event) => {
                onNotificationEdit(notification);
                popoverCloseHandler(event);
              }}
              data-testid={"edit-button"}
            >
              {t("edit")}
            </StyledTooltipItem>
          )}
          <StyledTooltipItem
            className={
              !hasPermission(PERMISSIONS.FINA_COMMUNICATOR_NOTIFICATIONS_DELETE)
                ? "disabledTooltipItem"
                : ""
            }
            onClick={(event) => {
              setIsDeleteModalOpen(true);
              popoverCloseHandler(event);
            }}
            data-testid={"delete-button"}
          >
            {t("delete")}
          </StyledTooltipItem>
        </Box>
      </Popover>
    </StyledMoreItem>
  );
};

export default NotificationCardActionButtons;
