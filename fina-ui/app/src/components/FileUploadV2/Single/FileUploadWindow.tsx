import PropTypes from "prop-types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import ClosableModal from "../../common/Modal/ClosableModal";
import FileUploadDropzone from "./FileUploadDropzone";
import { FileUploadStage } from "../../../util/appUtil";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";

interface FileUploadWindowProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  uploadFile: (formData: FormData, file: UploadFile) => void;
  importStage: string;
  importWarnings?: string[];
  handleCloseExternal?: () => void;
  infoTextPart1: string;
  infoTextPart2: string;
  config: any;
}

interface UploadFile {
  name?: string;
  id: string;
  file: File;
  isValid: boolean;
  invalidText?: string;
  length?: number;
}

const FileUploadWindow: React.FC<FileUploadWindowProps> = ({
  open,
  setOpen,
  config,
  uploadFile,
  importStage,
  importWarnings = [],
  handleCloseExternal,
  infoTextPart1,
  infoTextPart2,
}) => {
  const { t } = useTranslation();
  const [isValid, setIsValid] = useState(true);
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const handleClose = () => {
    if (importStage === FileUploadStage.IN_PROGRESS) {
      return;
    }
    setOpen(false);
    if (handleCloseExternal) {
      handleCloseExternal();
    }
  };

  const addFile = (f: File[]) => {
    if (!f || f?.length === 0) {
      return;
    }

    if (!f || f?.length !== 1) {
      setIsValid(false);
    } else {
      let tmpFile = {
        id: f[0].name,
        file: f[0],
        ...validateName(f[0].name || ""),
      };
      onFileUpload(tmpFile);
    }
  };

  const validateName = (name: string) => {
    for (let p of config.fileNamePatterns) {
      if (new RegExp(`^${p}$`).test(name)) {
        setIsValid(true);
        return { isValid: true, invalidText: "" };
      }
    }
    setIsValid(false);
    return { isValid: false, invalidText: t("invalidFileName") };
  };

  const onFileUpload = async (currentFile: UploadFile) => {
    setIsValid(currentFile.isValid);

    if (currentFile.isValid) {
      let formData = new FormData();
      formData.append("file", currentFile.file);
      try {
        uploadFile(formData, currentFile);
      } catch (error) {
        openErrorWindow(error);
      }
    } else {
      enqueueSnackbar(currentFile?.invalidText, { variant: "error" });
    }
  };

  const getBorderColor = () => {
    return isValid
      ? importStage === FileUploadStage.IMPORTED
        ? "#289E20"
        : theme.palette.primary.main
      : "#FF4128";
  };

  return (
    <ClosableModal
      open={open}
      padding={0}
      onClose={handleClose}
      includeHeader={false}
      width={446}
      height={340}
      border={`1px dashed ${getBorderColor()}`}
      hover={{
        background:
          theme.palette.mode === "light"
            ? importStage === FileUploadStage.IMPORTED
              ? "#E9F5E9"
              : "#EDEFF5"
            : importStage === FileUploadStage.IMPORTED
            ? "#1F2532"
            : (theme as any).palette.buttons.secondary.hover,
        border: `1px solid ${getBorderColor()}`,
      }}
    >
      <FileUploadDropzone
        isDisabled={!config.fileNamePatterns}
        addFile={addFile}
        acceptFormats={config.acceptFormats}
        isValid={isValid}
        importStage={importStage}
        importWarnings={importWarnings}
        infoTextPart1={infoTextPart1}
        infoTextPart2={infoTextPart2}
      />
    </ClosableModal>
  );
};

FileUploadWindow.propTypes = {
  open: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
  setOpen: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  importStage: PropTypes.string.isRequired,
  importWarnings: PropTypes.array,
  handleCloseExternal: PropTypes.func,
  infoTextPart1: PropTypes.string.isRequired,
  infoTextPart2: PropTypes.string.isRequired,
};

export default FileUploadWindow;
