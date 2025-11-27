import CreateMessageForm from "./CreateMessageForm";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { useSnackbar } from "notistack";
import { CommSelectedRoot } from "../../../types/communicator.common.type";

interface CreateMessageFormContainerProps {
  onClose: () => void;
  selectedItem: CommSelectedRoot;
  sendMethod: (formData: FormData) => void;
  isNotification: boolean;
  recipients: number[];
}

const CreateMessageFormContainer: React.FC<CreateMessageFormContainerProps> = ({
  onClose,
  selectedItem,
  sendMethod,
  isNotification,
  recipients,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const onSend = async (formData: FormData) => {
    setLoading(true);
    try {
      await sendMethod(formData);
      enqueueSnackbar(t("saved"), { variant: "success" });
      onClose();
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreateMessageForm
      onSend={onSend}
      close={onClose}
      selectedItem={selectedItem}
      loading={loading}
      isNotification={isNotification}
      recipients={recipients}
    />
  );
};

export default CreateMessageFormContainer;
