import { useDropzone } from "react-dropzone";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import SelectorBtn from "../../common/Button/SelectorBtn";
import { FileUploadStage } from "../../../util/appUtil";
import { Box, styled } from "@mui/system";
import LinearProgress from "@mui/material/LinearProgress";
import { FileBlueIcon } from "../../../api/ui/icons/FileBlueIcon";
import { ExcelFileIcon } from "../../../api/ui/icons/ExcelFileIcon";
import { FileGreenIcon } from "../../../api/ui/icons/FileGreenIcon";

interface FileUploadDropzoneProps {
  addFile: (files: File[]) => void;
  isDisabled: boolean;
  isValid: boolean;
  acceptFormats?: string;
  importStage: string;
  importWarnings: string[];
  infoTextPart1: string;
  infoTextPart2: string;
}

const StyledRoot = styled("div")<{ importStage: string }>(
  ({ theme, importStage }) => {
    const isImported = importStage === FileUploadStage.IMPORTED;
    const isDark = theme.palette.mode === "dark";
    const hoverBackground = isDark ? "#1f2532" : "#EDEFF5";

    return {
      padding: isImported ? "70px" : "50px",
      textAlign: "center",
      backgroundColor: theme.palette.paperBackground,
      "&:hover": {
        backgroundColor: hoverBackground,
      },
      height: "100%",
      borderWidth: 2,
      borderRadius: "6px",
    };
  }
);

const StyledWarningArea = styled("div")(() => ({
  textAlign: "center",
  color: "#9e7220",
  borderRadius: "6px",
  height: 100,
  overflowY: "auto",
  scrollbarWidth: "none",
}));
const StyledFileIcon = styled("div")(() => ({
  margin: 50,
  "& .MuiSvgIcon-root": {
    height: "20px",
  },
}));
const StyledLinearProgress = styled(Box)(() => ({
  width: "100px",
  margin: "10px 0px",
  marginTop: "40px",
  "& .MuiLinearProgress-root": {
    height: "8px",
    borderRadius: "4px",
  },
}));

const StyledText = styled("div")(({ theme, color }) => ({
  fontWeight: 500,
  fontSize: "13px",
  lineHeight: "16px",
  color: color ? color : theme.palette.mode === "light" ? "#98A7BC" : "#ABBACE",
  opacity: color ? "1" : "0.6",
}));

const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  addFile,
  isDisabled,
  acceptFormats,
  isValid,
  importStage,
  importWarnings,
  infoTextPart1,
  infoTextPart2,
}) => {
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    disabled: isDisabled,
    noKeyboard: true,
    maxFiles: 1,
    accept: acceptFormats,
  });

  const { t } = useTranslation();

  useEffect(() => {
    addFile(acceptedFiles);
  }, [acceptedFiles]);

  const getContentByStage = () => {
    switch (importStage) {
      case FileUploadStage.NOT_STARTED:
        return (
          <>
            <StyledFileIcon>
              <ExcelFileIcon />
            </StyledFileIcon>
            <StyledText>{t("dragAndDropToUpload")}</StyledText>
            <StyledText>{t("or")}</StyledText>
            <SelectorBtn
              label={t("browseFile")}
              isDisabled={false}
              onClick={open}
              width={"156px"}
            />
            {isValid && (
              <StyledText>
                {infoTextPart1} <br />
                {infoTextPart2}
              </StyledText>
            )}
            {!isValid && (
              <StyledText color={"#FF4128"}>
                {infoTextPart1} <br />
                {infoTextPart2}
              </StyledText>
            )}
          </>
        );
      case FileUploadStage.IN_PROGRESS:
        return (
          <Box
            display={"flex"}
            justifyContent={"center"}
            flexDirection={"column"}
            alignItems={"center"}
            marginTop={"50px"}
          >
            <Box
              sx={{
                "& .MuiSvgIcon-root": {
                  height: "15px",
                  width: "15px",
                },
              }}
            >
              <FileBlueIcon />
            </Box>
            <div>
              <StyledLinearProgress>
                <LinearProgress />
              </StyledLinearProgress>
            </div>
            <StyledText>{t("fileUploadProgress")}</StyledText>
          </Box>
        );
      case FileUploadStage.IMPORTED:
        return (
          <>
            <StyledFileIcon>
              <FileGreenIcon />
            </StyledFileIcon>
            <StyledText color={"#289E20"}>
              {t("fileImportedSuccessfully")}
            </StyledText>
          </>
        );
      case FileUploadStage.ADDED:
        return (
          <>
            <StyledFileIcon>
              <FileGreenIcon />
            </StyledFileIcon>
            <StyledText color={"#289E20"}>{t("fileAddedSuccess")}</StyledText>
          </>
        );
      case FileUploadStage.ERROR:
        return (
          <>
            <StyledFileIcon>
              <ExcelFileIcon />
            </StyledFileIcon>
            <StyledText color={"#FF4128"}>{t("fileImportFailed")}</StyledText>
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <StyledRoot {...getRootProps()} importStage={importStage}>
        <input {...getInputProps()} />
        <div
          style={{
            color: "#B6B6B6",
          }}
        >
          {getContentByStage()}
          {importWarnings.length > 0 && (
            <StyledWarningArea data-testid={"warning-container"}>
              {importWarnings.map((e, index) => (
                <div key={index} data-testid={"item-" + index}>
                  {e}
                </div>
              ))}
            </StyledWarningArea>
          )}
        </div>
      </StyledRoot>
    </>
  );
};

export default FileUploadDropzone;
