import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import DeleteForm from "../common/Delete/DeleteForm";
import CommunicatorMainCardFooter from "../Communicator/card/CommunicatorMainCardFooter";
import CommunicatorMainCardGeneralInfo from "../Communicator/card/CommunicatorMainCardGeneralInfo";
import CommunicatorMainCardHeader from "../Communicator/card/CommunicatorMainCardHeader";
import MessageCardActionButtons from "./MessageCardActionButtons";
import { styled } from "@mui/material/styles";
import { RootMessageType } from "../../types/messages.type";
import { UIEventType } from "../../types/common.type";
import { CommReviewModalType } from "../../types/communicator.common.type";

export interface MessageCardProps {
  data: RootMessageType;
  index: number;
  isSelected: boolean;
  activeMessage: RootMessageType | null;
  setReviewModal: React.Dispatch<React.SetStateAction<CommReviewModalType>>;
  onMessageEdit(messageData: RootMessageType): void;
  onSelectedMessageDelete(data?: number[]): void;
  onMessageClick(event: UIEventType, data: RootMessageType): void;
  onMessageSend(messageId: number): void;
}

const StyledRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "isActive",
})<{ isSelected: boolean; isActive: boolean }>(
  ({
    theme,
    isSelected,
    isActive,
  }: {
    theme: any;
    isSelected: boolean;
    isActive: boolean;
  }) => ({
    border: theme.palette.borderColor,
    padding: "8px 12px",
    marginTop: 8,
    cursor: "pointer",
    lineBreak: "anywhere",
    backgroundColor: isSelected
      ? "#F0F4FF"
      : isActive
      ? theme.palette.action.select
      : theme.palette.paperBackground,
    "&:hover": {
      boxShadow: "0px 2px 10px 0px #00000014",
      background:
        theme.palette.mode === "light"
          ? "#F5F5F5"
          : theme.palette.buttons.secondary.hover,
    },
  })
);

const MessageCard: React.FC<MessageCardProps> = ({
  data,
  index,
  onMessageClick,
  isSelected,
  onSelectedMessageDelete,
  onMessageEdit,
  activeMessage,
  setReviewModal,
  onMessageSend,
}) => {
  const [selected, setSelected] = useState(false);

  const { t } = useTranslation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setSelected(activeMessage?.id === data?.id);
  }, [activeMessage, data]);

  return (
    <StyledRoot
      isSelected={isSelected && selected}
      isActive={activeMessage?.id === data?.id}
      key={index}
    >
      <Box
        onClick={(event) => {
          onMessageClick(event, data);
        }}
        data-testid={"card-" + index}
      >
        <CommunicatorMainCardHeader
          data={data}
          actionButtons={
            <MessageCardActionButtons
              message={data}
              setReviewModal={setReviewModal}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              onMessageEdit={onMessageEdit}
              onMessageSend={onMessageSend}
            />
          }
        />
        <CommunicatorMainCardGeneralInfo data={data} />
        <CommunicatorMainCardFooter data={data} />
      </Box>

      {isDeleteModalOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          additionalBodyText={t("message")}
          onDelete={() => {
            onSelectedMessageDelete([data.id]);
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </StyledRoot>
  );
};

export default MessageCard;
