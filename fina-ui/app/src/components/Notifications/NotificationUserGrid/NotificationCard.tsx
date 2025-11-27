import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import DeleteForm from "../../common/Delete/DeleteForm";
import React, { useEffect, useState } from "react";
import CommunicatorMainCardHeader from "../../Communicator/card/CommunicatorMainCardHeader";
import CommunicatorMainCardGeneralInfo from "../../Communicator/card/CommunicatorMainCardGeneralInfo";
import CommunicatorMainCardFooter from "../../Communicator/card/CommunicatorMainCardFooter";
import NotificationCardActionButtons from "../NotificationCardActionButtons";
import { styled } from "@mui/material/styles";
import { RootNotificationType } from "../../../types/notifications.type";
import { CommReviewModalType } from "../../../types/communicator.common.type";

interface NotificationCardProps {
  notification: RootNotificationType;
  index: number;
  onNotificationClick: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    notification: RootNotificationType
  ) => void;
  isSelected?: boolean;
  onSelectedNotificationDelete: (ids: number[]) => void;
  onNotificationEdit: (notification: RootNotificationType) => void;
  activeNotification: RootNotificationType | null;
  setReviewModal: React.Dispatch<React.SetStateAction<CommReviewModalType>>;
  publishHandler: (notification: RootNotificationType) => void;
}

const StyledRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  border: (theme as any).palette.borderColor,
  padding: "8px 12px",
  marginTop: 8,
  "&:hover": {
    boxShadow: "0px 2px 10px 0px #00000014",
    background:
      theme.palette.mode === "light"
        ? "#F5F5F5"
        : (theme as any).palette.buttons.secondary.hover,
  },
  cursor: "pointer",
  lineBreak: "anywhere",
  background: (theme as any).palette.paperBackground,
  "&.selectedMessage": {
    "&:hover": {
      boxShadow: (theme as any).palette.paperBoxShadow,
      background: theme.palette.action.hover,
    },
  },
  "&.openedMessage": {
    backgroundColor: isSelected
      ? (theme as any).palette.action.select
      : "inherit",
  },
}));

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  index,
  onNotificationClick,
  isSelected,
  onSelectedNotificationDelete,
  onNotificationEdit,
  activeNotification,
  setReviewModal,
  publishHandler,
}) => {
  const [selected, setSelected] = useState(false);
  const { t } = useTranslation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setSelected(activeNotification?.id === notification?.id);
  }, [activeNotification, notification]);

  return (
    <StyledRoot
      isSelected={selected}
      className={`${isSelected && "selectedMessage"} ${
        selected && "openedMessage"
      }`}
      key={index}
    >
      <Box
        onClick={(event) => {
          onNotificationClick(event, notification);
        }}
        data-testid={"card-" + index}
      >
        <CommunicatorMainCardHeader
          data={notification}
          actionButtons={
            <NotificationCardActionButtons
              notification={notification}
              setReviewModal={setReviewModal}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              publishHandler={publishHandler}
              onNotificationEdit={onNotificationEdit}
            />
          }
        />

        <CommunicatorMainCardGeneralInfo data={notification} />
        <CommunicatorMainCardFooter data={notification} />
      </Box>
      {isDeleteModalOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          additionalBodyText={t("notification")}
          onDelete={() => {
            onSelectedNotificationDelete([notification.id]);
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </StyledRoot>
  );
};

export default NotificationCard;
