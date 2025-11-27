import ClosableModal from "../../common/Modal/ClosableModal";
import CreateMessageFormContainer from "../CreateMessage/CreateMessageFormContainer";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { CommSelectedRoot } from "../../../types/communicator.common.type";

export interface MessagesCreateModalProps {
  onClose: VoidFunction;
  open: boolean;
  selectedItem: CommSelectedRoot;
  saveMessage: (message: FormData) => void;
  isNotification: boolean;
  recipients: number[];
}

const MessagesCreateModal: React.FC<MessagesCreateModalProps> = ({
  onClose,
  open,
  selectedItem,
  saveMessage,
  recipients,
  isNotification,
}) => {
  const theme = useTheme();

  return (
    <ClosableModal
      onClose={onClose}
      open={open}
      includeHeader={false}
      disableBackdropClick={true}
      border={(theme as any).palette.borderColor}
    >
      <CreateMessageFormContainer
        onClose={onClose}
        selectedItem={selectedItem}
        sendMethod={saveMessage}
        isNotification={isNotification}
        recipients={recipients}
      />
    </ClosableModal>
  );
};

export default MessagesCreateModal;
