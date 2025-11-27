import { useContext } from "react";
import {
  ConfirmErrorWindowBody,
  ErrorWindowBody,
  WindowMessageContext,
  WindowOpenContext,
} from "./ErrorWindowProvider";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useErrorHandler } from "react-error-boundary";

const useErrorWindow = () => {
  const openContext = useContext(WindowOpenContext);
  const bodyContext = useContext(WindowMessageContext);
  const { enqueueSnackbar } = useSnackbar();
  const globalErrorHandler = useErrorHandler();

  const { t } = useTranslation();

  const closeErrorWindow = () => {
    openContext(false);
  };

  const openErrorWindow = (
    error,
    title,
    showInSnackbar = false,
    snackbarVariant = "error"
  ) => {
    try {
      if (showInSnackbar) {
        enqueueSnackbar(getErrorMessage(error), {
          variant: snackbarVariant,
        });
      } else {
        bodyContext(
          <ErrorWindowBody
            title={title ? title : t("error")}
            message={getErrorMessage(error)}
            modalCloseHandler={closeErrorWindow}
          />
        );
        openContext(true);
      }
    } catch {
      globalErrorHandler(error);
    }
  };

  const getErrorMessage = (error) => {
    if (!error?.response?.data) {
      return typeof error === "string" ? error : t("GENERAL_ERROR");
    }

    const { message, code, messageParams } = error.response.data;
    console.error(error.response);

    if (message) {
      return messageParams ? `${t(message)} - ${messageParams}` : t(message);
    }

    if (code) {
      return t(code);
    }

    return t("GENERAL_ERROR");
  };

  const openConfirmWindow = (message, submitFunction) => {
    bodyContext(
      <ConfirmErrorWindowBody
        message={message}
        onPrimaryClick={() => {
          submitFunction();
          openContext(false);
        }}
        onSecondaryClick={() => openContext(false)}
      />
    );

    openContext(true);
  };

  return {
    openErrorWindow,
    openConfirmWindow,
    closeErrorWindow,
    getErrorMessage,
  };
};

export default useErrorWindow;
